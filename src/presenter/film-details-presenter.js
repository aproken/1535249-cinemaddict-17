import { render, RenderPosition, remove, replace } from '../framework/render.js';

import FilmDetailsView from '../view/film-details/film-details-view.js';
import FormFilmDetailsView from '../view/film-details/form-film-details-view.js';
import FilmDescriptionView from '../view/film-details/film-description-view.js';
import CommentsView from '../view/comments/comments-view.js';
import LoadingView from '../view/loading-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class FilmDetailsPresenter {
  #filmDetailsContainer = null;
  #changeData = null;

  #filmDetailsComponent = null;
  #formFilmDetailsComponent = null;
  #filmDescriptionComponent = null;
  #commentsContainerComponent = null;

  #filmsModel = null;
  film = null;
  #loading = false;
  #loader = null;
  #scrollTop = 0;

  constructor(filmDetailsContainer, filmsModel, changeData) {
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#changeData = changeData;
    this.#filmsModel = filmsModel;
  }

  show = (film, {refreshComments = false} = {}) => {
    if (refreshComments){
      this.#loading = true;
      this.#filmsModel
        .refreshComments(film.id)
        .then( () => {
          this.#loading = false;
          this.#removeLoaderComments();
          this.#renderPopup();
        });
    }
    this.film = film;

    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmDetailsComponent = new FilmDetailsView();
    this.#formFilmDetailsComponent = new FormFilmDetailsView();
    this.#filmDescriptionComponent = new FilmDescriptionView(this.film);

    if (prevFilmDetailsComponent === null) {
      this.#renderPopup();
      return;
    }

    if (this.#filmDetailsContainer.contains(prevFilmDetailsComponent.element)) {
      this.#replacePopup(this.#filmDetailsComponent, prevFilmDetailsComponent);
    }

    this.#filmDetailsComponent.element.scrollTop = this.#scrollTop;

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
    this.#scrollTop = 0;
  };

  #renderFilmDescription = () => {
    render(this.#filmDescriptionComponent, this.#formFilmDetailsComponent.element);

    const addToWatchlist = () => {
      this.#changeData(
        UserAction.ADD_TO_WATCHLIST,
        UpdateType.MINOR,
        {filmId: this.film.id}
      );
      this.#scrollTop = this.#filmDetailsComponent.element.scrollTop;
    };

    const addToAlreadyWatched = () => {
      this.#changeData(
        UserAction.ADD_TO_ALREADY_WATCHED,
        UpdateType.MINOR,
        {filmId: this.film.id}
      );
      this.#scrollTop = this.#filmDetailsComponent.element.scrollTop;
    };

    const addToFavorites = () => {
      this.#changeData(
        UserAction.ADD_TO_FAVORITES,
        UpdateType.MINOR,
        {filmId: this.film.id}
      );
      this.#scrollTop = this.#filmDetailsComponent.element.scrollTop;
    };

    this.#filmDescriptionComponent.setClickHandler(this.hide);
    this.#filmDescriptionComponent.setAddToWatchlistHandler(addToWatchlist);
    this.#filmDescriptionComponent.setAlreadyWatchedHandler(addToAlreadyWatched);
    this.#filmDescriptionComponent.setAddToFavoritesHandler(addToFavorites);
  };

  #renderCommentsList = () => {
    this.#commentsContainerComponent = new CommentsView(this.film);
    render(this.#commentsContainerComponent, this.#formFilmDetailsComponent.element);

    const deleteComment = (commentId) => {
      this.#changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        {filmId: this.film.id, commentId: commentId}
      );
      this.#scrollTop = this.#filmDetailsComponent.element.scrollTop;
    };

    const addComment = (localComment) => {
      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        {filmId: this.film.id, currentComment: localComment}
      );
      this.#scrollTop = this.#filmDetailsComponent.element.scrollTop;
    };

    this.#commentsContainerComponent.setDelCommentHandler(deleteComment);
    this.#commentsContainerComponent.setAddCommentHandler(addComment);

  };

  #renderFormFilmDetails = () => {
    render(this.#formFilmDetailsComponent, this.#filmDetailsComponent.element);
    this.#renderFilmDescription();

    if (this.#loading) {
      this.#renderLoaderComments();
    } else {
      this.#renderCommentsList();
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
    this.#loader = new LoadingView();
    render(this.#loader, this.#formFilmDetailsComponent.element);
  };

  #removeLoaderComments = () => {
    remove(this.#loader);
    this.#loader = null;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.hide();
    }
  };

  setSaving = () => {
    if (!this.film) {
      return;
    }
    this.#commentsContainerComponent.updateElement({
      isDisabled: true,
    });
  };

  setDeleting = (commentId) => {
    if (!this.film) {
      return;
    }
    this.#commentsContainerComponent.updateElement({
      isDisabled: true,
      deletedComment: commentId,
    });
  };

  setAddCommentAborting = () => {
    if (!this.film) {
      return;
    }
    this.#commentsContainerComponent.shakeAddComment();
  };

  setDelCommentAborting = (commentId) => {
    if (!this.film) {
      return;
    }
    this.#commentsContainerComponent.shakeDelComment(commentId);
  };

  setControlsAborting = () => {
    if (!this.film) {
      return;
    }
    this.#filmDescriptionComponent.shakeControls();
  };
}
