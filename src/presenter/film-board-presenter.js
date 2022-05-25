import { render, remove } from '../framework/render.js';

import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import FilmsView from '../view/films-card/films-view.js';
import FilmsListView from '../view/films-card/films-list-view.js';
import FilmsListEmptyView from '../view/films-card/films-list-empty-view.js';
import FilmsListContainerView from '../view/films-card/films-list-container-view.js';
import FilmsListShowMoreView from '../view/films-card/films-list-show-more-view.js';

import FilmCardPresenter from './film-card-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import { generateFilter } from '../mock/filter.js';

import { FILM_COUNT_ON_SCREEN, FilterType } from '../const.js';
import { updateItem } from '../utils/common.js';
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

    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#filmDetailsContainer, this.#handleFilmCardChange);
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

  #handleFilmCardChange = (updatedFilmCard) => {
    this.#films = updateItem(this.#films, updatedFilmCard);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilmCard);
    this.#filmCardPresenter.get(updatedFilmCard.id).init(updatedFilmCard);

    if (this.#filmDetailsPresenter.film){
      this.#filmDetailsPresenter.show(updatedFilmCard);
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
    this.#clearFilmList();
    this.#renderFilmList();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#films, this.#currentSortType);
    render(this.#sortComponent, this.#filmsContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderFilm = (film) => {
    const currentFilmCardPresenter = new FilmCardPresenter(this.#filmsListContainerComponent.element, this.#filmDetailsPresenter, this.#handleFilmCardChange);
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

