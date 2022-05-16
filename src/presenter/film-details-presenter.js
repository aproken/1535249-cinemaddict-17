import FilmDetailsView from '../view/film-details/film-details-view.js';
import FormFilmDetailsView from '../view/film-details/form-film-details-view.js';
import FilmDescriptionView from '../view/film-details/film-description-view.js';
import CommentsView from '../view/comments/comments-view.js';
import CommentsItemView from '../view/comments/comments-item-view.js';
import AddNewCommentView from '../view/comments/add-new-comment-view.js';

import { render, RenderPosition } from '../render.js';

export default class FilmDetailsPresenter {
  #filmDetailsContainer = null;

  #filmDetailsComponent = new FilmDetailsView();
  #formFilmDetailsComponent = new FormFilmDetailsView();
  #filmDescriptionComponent = null;
  #commentsContainerComponent = null;
  #commentsListComponent = null;

  #film = null;
  #comments = null;

  constructor(filmDetailsContainer) {
    this.#filmDetailsContainer = filmDetailsContainer;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.hide();
    }
  };

  show = (film) => {
    this.#film = film;
    this.#comments = this.#film.comments;

    this.#filmDescriptionComponent = new FilmDescriptionView(this.#film);
    this.#commentsContainerComponent = new CommentsView(this.#film);
    this.#commentsListComponent = this.#commentsContainerComponent.element.querySelector('.film-details__comments-wrap');

    render(this.#filmDetailsComponent, this.#filmDetailsContainer, RenderPosition.AFTER_END);
    render(this.#formFilmDetailsComponent, this.#filmDetailsComponent.element);
    render(this.#filmDescriptionComponent, this.#formFilmDetailsComponent.element);
    render(this.#commentsContainerComponent, this.#formFilmDetailsComponent.element);

    for(let i = 0; i < this.#comments.length; i++) {
      render(new CommentsItemView(this.#comments[i]), this.#commentsListComponent);
    }

    render(new AddNewCommentView(), this.#commentsListComponent);

    document.body.classList.add('hide-overflow');

    this.#filmDescriptionComponent.setClickHandler(this.hide);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  hide = () => {
    this.#filmDetailsComponent.element.remove();
    this.#formFilmDetailsComponent.element.remove();
    this.#filmDetailsComponent.removeElement();
    this.#formFilmDetailsComponent.removeElement();
    this.#film = null;
    document.body.classList.remove('hide-overflow');
    this.#filmDescriptionComponent.unsetClickHandler(this.hide);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
