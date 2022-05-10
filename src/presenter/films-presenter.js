import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import FilmsView from '../view/films-card/films-view.js';
import FilmsListContainerView from '../view/films-card/films-list-container-view.js';
import FilmsListShowMoreView from '../view/films-card/films-list-show-more-view.js';
import FilmCardView from '../view/films-card/film-card-view.js';

import FilmDetailsPresenter from './film-details-presenter.js';

import { render } from '../render.js';
//import { FILM_COUNT_ON_SCREEN } from '../const.js';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmDetailsContainer = null;
  #filmsModel = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = null;
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListShowMoreComponent = new FilmsListShowMoreView();

  #filmDetailsPresenter = null;

  #films = [];

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmDetailsContainer = document.querySelector('.footer');
    this.#filmsModel = filmsModel;

    this.#films = [...this.#filmsModel.films];

    this.#filmsListComponent = this.#filmsComponent.element.querySelector('.films-list');

    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#filmDetailsContainer);
  }

  init = () => {
    this.#renderFilms();
  };

  #renderFilm = (film) => {
    const filmCardComponent = new FilmCardView(film);

    const showFilmDetails = () => {
      this.#filmDetailsPresenter.show(film);
    };

    filmCardComponent.element.addEventListener('click', showFilmDetails);

    render(filmCardComponent, this.#filmsListContainerComponent.element);
  };

  #renderFilms = () => {
    render(new FilterView(this.#films), this.#filmsContainer);
    render(new SortView(this.#films), this.#filmsContainer);

    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent);

    for(let i = 0; i < this.#films.length; i++) {
      this.#renderFilm(this.#films[i]);
    }

    render(this.#filmsListShowMoreComponent, this.#filmsListComponent);
  };
}

