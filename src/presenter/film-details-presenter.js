import { render, RenderPosition, remove, replace } from '../framework/render.js';

import FilmDetailsView from '../view/film-details/film-details-view.js';
import FormFilmDetailsView from '../view/film-details/form-film-details-view.js';
import FilmDescriptionView from '../view/film-details/film-description-view.js';
import CommentsView from '../view/comments/comments-view.js';
import CommentItemView from '../view/comments/comment-item-view.js';
import AddNewCommentView from '../view/comments/add-new-comment-view.js';

export default class FilmDetailsPresenter {
  #filmDetailsContainer = null;
  #changeData = null;

  #filmDetailsComponent = null;
  #formFilmDetailsComponent = null;
  #filmDescriptionComponent = null;
  #commentsContainerComponent = null;
  #commentsListComponent = null;
  #addNewCommentComponent = null;

  film = null;
  #comments = null;

  constructor(filmDetailsContainer, changeData) {
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#changeData = changeData;
  }

  show = (film) => {
    this.film = film;
    this.#comments = this.film.comments;

    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmDetailsComponent = new FilmDetailsView();
    this.#formFilmDetailsComponent = new FormFilmDetailsView();
    this.#filmDescriptionComponent = new FilmDescriptionView(this.film);
    this.#commentsContainerComponent = new CommentsView(this.film);
    this.#commentsListComponent = this.#commentsContainerComponent.element.querySelector('.film-details__comments-wrap');
    this.#addNewCommentComponent = new AddNewCommentView(this.film);

    if (prevFilmDetailsComponent === null) {
      this.#renderPopup();
      return;
    }

    if (this.#filmDetailsContainer.contains(prevFilmDetailsComponent.element)) {
      this.#replacePopup(this.#filmDetailsComponent, prevFilmDetailsComponent);
    }
  };

  hide = () => {
    remove(this.#filmDetailsComponent);
    remove(this.#formFilmDetailsComponent);
    this.film = null;
    document.body.classList.remove('hide-overflow');
    this.#filmDescriptionComponent.unsetClickHandler();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#filmDetailsComponent = null;
  };

  #renderFilmDescription = () => {
    render(this.#filmDescriptionComponent, this.#formFilmDetailsComponent.element);

    this.#filmDescriptionComponent.setClickHandler(this.hide);
    this.#filmDescriptionComponent.setAddToWatchlistHandler(this.#handleAddToWatchlist);
    this.#filmDescriptionComponent.setAlreadyWatchedHandler(this.#handleAlreadyWatched);
    this.#filmDescriptionComponent.setAddToFavoritesHandler(this.#handleAddToFavorites);
  };

  #renderCommentItem = (comment) => {
    render(new CommentItemView(comment), this.#commentsListComponent);
  };

  #renderCommentsList = () => {
    render(this.#commentsContainerComponent, this.#formFilmDetailsComponent.element);

    if (this.#comments.length) {
      this.#comments.forEach((commetItem) => this.#renderCommentItem(commetItem));
    }
  };

  #renderAddNewComment = () => {
    render(this.#addNewCommentComponent, this.#commentsListComponent);
  };

  #renderFormFilmDetails = () => {
    render(this.#formFilmDetailsComponent, this.#filmDetailsComponent.element);
    this.#renderFilmDescription();
    this.#renderCommentsList();
    this.#renderAddNewComment();
  };

  #renderPopup = () => {
    render(this.#filmDetailsComponent, this.#filmDetailsContainer, RenderPosition.AFTER_END);
    this.#renderFormFilmDetails();

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replacePopup = (newComponent, oldComponent) => {
    replace(newComponent, oldComponent);
    this.#renderFormFilmDetails();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.hide();
    }
  };

  #handleAddToWatchlist = () => {
    this.film.userDetails['watchlist'] = !this.film.userDetails['watchlist'];
    this.#changeData(this.film);
  };

  #handleAlreadyWatched = () => {
    this.film.userDetails['alreadyWatched'] = !this.film.userDetails['alreadyWatched'];
    this.#changeData(this.film);
  };

  #handleAddToFavorites = () => {
    this.film.userDetails['favorite'] = !this.film.userDetails['favorite'];
    this.#changeData(this.film);
  };
}
