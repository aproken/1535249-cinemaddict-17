import { createElement } from '../../render.js';

const createFilmsDetailsTemplate = () => '<section class="film-details"></section>';

export default class FilmsDetailsView {
  #element = null;

  get template() {
    return createFilmsDetailsTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
