import dayjs from 'dayjs';

import AbstractView from '../../framework/view/abstract-view.js';
import { MAX_LENGTH_DESCRIPTION } from '../../const.js';

export const createFilmCardTemplate = (film) => {
  const {
    comments,
    filmInfo: {title, totalRating, poster, description, genre, runtime, release: {date}},
    userDetails: {watchlist, alreadyWatched, favorite},
  } = film;

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${dayjs(date).format('YYYY')}</span>
          <span class="film-card__duration">1h ${runtime - 60}m</span>
          <span class="film-card__genre">${genre[0]}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description.slice(0, MAX_LENGTH_DESCRIPTION - 1)}...</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist
        ${(watchlist) ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched
        ${(alreadyWatched) ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite
        ${(favorite) ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};


export default class FilmCardSView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setAddToWatchlistHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#addToWatchlistHandler);
  };

  setAlreadyWatchedHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#alreadyWatchedHandler);
  };

  setAddToFavoritesHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#addToFavoritesHandler);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element
      .querySelector('.film-card__link')
      .addEventListener('click', this.#clickHandler);
  };

  unsetClickHandler = () => {
    this.element.removeEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #addToWatchlistHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #alreadyWatchedHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  };

  #addToFavoritesHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
