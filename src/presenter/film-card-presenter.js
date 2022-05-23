import { render, replace, remove } from '../framework/render.js';

import FilmCardView from '../view/films-card/film-card-view.js';

export default class FilmCardPresenter {
  #filmListContainer = null;
  #changeData = null;
  #filmDetailsContainer = null;

  #filmCardComponent = null;

  #filmDetailsPresenter = null;

  #film = null;

  constructor(filmListContainer, filmDetailsPresenter, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#filmDetailsPresenter = filmDetailsPresenter;

    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setClickHandler(this.#showFilmDetails);
    this.#filmCardComponent.setAddToWatchlistHandler(this.#handleAddToWatchlist);
    this.#filmCardComponent.setAlreadyWatchedHandler(this.#handleAlreadyWatched);
    this.#filmCardComponent.setAddToFavoritesHandler(this.#handleAddToFavorites);

    if (!prevFilmCardComponent) {
      render(this.#filmCardComponent, this.#filmListContainer);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  #showFilmDetails = () => {
    this.#filmDetailsPresenter.show(this.#film);
  };

  #handleAddToWatchlist = () => {
    this.#film.userDetails['watchlist'] = !this.#film.userDetails['watchlist'];
    this.#changeData(this.#film);
  };

  #handleAlreadyWatched = () => {
    this.#film.userDetails['alreadyWatched'] = !this.#film.userDetails['alreadyWatched'];
    this.#changeData(this.#film);
  };

  #handleAddToFavorites = () => {
    this.#film.userDetails['favorite'] = !this.#film.userDetails['favorite'];
    this.#changeData(this.#film);
  };
}
