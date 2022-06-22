import he from 'he';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
dayjs.extend(relativeTime);

const BLANK_COMMENT = {
  id: null,
  author: null,
  commentText: '',
  date: null,
  emotion: 'smile',
};

/** @const {string} Класс, реализующий эффект "покачивания головой" */
const SHAKE_CLASS_NAME = 'shake';

/** @const {number} Время анимации в миллисекундах */
const SHAKE_ANIMATION_TIMEOUT = 600;

const selectedEmotion = (emotion) =>
  emotion ?
    `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">`
    : '';

const createAddNewCommentTemplate = (comment) => {
  const {emotion, commentText, isDisabled} = comment;
  const currentEmoji = selectedEmotion(emotion);

  return (
    `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${currentEmoji}</div>

      <label class="film-details__comment-label">
          <textarea class="film-details__comment-input"
                    placeholder="Select reaction below and write comment here"
                    name="comment"
                    ${isDisabled ? 'disabled' : ''}
          >${commentText}</textarea>
      </label>

      <div class="film-details__emoji-list">
        <input
          class="film-details__emoji-item visually-hidden"
          name="comment-emoji"
          type="radio"
          id="emoji-smile"
          value="smile"
          ${isDisabled ? 'disabled' : ''}
          ${emotion === 'smile' ? 'checked' : ''}
        >
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>
        <input
          class="film-details__emoji-item visually-hidden"
          name="comment-emoji"
          type="radio"
          id="emoji-sleeping"
          value="sleeping"
          ${isDisabled ? 'disabled' : ''}
          ${emotion === 'sleeping' ? 'checked' : ''}
        >
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>
        <input
          class="film-details__emoji-item visually-hidden"
          name="comment-emoji"
          type="radio"
          id="emoji-puke"
          value="puke"
          ${isDisabled ? 'disabled' : ''}
          ${emotion === 'puke' ? 'checked' : ''}
        >
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>
        <input
          class="film-details__emoji-item visually-hidden"
          name="comment-emoji"
          type="radio"
          id="emoji-angry"
          value="angry"
          ${isDisabled ? 'disabled' : ''}
          ${emotion === 'angry' ? 'checked' : ''}
        >
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>
  `);
};


const createCommentItemTemplate = (comment) => {
  const {id, author, commentText, date, emotion, isDeleting} = comment;
  return (
    `<li class="film-details__comment data-comment-id="${id}"">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${commentText}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
          <button class="film-details__comment-delete" data-comment-id="${id}">
            ${isDeleting ? 'deleting...' : 'delete'}
          </button>
        </p>
      </div>
    </li>`
  );
};

const createCommentsTemplate = (state) => {
  const { emotion, commentText, deletedComment, isDisabled} = state;
  const comments = state.film.comments
    .map((comment) => {
      if (comment.id === deletedComment) {
        comment.isDeleting = true;
      }
      return comment;
    });
  return (
    `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments
        <span class="film-details__comments-count">
          ${comments.length}
        </span></h3>
        <ul class="film-details__comments-list">
          ${comments.map((comment) => createCommentItemTemplate(comment)).join('')}
        </ul>
        ${createAddNewCommentTemplate({emotion, commentText, isDisabled})}
      </section>
    </div>`);
};


const pressKeyHandler = (callback) => {
  const listener = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      callback();
    }
  };

  document.addEventListener('keydown', listener);

  return () => document.removeEventListener('keydown', listener);
};

export default class CommentsView extends AbstractStatefulView {
  #removeListener = null;

  constructor(film, localComment = BLANK_COMMENT) {
    super();
    this._state = CommentsView.parseCommentToState({film, localComment});

    this.#setInnerHandlers();
  }

  get template() {
    return createCommentsTemplate(this._state);
  }

  reset = (comment) => {
    this.updateElement(
      CommentsView.parseCommentToState({...this._state, localComment: comment}),
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  static parseCommentToState = ({film, localComment = BLANK_COMMENT} = {}) => ({
    film,
    ...localComment
  });

  static parseStateToComment = (state) => {
    const comment = {
      commentText: state.commentText,
      emotion: state.emotion,
    };

    return comment;
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      emotion: evt.target.value,
    });
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      commentText: evt.target.value,
    });
  };

  #addLocalComment = () => {
    if (!this._state.commentText || !this._state.emotion) {
      return;
    }

    const comment = CommentsView.parseStateToComment(this._state);
    comment.commentText = he.encode(comment.commentText);
    this.reset(BLANK_COMMENT);
    this._callback.addComment(comment);
  };

  #deleteComment = (commentId) => {
    this._callback.delComment(commentId);
  };

  #setInnerHandlers = () => {
    this.element
      .querySelectorAll('.film-details__emoji-item')
      .forEach((emojiItem) => emojiItem.addEventListener('change', this.#emojiClickHandler));

    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);

    this.element
      .querySelectorAll('.film-details__comment-delete')
      .forEach((commentItem) => commentItem.addEventListener('click', (evt) => {
        evt.preventDefault();
        const commentId = evt.target.dataset.commentId;
        this.#deleteComment(commentId);
      }));

    if (this.#removeListener) {
      this.#removeListener();
    }

    this.#removeListener = pressKeyHandler(this.#addLocalComment);
  };

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
  };

  setDelCommentHandler = (callback) => {
    this._callback.delComment = callback;
  };


  removeElement() {
    this.#removeListener();
    this.#removeListener = null;
    super.removeElement();
  }

  shakeAddComment = () => {
    const controlsElement = this.element.querySelector('.film-details__new-comment');
    controlsElement
      .classList
      .add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      controlsElement.classList.remove(SHAKE_CLASS_NAME);
    }, SHAKE_ANIMATION_TIMEOUT);
  };

  shakeDelComment = (commentId) => {
    const controlsElement = this
      .element
      .querySelector(`.film-details__comment[data-comment-id=${commentId}]`);
    controlsElement
      .classList
      .add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      controlsElement.classList.remove(SHAKE_CLASS_NAME);
      this.updateElement({deletedComment: null, isDisabled: false,});
    }, SHAKE_ANIMATION_TIMEOUT);
  };
}
