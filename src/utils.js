import { dayjs } from 'dayjs';

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

// Функция генерации массива
export const getRandomArray = (array, length) => {
  const newArray = [];

  for (let i = 0; i <= length; i++) {
    newArray.push(array[getRandomInteger(1, length)]);
  }

  return newArray;
};
