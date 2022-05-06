import FilmDetailsView from '../view/film-details/film-details-view.js';
import FormFilmDetailsView from '../view/film-details/form-film-details-view.js';
import FilmDescriptionView from '../view/film-details/film-description-view.js';
import CommentsView from '../view/comments/comments-view.js';
import CommentsItemView from '../view/comments/comments-item-view.js';
import AddNewCommentView from '../view/comments/add-new-comment-view.js';

import { render, RenderPosition } from '../render.js';

export default class FilmsDetailPresenter {
  #filmDetailContainer = null;
  #filmsModel = null;

  #filmDetailComponent = new FilmDetailsView();
  #formFilmDetailComponent = new FormFilmDetailsView();
  #commentsContainerComponent = null;
  #commentsListComponent = null;

  #film = null;
  #comments = null;

  constructor(filmDetailContainer, filmsModel) {
    this.#filmDetailContainer = filmDetailContainer;
    this.#filmsModel = filmsModel;

    this.#film = this.#filmsModel.films[0];
    this.#comments = this.#film.comments;

    this.#commentsContainerComponent = new CommentsView(this.#film);
    this.#commentsListComponent = this.#commentsContainerComponent.element.querySelector('.film-details__comments-wrap');
  }

  init = () => {
    render(this.#filmDetailComponent, this.#filmDetailContainer, RenderPosition.AFTER_END);
    render(this.#formFilmDetailComponent, this.#filmDetailComponent.element);
    render(new FilmDescriptionView(this.#film), this.#formFilmDetailComponent.element);
    render(this.#commentsContainerComponent, this.#formFilmDetailComponent.element);

    for(let i = 0; i < this.#comments.length; i++) {
      render(new CommentsItemView(this.#comments[i]), this.#commentsListComponent);
    }

    render(new AddNewCommentView(), this.#commentsListComponent);
  };
}
