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
    let user = response.data.data.pop();
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

function getUsersInfo (user_ids, cb) {
  let user_ids_need_to_request = [];
  let users = {};

  // 检查已有的本地用户
  user_ids.map((user_id) => {
    let oldUserLocal = localEvent.getLocalItem(`user_${user_id}`);
    if(!Object.keys(oldUserLocal).length) {
      user_ids_need_to_request.push(user_id);
    }
    users[user_id] = oldUserLocal;
  });
  if(user_ids_need_to_request.length) {
    addAccessToken().post(createAPI('users'), {
        user_ids: user_ids_need_to_request
      },
      {
        validate: status => status === 200
      }
    )
    .then(response => {
      let users_service = response.data.data;
      let userLocal = {
        user_id: 0,
        name: '',
        phone: '',
        counts: {},
        datas: {}
      };
      // 组装数据
      users_service.map((user) => {
        let current_local_user = { ...userLocal };
        current_local_user.user_id = user.id;
        current_local_user.name = user.name;
        current_local_user.phone = user.phone;
        if(user.counts.length) {
          user.counts.map((count) => {
            let keyName = count.key;
            let value = count.value;
            current_local_user.counts = { ...current_local_user.counts, ...{ [keyName]:  value } };
          });
        }
        if(user.datas.length) {
          user.datas.map((data) => {
            let keyName = data.profile;
            let valueName = data;
            current_local_user.datas = { ...current_local_user.datas, ...{ [keyName]:  valueName } };
          });
        }
        localEvent.setLocalItem('user_' + current_local_user.user_id, current_local_user);
        users[user.id] = current_local_user;
      });
      cb(users);
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
  } else {
    // 返回本地数据
    cb(users);
  }
};

export {
  getUserInfo,
  getUsersInfo
};