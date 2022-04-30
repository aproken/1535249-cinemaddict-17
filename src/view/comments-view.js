import { createElement } from '../render.js';

const createCommentsTemplate = () => (
  `
  <section class="film-details">
    <form class="film-details__inner" action="" method="get">
    </form>
  </section>
  `
);

export default class CommentsView {
  getTemplate() {
    return createCommentsTemplate();
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
