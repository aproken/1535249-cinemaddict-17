import AbstractView from '../framework/view/abstract-view.js';
import { FILMS_COUNT } from '../const.js';

const createFooterStatisticsTemplate = (films) => (
  `<section class="footer__statistics">
    <p>${films.length} movies inside</p>
  </section>`
);

export default class FooterStatisticsView extends AbstractView {
  #films = null;

  constructor (films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#films);
  }
}
