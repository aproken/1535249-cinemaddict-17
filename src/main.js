import { render } from './framework/render.js';

import ProfileRatingView from './view/profile-rating-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';

import FilmBoardPresenter from './presenter/film-board-presenter.js';
import FilmsModel from './model/films-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const filmsModel = new FilmsModel();
filmsModel.init();

const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filmsModel);

render(new ProfileRatingView(), siteHeaderElement);
render(new FooterStatisticsView(), siteFooterElement);

filmBoardPresenter.init();

