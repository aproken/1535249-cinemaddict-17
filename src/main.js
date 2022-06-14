import { render } from './framework/render.js';

import ProfileRatingView from './view/profile-rating-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';

import FilmBoardPresenter from './presenter/film-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const filmsModel = new FilmsModel();
filmsModel.init();
const filterModel = new FilterModel();

const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(new ProfileRatingView(), siteHeaderElement);
render(new FooterStatisticsView(), siteFooterElement);

filterPresenter.init();
filmBoardPresenter.init();

