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
    const comments = film.comments;

    if (!film) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      film = {
        ...updatedFilm,
        comments,
      };

      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t update film');
    }

    this._notify(updateType, update);
  };

  addComment = async (updateType, filmId, comment) => {
    const filmIndex = this.#films.findIndex((filmItem) => filmItem.id === filmId);

    if (filmIndex === -1) {
      throw new Error('Can\'t delete unexisting film');
    }

    try {
      const response = await this.#filmsApiService.addLocalComment(filmId, comment);
      const newComments = response.comments.map((commentItem) => this.#adaptCommentsToClient(commentItem));
      const newFilm = this.#adaptToClient(response.movie);
      newFilm.comments = newComments;

      this.#films = [
        ...this.#films.slice(0, filmIndex),
        newFilm,
        ...this.#films.slice(filmIndex + 1),

      ];

      this._notify(updateType, newFilm);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, filmId, commentId) => {
    const film = this.#films.find((filmItem) => filmItem.id === filmId);
    const commentIndex = film.comments.findIndex((comment) => comment.id === commentId);

    if (film === undefined) {
      throw new Error('Can\'t delete unexisting film');
    }

    try {
      await this.#filmsApiService.deleteComment(commentId);

      film.comments = [
        ...film.comments.slice(0, commentIndex),
        ...film.comments.slice(commentIndex + 1),
      ];

      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
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
