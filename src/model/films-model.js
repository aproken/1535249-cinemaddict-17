import {nanoid} from 'nanoid';

import Observable from '../framework/observable.js';
import { FILMS_COUNT, UpdateType } from '../const.js';
import { generateFilm } from '../mock/film.js';

export default class FilmsModel extends Observable {
  #films = [];

  init = () => {
    this.#films = Array.from({length: FILMS_COUNT}, generateFilm);
  };

  //получить фильмы
  get films() {
    return this.#films;
  }

  //Записать фильмы
  set films(value) {
    this.#films = value;

    this._notify(UpdateType.MAJOR, value);
  }

  getFilmById = (filmId) => this.#films.find((filmItem) => filmItem.id === filmId);

  //изменить отдельный фильм
  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

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
    const commentIdx = film.comments.findIndex((comment) => comment.id === commentId);

    if (film === undefined) {
      throw new Error('Can\'t delete unexisting film');
    }

    film.comments = [
      ...film.comments.slice(0, commentIdx),
      ...film.comments.slice(commentIdx + 1),
    ];

    this._notify(updateType, film);
  };
}
