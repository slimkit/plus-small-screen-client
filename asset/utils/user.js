import localEvent from '../stores/localStorage';
import { createAPI, addAccessToken } from '../utils/request';
import errorCodes from '../stores/errorCodes';

function getUserInfo (user_id, cb) {
  addAccessToken().post(createAPI('users'), {
      user_ids: [ user_id ]
    },
    {
      validate: status => status === 200
    }
  )
  .then(response => {
    let user = response.data.data[0];
    let userLocal = {
      user_id: 0,
      name: '',
      phone: '',
      counts: {},
      datas: {}
    };
    userLocal.user_id = user.id;
    userLocal.name = user.name;
    userLocal.phone = user.phone;
    user.counts.map(function (count, index) {
      let keyName = count.key;
      let value = count.value;
      userLocal.counts = Object.assign({}, userLocal.counts, { [keyName]:  value });
    });
    user.datas.map(function (data, index) {
      let keyName = data.profile;
      let valueName = data;
      userLocal.datas = Object.assign({}, userLocal.datas, { [keyName]: valueName });
    });
    localEvent.setLocalItem('user_' + user_id, userLocal);
    cb(userLocal);
  })
  .catch(({ response: { data = {} } = {} } ) => {
    const { code = 'xxxx' } = data;
    let message = errorCodes[code]
    return {
      status: false,
      user: null,
      message: message
    };
  })
};

function getUsersInfo (user_ids) {
  addAccessToken().request.post(createAPI('users'), {
      user_ids
    },
    {
      validate: status => status === 200
    }
  )
  .then(response => {
  })
  .catch(({ response: { data = {} } = {} } ) => {
    const { code = 'xxxx' } = data;
  })
};

export {
  getUserInfo,
  getUsersInfo
};