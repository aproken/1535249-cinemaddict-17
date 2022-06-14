import dayjs from 'dayjs';

import AbstractView from '../../framework/view/abstract-view.js';

const createCommentItemTemplate = (comment) => {
  const {id, author, commentText, date, emotion} = comment;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${commentText}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:mm')}</span>
          <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class CommentsItemView extends AbstractView {
  #comment = null;

  constructor(comment, handlers={}) {
    super();
    this.#comment = comment;

    this
      .element
      .querySelector('button')
      .addEventListener(
        'click',
        (evt) => {
          evt.preventDefault();
          handlers.deleteComment(this.#comment.id);
        }
      );
  }

  get template() {
    return createCommentItemTemplate(this.#comment);
  }
}
