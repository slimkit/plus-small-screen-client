import { addAccessToken, createAPI } from './request';
import { NOTICE } from '../stores/types';
import store from '../stores/store';

// translate dataUri to Blob
function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ab = new window.ArrayBuffer(byteString.length);
  var ia = new window.Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new window.Blob([ab], {type: mimeString});
}

// 创建任务
function createUploadTask (data) {
  return new Promise((resolve, reject) => {
    addAccessToken().post(createAPI('storages/task'), {
        ...data
      },
      {
        validateStatus: status => status === 201
      }
    )
    .then(response => {
      let data = response.data.data;
      resolve(response.data.data);
    })
  })
};

// upload file
function uploadFile(data, dataUri) {
  return new Promise( (resolve, reject) => {
    const formdata = new FormData();
    formdata.append('file', dataURItoBlob(dataUri));
    for(let index in data.options) {
      formdata.append(index, data.options[index]);
    }
    let method = data.method.toLowerCase();
    let headers = {

    };
    addAccessToken()[method](data.uri,
      formdata,
      {
        responseType: 'text',
        transformResponse: [function (data) {
          return data;
        }],
        headers: {
          ...data.headers
        },
        validateStatus: status => status === 200,
      }
    )
    .then(response => {
      let data = response.data;
      if(data.status || !data.code)
      {
        resolve(data);
      }
    })
  })
}

// 通知任务进度
function noticeTask (taskId, data) {
  return new Promise( (resolve, reject) => {
    addAccessToken().patch(createAPI(`storages/task/${taskId}`),
      {
        message: data
      },
      {
        validateStatus: status => status === 201,
      }
    )
    .then(response => {
      resolve(response.data);
    })
  })
};

export {
  createUploadTask,
  uploadFile,
  noticeTask,
  dataURItoBlob
}