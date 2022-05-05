import { createElement } from '../render.js';
import { FILMS_COUNT } from '../const.js';

const createFooterStatisticsTemplate = () => (
  `<section class="footer__statistics">
    <p>${FILMS_COUNT} movies inside</p>
  </section>`
);

export default class FooterStatisticsView {

  getTemplate() {
    return createFooterStatisticsTemplate(this.film);
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
