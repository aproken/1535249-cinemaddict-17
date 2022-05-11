import { createElement } from '../../render.js';

const createFilmsListShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsListShowMoreView {
  #element = null;

  get template() {
    return createFilmsListShowMoreTemplate();
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
