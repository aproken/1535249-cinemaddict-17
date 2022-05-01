import { createElement } from '../render.js';

const createFilmsDetailsTemplate = () => '<section class="film-details"></section>';

export default class FilmsDetailsView {
  getTemplate() {
    return createFilmsDetailsTemplate();
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
