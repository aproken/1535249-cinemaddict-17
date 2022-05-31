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

export default class AddNewCommentView extends AbstractStatefulView {
  constructor(comment = BLANK_COMMENT) {
    super();
    this._state = AddNewCommentView.parseCommentToState(comment);

    this.#setInnerHandlers();
  }

  get template() {
    return createAddNewCommentTemplate(this._state);
  }

  reset = (comment) => {
    this.updateData(
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

    delete comment.emotion;
    delete comment.commentText;

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
    this.updateElement({
      commentText: evt.target.value,
    });
  };

  #setInnerHandlers = () => {
    this.element
      .querySelectorAll('.film-details__emoji-item')
      .forEach((emojiItem) => emojiItem.addEventListener('change', this.#emojiClickHandler));

    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('change', this.#commentInputHandler);
  };
}
