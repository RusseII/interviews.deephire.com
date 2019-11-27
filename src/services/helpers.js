import qs from 'qs';

const lowerCaseObj = obj => {
  let key,
    keys = Object.keys(obj);
  let n = keys.length;
  const newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = obj[key];
  }

  return newobj;
};

export const lowerCaseQueryParams = urlPath => {
  const queryParams = qs.parse(urlPath);
  return lowerCaseObj(queryParams);
};
