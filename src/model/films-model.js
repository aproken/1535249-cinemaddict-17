import { generateFilm } from '../mock/film.js';
import { FILMS_COUNT } from '../const.js';

export default class FilmsModel {
  #films = Array.from({length: FILMS_COUNT}, generateFilm);

  get films() {
    return this.#films;
  }
}
