import { capitalize, isArray } from "lodash";

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
export const isDefined = (value: any) => {
  return value !== null && value !== undefined;
};

export const convertSize = (size: number) => {
  if(!size || isNaN(size)) return '0 bytes';
  if (size < 0.001) {
    return `${Math.floor(size * 1048576)} bytes`;
  } else if (size < 1) {
    return `${Math.floor(size * 1024)} kb`;
  } else {
    return `${Math.floor(size * 1)} mb`;
  }
};

export const processOption = (response: any[], key: string, value: string) => {
  if (!isArray(response)) return [];
  return response.map((item) => ({
    ...item,
    value: item[key],
    label: item[value],
  }));
};

export const mockDescription = () => {
  const text =
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit ` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo. Quae cum dixisset, finem ille. Duo Reges: constructio interrete. Quod autem in homine praestantissimum atque optimum est, id deseruit `;

  const start = Math.floor(Math.random() * text.length);
  const end = Math.floor(Math.random() * (text.length - start)) + start;

  return text.slice(start, end);
};

export function formatNumber(num: number) {
  if (num >= 1_000_000) {
    // Convert to millions
    return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
  } else if (num >= 1_000) {
    // Convert to thousands
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  } else {
    // Return the number as-is
    return num.toString();
  }
}

export const removeNestedById = (
  array: any[],
  id: string,
  childrenKey: string
) => {
  return array.filter((item) => {
    if (item.id === id) return false;
    if (item[childrenKey]) {
      item.replys = removeNestedById(item.replys, id, childrenKey);
    }
    return true;
  });
};

export const insertNested = (
  array: any[],
  id: string,
  childrenKey: string,
  data: any
) => {
  return array.map((item) => {
    if (item.id === id) {
      if (item[childrenKey]) {
        item[childrenKey].push(data);
      } else {
        item[childrenKey] = [data];
      }
    } else {
      insertNested(item[childrenKey], id, childrenKey, data);
    }
    return item;
  });
};

export const boolean = (value: string) => {
  if (value === "true") return true;
  else return false;
};

export function detectDiff<T>(before: T[], after: T[]): T[] | boolean {
  const diff: T[] = [];

  if (!isArray(after) || !isArray(before)) return false;

  if (after?.length > before?.length) {
    after.forEach((elm) => {
      if (before.some((item) => JSON.stringify(item) === JSON.stringify(elm)))
        return;
      diff.push(elm);
    });
  } else {
    before.forEach((elm) => {
      if (after.some((item) => JSON.stringify(item) === JSON.stringify(elm)))
        return;
      diff.push(elm);
    });
  }

  if (diff?.length === 0) return false;

  return diff;
}

export const formatName = (name: string, splitBy: string) => {
  return name.split(splitBy).map((w) => capitalize(w.toLocaleLowerCase())).join(" ");
}