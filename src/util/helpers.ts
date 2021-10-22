export const sanitizeObject = (object: { [key: string]: any }) => {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    if (object[key] !== undefined) {
      newObject[key] = object[key];
    }
  });
  return newObject;
};

export const pullInitials = (name: string) => {
  const names = name.split(" ");
  if (names.length > 1) {
    return names[0].charAt(0) + names[names.length - 1].charAt(0);
  }
  return name.charAt(0);
};

export const toUppercase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const chunkArray = (array, chunkSize) => {
  let temp = [];
  for (let i = 0, { length } = array; i < length; i += chunkSize) {
    temp = [...temp, array.slice(i, i + chunkSize)];
  }
  return temp;
};
