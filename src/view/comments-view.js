import { createElement } from '../render.js';

const createCommentsTemplate = (film) => {
  const { comments } = film;
  return (
    `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments<span class="film-details__comments-count"> ${comments.length}</span></h3>
        <ul class="film-details__comments-list"></ul>
        <div class="film-details__new-comment"></div>
      </section>
    </div>`
  );
};

export default class CommentsView {
  constructor(film) {
    this.film = film;
  }

  getTemplate() {
    return createCommentsTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
