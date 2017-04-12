import { createRequestURI } from './request';
export default function (id, process = 30) {
  return createRequestURI(`api/v1/storages/${id}/${process}`);
};
