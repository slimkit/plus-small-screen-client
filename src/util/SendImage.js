import MD5 from "js-md5";
import http from "@/http.js";
function existed(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const base64 = e.target.result;
      const hash = MD5(base64);
      http
        .get(`/files/uploaded/${hash}`, {
          validateStatus: s => s === 404 || s === 200
        })
        .then(
          ({ status, data: { id } }) => {
            resolve(status === 200 && id > 0 ? id : false);
          },
          err => {
            reject(err);
          }
        );
    };
    reader.readAsArrayBuffer(file);
  });
}
function sendImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  return new Promise((resolve, reject) => {
    http
      .post(`/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(({ data: { id } }) => {
        if (id && id > 0) {
          resolve(id);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
export default file => {
  return new Promise((resolve, reject) => {
    existed(file)
      .then(status => {
        status && typeof status === "number"
          ? resolve(status)
          : sendImage(file).then(id => resolve(id), err => reject(err));
      })
      .catch(err => {
        reject(err);
      });
  });
};
