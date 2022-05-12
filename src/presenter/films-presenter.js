import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import FilmsView from '../view/films-card/films-view.js';
import FilmsListView from '../view/films-card/films-list-view.js';
import FilmsListEmptyView from '../view/films-card/films-list-empty-view.js';
import FilmsListContainerView from '../view/films-card/films-list-container-view.js';
import FilmsListShowMoreView from '../view/films-card/films-list-show-more-view.js';
import FilmCardView from '../view/films-card/film-card-view.js';

import FilmDetailsPresenter from './film-details-presenter.js';

import { render } from '../render.js';
import { FILM_COUNT_ON_SCREEN, FilterType } from '../const.js';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmDetailsContainer = null;
  #filmsModel = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListEmptyComponent = null;
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListShowMoreComponent = new FilmsListShowMoreView();

  #filmDetailsPresenter = null;

  #films = [];
  #filter = null;
  #renderedFilmCount = FILM_COUNT_ON_SCREEN;

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmDetailsContainer = document.querySelector('.footer');
    this.#filmsModel = filmsModel;

    this.#films = [...this.#filmsModel.films];
    this.#filter = FilterType.ALL;

    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#filmDetailsContainer);
  }

  init = () => {
    this.#renderFilms();
  };

  #handleFilmsListShowMoreClick = (evt) => {
    evt.preventDefault();
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_ON_SCREEN)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmCount += FILM_COUNT_ON_SCREEN;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#filmsListShowMoreComponent.element.remove();
      this.#filmsListShowMoreComponent.removeElement();
    }
  };

  #renderFilm = (film) => {
    const filmCardComponent = new FilmCardView(film);

    const showFilmDetails = () => {
      this.#filmDetailsPresenter.show(film);
    };

    filmCardComponent.element.addEventListener('click', showFilmDetails);

    render(filmCardComponent, this.#filmsListContainerComponent.element);
  };

  #renderFilmsListEmpty = () => {
    this.#filmsListEmptyComponent = new FilmsListEmptyView(this.#filter);
    render(this.#filmsListEmptyComponent, this.#filmsComponent.element);
  };

  #renderFilms = () => {
    render(new FilterView(this.#films), this.#filmsContainer);
    render(new SortView(this.#films), this.#filmsContainer);

    render(this.#filmsComponent, this.#filmsContainer);

    if (!this.#films.length) {
      this.#renderFilmsListEmpty();
      return;
    }

    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for(let i = 0; i < Math.min(this.#films.length, FILM_COUNT_ON_SCREEN); i++) {
      this.#renderFilm(this.#films[i]);

      this.#filmsListShowMoreComponent.element.addEventListener('click', this.#handleFilmsListShowMoreClick);
    }

    render(this.#filmsListShowMoreComponent, this.#filmsListComponent.element);
  };
}

