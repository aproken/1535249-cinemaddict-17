import {nanoid} from 'nanoid';

import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  //получить фильмы
  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  //Записать фильмы
  set films(value) {
    this.#films = value;

    this._notify(UpdateType.MAJOR, value);
  }

  getFilmById = (filmId) => this.#films.find((filmItem) => filmItem.id === filmId);

  //изменить отдельный фильм
  updateFilm = async (updateType, update) => {
    let film = this.getFilmById(update.id);

    // TODO: нужно ли обновлять список комментариев с сервера?
    const comments = film.comments;

    if (!film) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      film = {
        ...this.#adaptToClient(response),
        comments
      };

      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t update film');
    }

    this._notify(updateType, update);
  };

  addComment = (updateType, filmId, currentComment) => {
    const film = this.#films.find((filmItem) => filmItem.id === filmId);

    if (film === undefined) {
      throw new Error('Can\'t delete unexisting film');
    }

    // Подстановка ID (Пока нет сервера)
    currentComment.id = nanoid();

    film.comments = [
      ...film.comments,
      currentComment,
    ];

    this._notify(updateType, film);
  };

  deleteComment = (updateType, filmId, commentId) => {
    const film = this.#films.find((filmItem) => filmItem.id === filmId);
    const commentIndex = film.comments.findIndex((comment) => comment.id === commentId);

    if (film === undefined) {
      throw new Error('Can\'t delete unexisting film');
    }

    film.comments = [
      ...film.comments.slice(0, commentIndex),
      ...film.comments.slice(commentIndex + 1),
    ];

    this._notify(updateType, film);
  };

  refreshComments = async (filmId) => {
    const film = this.#films.find((filmItem) => filmItem.id === filmId);
    const comments = await this.#filmsApiService.refreshComments(filmId);
    film.comments = comments.map(this.#adaptCommentsToClient);

    this._notify(UpdateType.PATCH, film);
    return film.comments;
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      comments: [],
      filmInfo: {
        ...film.film_info,
        alternativeTitle: film.film_info.alternative_title,
        totalRating: film.film_info.total_rating,
        ageRating: film.film_info.age_rating,
        release: {
          date: film.film_info.release.date,
          releaseCountry: film.film_info.release.release_country,
        },
      },
      userDetails: {
        ...film.user_details,
        alreadyWatched: film.user_details.already_watched,
        watchingDate: film.user_details.watching_date,
      }
    };

    delete adaptedFilm.film_info;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.release.release_country;
    delete adaptedFilm.user_details;
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;

    return adaptedFilm;
  };

  #adaptCommentsToClient = (comment) => {
    const adaptedComment = {
      ...comment,
      commentText: comment.comment,
    };

    delete adaptedComment.comment;

    return adaptedComment;
  };
}
