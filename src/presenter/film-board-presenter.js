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
  #renderedFilmCount = FILM_COUNT_ON_SCREEN;
  #filmCardPresenter = new Map();
  #filmDetailsPresenter = null;

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmDetailsContainer = document.querySelector('.footer');
    this.#filmsModel = filmsModel;

    this.#films = [...this.#filmsModel.films];
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
    this.#filmCardPresenter.get(updatedFilmCard.id).init(updatedFilmCard);
    if (this.#filmDetailsPresenter.film){
      this.#filmDetailsPresenter.show(updatedFilmCard);
    }
  };

  #renderFilter = () => {
    this.#filterComponent = new FilterView(this.#filters);
    render(this.#filterComponent, this.#filmsContainer);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#films);
    render(this.#sortComponent, this.#filmsContainer);
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

  #clearFilmsList = () => {
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

