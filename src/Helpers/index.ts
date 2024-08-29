import { capitalize } from "lodash";

export const processNavLabel = (label: string) => {
  return label
    .split("_")
    .map((w) => capitalize(w.toLocaleLowerCase()))
    .join(" ");
};

export const processDelay = (callback: () => void) => {
  const randomDelay = Math.floor(Math.random() * 1000 + 500);

  return new Promise((res) => {
    setTimeout(() => {
      callback();
      res("success");
    }, randomDelay);
  });
};

export const convertSize = (size: number) => {
  if (size < 0.001) {
    return `${Math.floor(size * 1048576)} bytes`;
  } else if (size < 1) {
    return `${Math.floor(size * 1024)} kb`;
  } else {
    return `${Math.floor(size * 1)} mb`;
  }
};
