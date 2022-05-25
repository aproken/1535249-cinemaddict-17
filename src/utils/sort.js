import dayjs from 'dayjs';

export const sortFilmByDate = (filmA, filmB) => {
  const dateA = dayjs(filmA.filmInfo.release.date);
  const dateB = dayjs(filmB.filmInfo.release.date);

  return dateA.diff(dateB);
};

export const sortFilmByRating = (filmA, filmB) => filmA.filmInfo.totalRating - filmB.filmInfo.totalRating;
