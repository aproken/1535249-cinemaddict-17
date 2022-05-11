import { createElement } from '../render.js';
import { FILMS_COUNT } from '../const.js';

const createFooterStatisticsTemplate = () => (
  `<section class="footer__statistics">
    <p>${FILMS_COUNT} movies inside</p>
  </section>`
);

export default class FooterStatisticsView {
  #element = null;
  #film = null;

  get template() {
    return createFooterStatisticsTemplate(this.#film);
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
