import { render, RenderPosition, remove, replace } from '../framework/render.js';

import FilmDetailsView from '../view/film-details/film-details-view.js';
import FormFilmDetailsView from '../view/film-details/form-film-details-view.js';
import FilmDescriptionView from '../view/film-details/film-description-view.js';
import CommentsView from '../view/comments/comments-view.js';
import CommentItemView from '../view/comments/comment-item-view.js';
import AddNewCommentView from '../view/comments/add-new-comment-view.js';
import LoadingView from '../view/loading-view.js';
import { UserAction, UpdateType } from '../const.js';


export default class FilmDetailsPresenter {
  #filmDetailsContainer = null;
  #changeData = null;

  #filmDetailsComponent = null;
  #formFilmDetailsComponent = null;
  #filmDescriptionComponent = null;
  #commentsContainerComponent = null;
  #commentsListComponent = null;
  #addNewCommentComponent = null;

  #filmsModel = null;
  film = null;
  #loading = false;

  constructor(filmDetailsContainer, filmsModel, changeData) {
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#changeData = changeData;
    this.#filmsModel = filmsModel;
  }

  show = (film, {refreshComments = false} = {}) => {
    if (refreshComments){
      // обновить комментарии для фильма
      this.#loading = true;
      this.#filmsModel
        .refreshComments(film.id)
        .then( () => {
          this.#loading = false;
          this.#renderPopup();
        });
    }
    this.film = film;

    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmDetailsComponent = new FilmDetailsView();
    this.#formFilmDetailsComponent = new FormFilmDetailsView();
    this.#filmDescriptionComponent = new FilmDescriptionView(this.film);

    this.#commentsContainerComponent = new CommentsView(this.film);
    this.#commentsListComponent = this.#commentsContainerComponent.element.querySelector('.film-details__comments-wrap');

    if (this.#addNewCommentComponent) {
      this.#addNewCommentComponent.removeElement();
    }
    this.#addNewCommentComponent = new AddNewCommentView();

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
    this.loading = false;
    document.body.classList.remove('hide-overflow');
    this.#filmDescriptionComponent.unsetClickHandler();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#filmDetailsComponent = null;
  };

  #renderFilmDescription = () => {
    render(this.#filmDescriptionComponent, this.#formFilmDetailsComponent.element);

    const addToWatchlist = () => this.#changeData(
      UserAction.ADD_TO_WATCHLIST,
      UpdateType.MINOR,
      {filmId: this.film.id}
    );

    const addToAlreadyWatched = () => this.#changeData(
      UserAction.ADD_TO_ALREADY_WATCHED,
      UpdateType.MINOR,
      {filmId: this.film.id}
    );

    const addToFavorites = () => this.#changeData(
      UserAction.ADD_TO_FAVORITES,
      UpdateType.MINOR,
      {filmId: this.film.id}
    );

    this.#filmDescriptionComponent.setClickHandler(this.hide);
    this.#filmDescriptionComponent.setAddToWatchlistHandler(addToWatchlist);
    this.#filmDescriptionComponent.setAlreadyWatchedHandler(addToAlreadyWatched);
    this.#filmDescriptionComponent.setAddToFavoritesHandler(addToFavorites);
  };

  #renderCommentsList = () => {
    render(this.#commentsContainerComponent, this.#formFilmDetailsComponent.element);

    const deleteComment = (commentId) => this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {filmId: this.film.id, commentId: commentId}
    );

    if (this.film.comments.length) {
      this.film.comments.forEach(
        (comment) => render(new CommentItemView(comment, {deleteComment}), this.#commentsListComponent)
      );
    }
  };

  #renderAddNewComment = () => {
    render(this.#addNewCommentComponent, this.#commentsListComponent);

    const addComment = (localComment) => this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {filmId: this.film.id, currentComment: localComment}
    );

    this.#addNewCommentComponent.setAddCommentHandler(addComment);
  };

  #renderFormFilmDetails = () => {
    render(this.#formFilmDetailsComponent, this.#filmDetailsComponent.element);
    this.#renderFilmDescription();

    if (this.#loading) {
      this.#renderLoaderComments();
    } else {
      this.#renderCommentsList();
      this.#renderAddNewComment();
    }
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

  #renderLoaderComments = () => {
    render(new LoadingView(), this.#formFilmDetailsComponent.element);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.hide();
    }
  };
}
