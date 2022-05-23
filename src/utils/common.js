// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// Функция генерации случайного элемента из перечисляемой коллекции
export const getRandomItem = (array) => {
  const upper = array.length;
  const randomItem = getRandomInteger(0, upper - 1);

  return array[randomItem];
};

// Функция перемешивания масива
// взята из интернета и доработана
// Источник - https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = (array) => array
  .map((value) => ({ value, sort: Math.random() }))
  .sort((aItem, bItem) => aItem.sort - bItem.sort)
  .map(({ value }) => value);

// Функция генерации массива
export const getRandomArray = (array, length) => {
  const newArray = [];

  for (let i = 0; i <= length; i++) {
    array = shuffle(array);
    newArray.push(array[getRandomInteger(1, length)]);
  }

  return newArray;
};

// Функция генерации даты
export const getDate = (lower, upper) => {
  const year = getRandomInteger(lower, upper);
  const month = getRandomInteger(0, 11);
  const date = getRandomInteger(0, 27);

  return new Date(year, month, date).toISOString();
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
