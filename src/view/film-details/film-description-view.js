import AbstractView from '../../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const createFilmDescriptionTemplate = (film) => {
  const {
    filmInfo: {title, alternativeTitle, poster, director, writers, actors, description, genre, runtime, release: {date, releaseCountry}},
    userDetails: {watchlist, alreadyWatched, favorite}} = film;
  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">18+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">8.9</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(date).format('DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">1h ${runtime - 60}m</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genre}</span>
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

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDescriptionTemplate(this.#film);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  unsetClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
