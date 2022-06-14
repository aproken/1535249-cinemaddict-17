import { render, replace, remove } from '../framework/render.js';

import FilmCardView from '../view/films-card/film-card-view.js';
import { UserAction, UpdateType } from '../const.js';


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

  #handleAddToWatchlist = () => this.#changeData(
    UserAction.ADD_TO_WATCHLIST,
    UpdateType.MINOR,
    {filmId: this.#film.id}
  );

  #handleAlreadyWatched = () => this.#changeData(
    UserAction.ADD_TO_ALREADY_WATCHED,
    UpdateType.MINOR,
    {filmId: this.#film.id}
  );

  #handleAddToFavorites = () => this.#changeData(
    UserAction.ADD_TO_FAVORITES,
    UpdateType.MINOR,
    {filmId: this.#film.id}
  );
}
