export default (data) => {
  let error = {};
  for (let t in data) {
    error = {...error, ...data[t]};
  }
  return error;
}