import he from 'he';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';

import { AUTHORS, YEAR_COMMENT } from '../../const.js';
import { getRandomItem, getDate } from '../../utils/common.js';

const BLANK_COMMENT = {
  id: null,
  author: getRandomItem(AUTHORS),
  commentText: '',
  date: getDate(...YEAR_COMMENT),
  emotion: null,
};

const selectedEmotion = (emotion) =>
  emotion ?
    `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">`
    : '';

const createAddNewCommentTemplate = (comment) => {
  const {emotion, commentText} = comment;
  const currentEmoji = selectedEmotion(emotion);

  return (
    `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${currentEmoji}</div>

      <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText}</textarea>
      </label>

      <div class="film-details__emoji-list">
        <input
          class="film-details__emoji-item visually-hidden"
          name="comment-emoji"
          type="radio"
          id="emoji-smile"
          value="smile"
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
          ${emotion === 'angry' ? 'checked' : ''}
        >
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>
  `);
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

export default class AddNewCommentView extends AbstractStatefulView {
  #removeListener = null;

  constructor(comment = BLANK_COMMENT) {
    super();
    this._state = AddNewCommentView.parseCommentToState(comment);

    this.#setInnerHandlers();
  }

  get template() {
    return createAddNewCommentTemplate(this._state);
  }

  reset = (comment) => {
    this.updateElement(
      AddNewCommentView.parseCommentToState(comment),
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  static parseCommentToState = (comment) => ({
    ...comment,
    emotion: undefined,
    commentText: '',
  });

  static parseStateToComment = (state) => {
    const comment = {...state};

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

    const comment = AddNewCommentView.parseStateToComment(this._state);
    comment.commentText = he.encode(comment.commentText);
    this.reset(BLANK_COMMENT);
    this._callback.addComment(comment);
  };

  #setInnerHandlers = () => {
    this.element
      .querySelectorAll('.film-details__emoji-item')
      .forEach((emojiItem) => emojiItem.addEventListener('change', this.#emojiClickHandler));

    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);

    if (this.#removeListener) {
      this.#removeListener();
    }

    this.#removeListener = pressKeyHandler(this.#addLocalComment);
  };

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
  };

  removeElement() {
    this.#removeListener();
    this.#removeListener = null;
    super.removeElement();
  }
}
