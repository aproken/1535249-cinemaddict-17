import FilmDetailsView from '../view/film-details-view.js';
import FormFilmDetailsView from '../view/form-film-details-view.js';
import FilmDescriptionView from '../view/film-description-view.js';
import CommentsView from '../view/comments-view.js';

import { render, RenderPosition } from '../render.js';

export default class FilmsDetailPresenter {
  filmDetailComponent = new FilmDetailsView();
  formFilmDetailComponent = new FormFilmDetailsView();

  init = (filmDetailContainer) => {
    this.filmDetailContainer = filmDetailContainer;

    render(this.filmDetailComponent, this.filmDetailContainer, RenderPosition.AFTEREND);
    render(this.formFilmDetailComponent, this.filmDetailComponent.getElement());
    render(new FilmDescriptionView(), this.formFilmDetailComponent.getElement());
    render(new CommentsView(), this.formFilmDetailComponent.getElement());
  };
}
