import { filter } from '../utils/filter.js';

export const generateFilter = (films) => Object.entries(filter).map(
  ([filterName, filterFunction]) => ({
    name: filterName,
    count: filterFunction(films).length,
  })
);
