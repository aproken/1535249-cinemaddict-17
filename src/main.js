import { render } from './framework/render.js';

import ProfileRatingView from './view/profile-rating-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';

import FilmBoardPresenter from './presenter/film-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';

const AUTHORIZATION  = 'Basic gERki88430555NaU';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filmsModel, filterModel);

filmsModel.init()
  .finally(() => {
    console.log('finally');

    filterPresenter.init();
    filmBoardPresenter.init();
    render(new ProfileRatingView(filmsModel.films), siteHeaderElement);
    render(new FooterStatisticsView(filmsModel.films), siteFooterElement);
  });


