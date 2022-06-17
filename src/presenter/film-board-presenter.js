import { RenderPosition, render, remove } from '../framework/render.js';

import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-card/films-view.js';
import FilmsListView from '../view/films-card/films-list-view.js';
import FilmsListEmptyView from '../view/films-card/films-list-empty-view.js';
import LoadingView from '../view/loading-view.js';
import FilmsListContainerView from '../view/films-card/films-list-container-view.js';
import FilmsListShowMoreView from '../view/films-card/films-list-show-more-view.js';
import FilmsListTopRatedView from '../view/films-card/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-card/films-list-most-commented-view.js';

import FilmCardPresenter from './film-card-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import { FILM_COUNT_ON_SCREEN, FilterType, SortType, UserAction, UpdateType } from '../const.js';
import {filter} from '../utils/filter.js';
import { sortFilmByDate, sortFilmByRating } from '../utils/sort.js';

export default class FilmBoardPresenter {
  #filmsContainer = null;
  #filmDetailsContainer = null;
  #filmsModel = null;
  #filterModel = null;

  #sortComponent = null;
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #loadingComponent = new LoadingView();
  #filmslistEmptyComponent = null;
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListShowMoreComponent = new FilmsListShowMoreView();

  #renderedFilmCount = FILM_COUNT_ON_SCREEN;
  #filmCardPresenter = new Map();
  #filmDetailsPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(filmsContainer, filmsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmDetailsContainer = document.querySelector('.footer');
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#filmDetailsContainer, this.#handleViewAction);

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmBoard();
  };

  #handleFilmsListShowMoreClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_ON_SCREEN);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
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
        this.#filmCardPresenter.get(data.id).init(data.id);

        if (this.#filmDetailsPresenter.film){
          this.#filmDetailsPresenter.show(data);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmBoard();
        this.#renderFilmBoard();

        if (this.#filmDetailsPresenter.film){
          this.#filmDetailsPresenter.show(data);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmBoard({resetRenderedFilmCount: true});
    this.#renderFilmBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilm = (film) => {
    const currentFilmCardPresenter = new FilmCardPresenter(this.#filmsListContainerComponent.element, this.#filmDetailsPresenter, this.#filmsModel, this.#handleViewAction);
    currentFilmCardPresenter.init(film.id);
    this.#filmCardPresenter.set(film.id, currentFilmCardPresenter);

  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilmsListEmpty = () => {
    this.#filmslistEmptyComponent = new FilmsListEmptyView(this.#filterModel.filter);
    render(this.#filmslistEmptyComponent, this.#filmsComponent.element);
  };

  #renderfilmsListShowMore = () => {
    this.#filmsListShowMoreComponent.setClickHandler(this.#handleFilmsListShowMoreClick);

    render(this.#filmsListShowMoreComponent, this.#filmsListComponent.element);
  };

  #clearFilmBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#filmsListShowMoreComponent);

    if (this.#filmslistEmptyComponent) {
      remove(this.#filmslistEmptyComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_ON_SCREEN;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }


    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmBoard = () => {
    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    if (!filmCount) {
      this.#renderFilmsListEmpty();
      return;
    }

    this.#renderSort();

    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);
    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderfilmsListShowMore();
    }
  };
}

