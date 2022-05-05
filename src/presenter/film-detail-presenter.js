import FilmDetailsView from '../view/film-details/film-details-view.js';
import FormFilmDetailsView from '../view/film-details/form-film-details-view.js';
import FilmDescriptionView from '../view/film-details/film-description-view.js';
import CommentsView from '../view/comments/comments-view.js';
import CommentsItemView from '../view/comments/comments-item-view.js';
import AddNewCommentView from '../view/comments/add-new-comment-view.js';

import { render, RenderPosition } from '../render.js';

export default class FilmsDetailPresenter {
  filmDetailComponent = new FilmDetailsView();
  formFilmDetailComponent = new FormFilmDetailsView();
  commentsContainerComponent = null;
  commentsListComponent = null;

  constructor(filmDetailContainer, filmsModel) {
    this.filmDetailContainer = filmDetailContainer;
    this.filmsModel = filmsModel;
    this.film = this.filmsModel.films[0];
    this.commentsContainerComponent = new CommentsView(this.film);
    this.commentsListComponent = this.commentsContainerComponent.getElement().querySelector('.film-details__comments-wrap');
    this.comments = this.film.comments;
  }

  init = () => {
    render(this.filmDetailComponent, this.filmDetailContainer, RenderPosition.AFTER_END);
    render(this.formFilmDetailComponent, this.filmDetailComponent.getElement());
    render(new FilmDescriptionView(this.film), this.formFilmDetailComponent.getElement());
    render(this.commentsContainerComponent, this.formFilmDetailComponent.getElement());

    for(let i = 0; i < this.comments.length; i++) {
      render(new CommentsItemView(this.comments[i]), this.commentsListComponent);
    }

    render(new AddNewCommentView(), this.commentsListComponent);
  };
}
