import { createElement } from '../../render.js';

const createFilmsListShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsListShowMoreView {
  getTemplate() {
    return createFilmsListShowMoreTemplate();
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
