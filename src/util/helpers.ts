export const sanitizeObject = (object: { [key: string]: any }) => {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    if (object[key] !== undefined) {
      newObject[key] = object[key];
    }
  });
  return newObject;
};
