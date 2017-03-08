export default function (obj, keys = []) {
  keys.forEach( (key) => {
    delete obj[key];
  });
  return obj;
}
