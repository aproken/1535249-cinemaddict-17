import { RenderPosition, render, remove } from '../framework/render.js';

import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import FilmsView from '../view/films-card/films-view.js';
import FilmsListView from '../view/films-card/films-list-view.js';
import FilmsListEmptyView from '../view/films-card/films-list-empty-view.js';
import FilmsListContainerView from '../view/films-card/films-list-container-view.js';
import FilmsListShowMoreView from '../view/films-card/films-list-show-more-view.js';
import FilmsListTopRatedView from '../view/films-card/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-card/films-list-most-commented-view.js';

import FilmCardPresenter from './film-card-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import { generateFilter } from '../mock/filter.js';

import { FILM_COUNT_ON_SCREEN, FilterType, UserAction, UpdateType } from '../const.js';
import { sortFilmByDate, sortFilmByRating } from '../utils/sort.js';
import { SortType } from '../const.js';

export default class FilmBoardPresenter {
  #filmsContainer = null;
  #filmDetailsContainer = null;
  #filmsModel = null;

  #filterComponent = null;
  #sortComponent = null;
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmslistEmptyComponent = null;
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListShowMoreComponent = new FilmsListShowMoreView();

  #films = [];
  #currentFilter = null;
  #filters = null;
  #currentSortType = SortType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_ON_SCREEN;
  #filmCardPresenter = new Map();
  #filmDetailsPresenter = null;
  #sourcedFilms = [];

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmDetailsContainer = document.querySelector('.footer');
    this.#filmsModel = filmsModel;

    this.#films = [...this.#filmsModel.films];
    this.#sourcedFilms = [...this.#filmsModel.films];
    this.#currentFilter = FilterType.ALL;

    this.#filters = generateFilter(filmsModel.films);

    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#filmDetailsContainer, this.#handleViewAction);

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get(films) {
    return this.#filmsModel(films);
  }

  init = () => {
    this.#renderFilmBoard();
  };

  #handleFilmsListShowMoreClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_ON_SCREEN);
    this.#renderedFilmCount += FILM_COUNT_ON_SCREEN;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#filmsListShowMoreComponent);
    }
  };

  #handleAddToWatchlist = (filmId) => {
    const film = this.#filmsModel.getFilmById(filmId);
    film.userDetails['watchlist'] = !film.userDetails['watchlist'];
    return film;
  };

  #handleAlreadyWatched = (filmId) => {
    const film = this.#filmsModel.getFilmById(filmId);
    film.userDetails['alreadyWatched'] = !film.userDetails['alreadyWatched'];
    return film;
  };

  #handleAddToFavorites = (filmId) => {
    const film = this.#filmsModel.getFilmById(filmId);
    film.userDetails['favorite'] = !film.userDetails['favorite'];
    return film;
  };

  #handleViewAction = (actionType, updateType, payload) => {
    switch (actionType) {
      case UserAction.ADD_TO_WATCHLIST:
        this.#filmsModel.updateFilm(
          updateType,
          this.#handleAddToWatchlist(payload.filmId)
        );
        break;
      case UserAction.ADD_TO_ALREADY_WATCHED:
        this.#filmsModel.updateFilm(
          updateType,
          this.#handleAlreadyWatched(payload.filmId)
        );
        break;
      case UserAction.ADD_TO_FAVORITES:
        this.#filmsModel.updateFilm(
          updateType,
          this.#handleAddToFavorites(payload.filmId)
        );
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.addComment(
          updateType,
          payload.filmId,
          payload.currentComment
        );
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.deleteComment(
          updateType,
          payload.filmId,
          payload.commentId
        );
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmCardPresenter.get(data.id).init(data);

        if (this.#filmDetailsPresenter.film){
          this.#filmDetailsPresenter.show(data);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmList();
        this.#renderFilmList();

        if (this.#filmDetailsPresenter.film){
          this.#filmDetailsPresenter.show(data);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmList();
        break;
    }
  };

  #renderFilter = () => {
    this.#filterComponent = new FilterView(this.#filters);
    render(this.#filterComponent, this.#filmsContainer);
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortFilmByDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortFilmByRating);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearSort();
    this.#clearFilmList();
    this.#renderSort();
    this.#renderFilmList();
  };

  #clearSort = () => {
    remove(this.#sortComponent);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#films, this.#currentSortType);
    render(this.#sortComponent, this.#filterComponent.element, RenderPosition.AFTEREND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderFilm = (film) => {
    const currentFilmCardPresenter = new FilmCardPresenter(this.#filmsListContainerComponent.element, this.#filmDetailsPresenter, this.#handleViewAction);
    currentFilmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, currentFilmCardPresenter);

  };

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  };

  #renderFilmsListEmpty = () => {
    this.#filmslistEmptyComponent = new FilmsListEmptyView(this.#currentFilter);
    render(this.#filmslistEmptyComponent, this.#filmsComponent.element);
  };

  #clearFilmList = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();

    this.#renderedFilmCount = FILM_COUNT_ON_SCREEN;
    remove(this.#filmsListShowMoreComponent);
  };

  #renderFilmList = () => {
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for(let i = 0; i < Math.min(this.#films.length, FILM_COUNT_ON_SCREEN); i++) {
      this.#renderFilm(this.#films[i]);

      this.#filmsListShowMoreComponent.setClickHandler(this.#handleFilmsListShowMoreClick);
    }

    render(this.#filmsListShowMoreComponent, this.#filmsListComponent.element);
  };

  #renderFilmBoard = () => {
    this.#renderFilter();
    this.#renderSort();

    render(this.#filmsComponent, this.#filmsContainer);

    if (!this.#films.length) {
      this.#renderFilmsListEmpty();
      return;
    }

    this.#renderFilmList();
  };
}

