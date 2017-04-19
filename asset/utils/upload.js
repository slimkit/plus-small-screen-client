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
function createUploadTask (data, cb) {
	addAccessToken().post(createAPI('storages/task'), {
      ...data
		},
    {
      validateStatus: status => status === 201
    }
	)
  .then(response => {
    let data = response.data.data;
    cb(response.data.data);
  })
  .catch(({ response: { data: { message = "网络状况堪忧" } = {} } = {} }) => {
    store.dispatch(NOTICE, cb => {
      cb({
        text: '网络状况堪忧1',
        time: 1500,
        status: false
      });
    });
  })
};

// upload file
function uploadFile(data, dataUri, cb) {
  const formdata = new FormData();
  formdata.append('file', dataURItoBlob(dataUri));
  for(let index in data.options) {
    formdata.append(index, data.options[index]);
  }
  let method = data.method.toLowerCase();
  addAccessToken()[method](data.uri,
    formdata,
    {
      validateStatus: status => status === 200,
      headers: {
        ...data.headers,
        'content-type': 'multipart/form-data'
      }
    }
  )
  .then(response => {
    let data = response.data;
    if(data.status || !data.code)
    {
      cb(data);
    }
  })
  .catch(({ response: { data: { message = "网络状况堪忧" } = {} } = {} }) => {
    store.dispatch(NOTICE, cb => {
      cb({
        text: '网络状况堪忧2',
        time: 1500,
        status: false
      });
    });
  })
}

// 通知任务进度
function noticeTask (taskId, data, cb) {
  addAccessToken().patch(createAPI(`storages/task/${taskId}`),
    { ...data },
    {
      validateStatus: status => status === 201
    }
  )
  .then(response => {
    cb(response.data);
  })
  // .catch(({ response: { data: { message = "网络状况堪忧" } = {} } = {} }) => {
  //   store.dispatch(NOTICE, cb => {
  //     cb({
  //       text: '网络状况堪忧3',
  //       time: 1500,
  //       status: false
  //     });
  //   });
  // })
};

export {
  createUploadTask,
  uploadFile,
  noticeTask
}