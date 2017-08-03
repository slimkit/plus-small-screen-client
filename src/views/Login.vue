<template>
  <div class="container">
    <div class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5">
          
        </Col>
        <Col span="14" class="title-col">
          登录
        </Col>
        <Col span="5" class="header-end-col">
          <router-link to="/register">
            注册
          </router-link>
        </Col>
      </Row>
    </div>
    <div class="main-content">
      <form role="form" @submit.prevent="submit">
        <div class="loginForm">
          <Row  class="bottom-border formChildrenRow" :gutter="24">
            <Col span="5">
              <label for="phone">手机号</label>
            </Col>
            <Col span="15">
              <input type="tel" v-focus size="large" :autofocus="true" autocomplete="off" placeholder="输入11位手机号" v-model.number.trim="phone" id="phone" name="phone" maxlength="11" />
            </Col>
            <Col span="4" class="flexend">
              <CloseIcon v-show="isShowClean" @click.native="cleanPhone" width="21" height="21" color="#999" />
            </Col>
          </Row>
          <Row class="formChildrenRow" :gutter="24" >
            <Col span="5">
              <label for="password">密码</label>
            </Col>
            <Col span="15">
              <input type="password" size="large" v-show="isShowPassword" v-model.trim="password" placeholder="输入6位以上登录密码" id="password" name="password" />
              <input type="text"  v-model.trim="passwordText" v-show="isShowPasswordText" value="" placeholder="输入6位以上登录密码" />
            </Col>
            <Col span="4" class="flexend">
              <EyeOpenIcon @click.native="showPassword" height="21" v-show="isShowPasswordText" width="21" color="#999" />
              <EyeCloseIcon @click.native="showPassword" height="21" v-show="isShowPassword" width="21" color="#999" />
            </Col>
          </Row>
        </div>
        <div id="notice">
          <Row :gutter="24">
            <Col span="24">
              <p class="notice error">{{ error }}</p>
            </Col>
          </Row>
        </div>
        <div>
         <Row :gutter="24" >
            <Col span="24">
              <Button type="primary" htmlType="submit" :disabled="isDisabled" class="loginButton" size="large">
                <span style="margin-right: 4px;">登录</span>
                <LoadingBlackIcon v-show="isLoading" height="18" width="18" />
              </Button>
            </Col>
          </Row>
        </div>
      </form>
      <div class="otherOperation">
        <Row :gutter="24" >
          <Col span="12" v-if="isWeiXin">
            <router-link to="/register">
              注册
            </router-link>
          </Col>
          <Col span="12" :offset="offset" class="header-end-col">
            <router-link to="/findpassword">
              忘记密码
            </router-link>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
  import { createAPI, addAccessToken, createOldAPI } from '../utils/request';
  import router from '../routers/index';
  import detecdOS from '../utils/detecdOS';
  import formatError from '../utils/errorTips';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';
  import { getUserInfo, getLoggedUserInfo } from '../utils/user';
  import { USERS_APPEND, MESSAGELISTS, MESSAGENOTICE, MESSAGEROOMS } from '../stores/types';
  import defaultAvatar from '../statics/images/defaultAvatarx2.png';
  import EyeCloseIcon from '../icons/EyeClose';
  import EyeOpenIcon from '../icons/EyeOpen';
  import CloseIcon from '../icons/Close';
  import lodash from 'lodash';
  import LoadingBlackIcon from '../icons/LoadingBlack';
  import { connect } from '../utils/webSocket';


  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const login = {
    components: {
      EyeCloseIcon,
      EyeOpenIcon,
      CloseIcon,
      LoadingBlackIcon
    },
    data: () => ({
      phone: '', // 手机号码 
      password: '', // 密码
      passwordText: '', // 明文密码
      isDisabled: true, // 提交按钮disabled状态
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      isShowClean: false, // 是否显示清除手机号按钮
      isShowPasswordText: false, // 是否显示明文密码
      isShowPassword: true, // 是否显示真实密码
      errors: {}, // 错误对象
      isLoading: false, // 登录loading
      isWeiXin: TS_WEB.isWeiXin,
      offset: TS_WEB.isWeiXin ? 0 : 12
    }),
    watch: {
      phone: function (newPhone) {
        this.isShowClean = (newPhone > 0) > 0 ? true : false;
        this.cleanErrors();
        if(!phoneReg.test(newPhone)) {
          this.isValidPhone = false;
        } else {
          let errors = this.errors;
          this.isValidPhone = true;
          delete errors['phone'];
          this.errors = { ...errors };
        }
        this.isDisabled = this.checkIsDisabled()
      },
      password: function (newPassword) {
        this.cleanErrors();
        if(newPassword.length < 6) {
          this.isValidPassword = false;
        } else {
          let errors = this.errors;
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = { ...errors };
        }
        this.passwordText = newPassword;
        this.isDisabled = this.checkIsDisabled()
      },
      passwordText: function (newPasswordText) {
        this.cleanErrors();
        if(newPasswordText.length < 6) {
          this.isValidPassword = false;
        } else {
          let errors = this.errors;
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = { ...errors };
        }
        this.password = newPasswordText;
        this.isDisabled = this.checkIsDisabled();
      }
    },
    computed: {
      error: function () {

        //判断信息合法性
        // if( this.phone !== '' && !this.isValidPhone ) {
        //   this.errors = { ...this.errors, phone: '请输入正确的手机号码' };
        // }
        // if( this.password !== '' && !this.isValidPassword ) {
        //   this.errors = { ...this.errors, password: '密码长度必须大于6位' };
        // }

        let errors = lodash.values(this.errors);

        return errors[0] || '';
      }
    },
    methods: {
      // 清理服务端错误信息
      cleanErrors () {
        let errors = this.errors;
        let newErrors = deleteObjectItems(errors, [
          'code'
        ]);
        this.errors = { ...newErrors };
      },
      checkIsDisabled () {
         return !(this.isValidPassword && this.isValidPhone);
      },
      cleanPhone () {
        this.phone = '';
      },
      showPassword () {
        if(this.isShowPassword) {
          this.isShowPassword = false;
          this.isShowPasswordText = true;
        } else {
          this.isShowPassword = true;
          this.isShowPasswordText = false;
        }
      },
      submit () {
        if (!this.isValidPassword || !this.isValidPhone) return;
        // 跳转信息
        let redirect = this.$route.query.redirect ? this.$route.query.redirect : 'feeds';
        let { phone, password } = this;
        // 设备号，只获取设备平台
        let device_code = detecdOS();
        this.isLoading = true;
        this.isDisabled = true;
        addAccessToken().post(createAPI('tokens'), {
            login: phone,
            password,
            device_code
          },
          {
            validateStatus: status => status === 201
          }
        )
        .then(response => {
          this.errors = {};
          let data = response.data;

          // 本地存储 登陆信息
          let localLoginInfo = {
            token: data.token,
            user_id: data.user.id
          };

          this.$storeLocal.set('UserLoginInfo', localLoginInfo);

          window.TS_WEB.currentUserId = data.user.id;

          data.user.avatar = data.user.avatar || defaultAvatar;
          // 写入vuex
            this.$store.dispatch(USERS_APPEND, cb =>{
              cb(data.user)
            });

            // 设置消息提示查询时间
            let time = 0;
            time = this.$storeLocal.get('messageFlushTime');
            let nowtime = parseInt(new window.Date().getTime() / 1000);

            if(!time) {
              time = nowtime - 86400;
            }

            let types = 'diggs,comments,follows';
            // 查询新消息
            addAccessToken().get(createOldAPI(`users/flushmessages?key=${types}&time=${time+1}`), {} , {
                validateStatus: status => status === 200
              })
            .then( response => {
              let count = {
                fans: 0,
                diggs: {
                  count: 0,
                  time: '',
                  uids: []
                },
                comments: {
                  count: 0,
                  time: '',
                  uids: []
                },
                notice: 0
              }
              let data = response.data.data;
              for( let index in data ) {
                if(data[index].key === "follows") { // 新增关注数
                  count.fans = data[index].count;
                } else if( data[index].key === 'comments') { // 评论数
                  count.comments.count = data[index].count;
                  count.comments.uids = data[index].uids;
                  count.comments.time = data[index].time;
                } else if( data[index].key === 'diggs') { // 点赞数
                  count.diggs.count = data[index].count;
                  count.diggs.uids = data[index].uids;
                  count.diggs.time = data[index].time;
                }
              }
              window.TS_WEB.dataBase.transaction('rw?',
                window.TS_WEB.dataBase.commentslist,
                window.TS_WEB.dataBase.diggslist,
                () => {
                  // 点赞用户本地存储
                  if(count.diggs.count) {
                    Array.from(new Set(count.diggs.uids)).forEach( uid => {
                      window.TS_WEB.dataBase.diggslist.where('[user_id+uid]').equals([window.TS_WEB.currentUserId, uid]).delete().then( () => {
                        window.TS_WEB.dataBase.diggslist.put({
                          user_id: window.TS_WEB.currentUserId,
                          uid: uid
                        })
                      })
                      .catch( e => {
                        console.log(e)
                      });
                    })
                  }
                  // 评论用户本地存储
                  if(count.comments.count) {
                    Array.from(new Set(count.comments.uids)).forEach( uid => {
                      window.TS_WEB.dataBase.commentslist.where('[user_id+uid]').equals([window.TS_WEB.currentUserId, uid]).delete().then( () => {
                        window.TS_WEB.dataBase.commentslist.put({
                          user_id: window.TS_WEB.currentUserId,
                          uid: uid
                        })
                      })
                      .catch( e => {
                        console.log(e)
                      });
                    })
                  }
                }
              );
              this.$store.dispatch(MESSAGENOTICE, cb => {
                cb(count)
              })
            });
            if(window.TS_WEB.socketUrl) {
              // 获取会话列表
              addAccessToken().get(createOldAPI('im/conversations/list/all'), {}, {
                validateStatus: status => status === 200
              })
              .then( response => {
                let data = response.data;
                let lists = [];
                if(data.status || data.code === 0 ) {
                  if(!data.data.length) return;
                  
                  window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.chatroom, () => {
                    data.data.forEach( list => {
                      window.TS_WEB.dataBase.chatroom.where('[cid+owner]').equals([list.cid, window.TS_WEB.currentUserId ]).count( number => {
                        if(!number > 0) {
                          list.last_message_time = 0;
                          list.owner = window.TS_WEB.currentUserId;
                          // 将对话列表写入到本地数据库
                          window.TS_WEB.dataBase.chatroom.put(list);
                          // 组装vuex所需要的数据
                          let room = {
                            cid: list.cid, // 聊天id
                            user_id: 0, // 聊天对象id
                            name: '', // 聊天对象昵称
                            avatar: '', // 聊天对象头像
                            lists: [], // 聊天内容， 默认为空
                            count: 0 // 新消息统计， 默认为空
                          };
                          let uids = list.uids.split(',');
                          let user_id = 0;
                          if(uids[0] == window.TS_WEB.currentUserId) {
                            user_id = uids[1];
                          } else {
                            user_id = uids[0];
                          }
                          room.user_id = user_id;
                          let item = this.$storeLocal.get(user_id);
                          if(item === undefined) {
                            getUserInfo(user_id).then( user => {
                              room.name = user.name;
                              room.avatar = user.avatar;
                              this.$store.dispatch(MESSAGEROOMS, cb => {
                                cb(room);
                              })
                            })
                          } else {
                            room.name = item.name;
                            room.avatar = item.avatar;
                            this.$store.dispatch(MESSAGEROOMS, cb => {
                              cb(room);
                            })
                          }
                        }
                      })
                    })
                  })
                  .catch(e => {
                     console.log(e);
                  });
                }
              });
              connect();
            }
            // 跳转到动态页面
            router.push({ path: redirect });
        })
        .catch(({ response: { data = {} } = {} } ) => {
          this.isDisabled = false;
          this.isLoading = false;    
          this.errors = { ...this.errors, ...formatError(data) };
        });
      }
    }
  };

  export default login;

</script>
