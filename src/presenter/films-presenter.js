import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import FilmsView from '../view/films-card/films-view.js';
import FilmsListView from '../view/films-card/films-list-view.js';
import FilmsListContainerView from '../view/films-card/films-list-container-view.js';
import FilmsListShowMoreView from '../view/films-card/films-list-show-more-view.js';
import FilmCardView from '../view/films-card/film-card-view.js';

import { render } from '../render.js';

export default class FilmsPresenter {
  filmsComponent = new FilmsView();
  filmsListComponent = new FilmsListView();
  filmsListContainerComponent = new FilmsListContainerView();

  constructor(filmsContainer, filmsModel) {
    this.filmsContainer = filmsContainer;
    this.filmsModel = filmsModel;
    this.films = [...this.filmsModel.films];
  }

  init = () => {
    render(new FilterView(this.films), this.filmsContainer);
    render(new SortView(this.films), this.filmsContainer);
    render(this.filmsComponent, this.filmsContainer);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement());

    for(let i = 0; i < this.films.length; i++) {
      render(new FilmCardView(this.films[i]), this.filmsListContainerComponent.getElement());
    }

    render(new FilmsListShowMoreView(), this.filmsListComponent.getElement());
  };
}
