import dayjs from 'dayjs';

import AbstractView from '../../framework/view/abstract-view.js';
import { SHAKE_CLASS_NAME, SHAKE_ANIMATION_TIMEOUT } from '../../const.js';

const createFilmDescriptionTemplate = (film) => {
  const {
    filmInfo: {title, totalRating, alternativeTitle, poster, ageRating, director, writers, actors, description, genre, runtime, release: {date, releaseCountry}},
    userDetails: {watchlist, alreadyWatched, favorite}} = film;
  const runtimeHours = Math.floor(runtime/60);
  const runtimeMinutes = runtime % 60;
  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(date).format('DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runtimeHours}h ${runtimeMinutes}m</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genre.join(', ')}</span>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button
          type="button"
          class="film-details__control-button film-details__control-button--watchlist ${(watchlist) ? 'film-details__control-button--active' : ''}"
          id="watchlist"
          name="watchlist">Add to watchlist
        </button>
        <button
          type="button"
          class="film-details__control-button film-details__control-button--watched
          ${(alreadyWatched) ? 'film-details__control-button--active' : ''}"
          id="watched"
          name="watched">Already watched
        </button>
        <button
          type="button"
          class="film-details__control-button film-details__control-button--favorite
          ${(favorite) ? 'film-details__control-button--active' : ''}"
          id="favorite"
          name="favorite">Add to favorites</button>
      </section>
    </div>
  `);
};

export default class FilmDescriptionView extends AbstractView {
  #film = null;
  #closeButton = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDescriptionTemplate(this.#film);
  }

  setAddToWatchlistHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element
      .querySelector('#watchlist')
      .addEventListener('click', this.#addToWatchlistHandler);
  };

  setAlreadyWatchedHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element
      .querySelector('#watched')
      .addEventListener('click', this.#alreadyWatchedHandler);
  };

  setAddToFavoritesHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element
      .querySelector('#favorite')
      .addEventListener('click', this.#addToFavoritesHandler);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.#closeButton = this.element.querySelector('.film-details__close-btn');
    this.#closeButton.addEventListener('click', this.#clickHandler);
  };

  unsetClickHandler = () => {
    this.#closeButton.removeEventListener('click', this.#clickHandler);
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

  shakeControls = () => {
    const controlsElement = this.element.querySelector('.film-details__controls');
    controlsElement
      .classList
      .add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      controlsElement.classList.remove(SHAKE_CLASS_NAME);
    }, SHAKE_ANIMATION_TIMEOUT);
  };
}
