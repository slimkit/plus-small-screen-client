<template>
    <div class="container">
        <div class="commonHeader" v-if="!isWeiXin">
            <Row :gutter="24">
                <Col span="5"></Col>
                <Col span="14" class="title-col">登录</Col>
                <Col span="5" class="header-end-col">
                <router-link to="/register">注册</router-link>
                </Col>
            </Row>
        </div>
        <div class="main-content">
            <!-- 表单 -->
            <form role="form" @submit.prevent="submit" autocomplete="off">
                <div class="loginForm">
                    <Row class="bottom-border formChildrenRow" :gutter="24">
                        <Col span="5" class="t_c">
                        <label for="account">账号</label>
                        </Col>
                        <Col span="16">
                        <input type="text" v-focus :autofocus="true" autocomplete="off" placeholder="用户名/手机号/邮箱" v-model.trim="account" id="account" name="account" />
                        </Col>
                        <Col span="3" class="flexend">
                        <CloseIcon v-show="account.length>0" @click.native="account=''" width="21" height="21" color="#999" />
                        </Col>
                    </Row>
                    <Row class="formChildrenRow" :gutter="24">
                        <Col span="5" class="t_c">
                        <label for="password">密码</label>
                        </Col>
                        <Col span="16">
                        <input v-if="isShowPassword" type="password" autocomplete="off" v-model.trim="password" placeholder="请输入6位以上密码" id="password" name="password" />
                        <input v-else type="text" autocomplete="off" v-model.trim="password" placeholder="请输入6位以上密码" id="password" name="password" />
                        </Col>
                        <Col span="3" class="flexend" @click.native="isShowPassword = !isShowPassword">
                        <EyeCloseIcon v-if="isShowPassword" height='21' width="21" />
                        <EyeOpenIcon v-else height='21' width="21" />
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
                    <Row :gutter="24">
                        <Col span="24">
                        <Button type="primary" htmlType="submit" :disabled="btnDisabled" class="loginButton" size="large">
                            <span style="margin-right: 4px;">登录</span>
                            <LoadingBlackIcon v-show="isLoading" height="18" width="18" />
                        </Button>
                        </Col>
                    </Row>
                </div>
            </form>
            <!-- /表单 -->
            <!-- 操作 -->
            <div class="otherOperation">
                <Row :gutter="24">
                    <Col span="12" v-if="isWeiXin">
                    <router-link to="/register">注册</router-link>
                    </Col>
                    <Col span="12" :offset="offset" class="header-end-col">
                    <router-link to="/forgot">忘记密码</router-link>
                    </Col>
                </Row>
            </div>
            <!-- /操作 -->
        </div>
    </div>
</template>
<script>
import { createAPI, addAccessToken, createOldAPI } from '../utils/request';

import router from '../routers/index';

import deleteObjectItems from '../utils/deleteObjectItems';

import lodash from 'lodash';

import detecdOS from '../utils/detecdOS';
import { connect } from '../utils/webSocket';
import { getUserInfo, getLoggedUserInfo } from '../utils/user';
import { USERS_APPEND, MESSAGELISTS, MESSAGENOTICE, MESSAGEROOMS } from '../stores/types';

// Icon
import CloseIcon from '../icons/Close';
import EyeOpenIcon from '../icons/EyeOpen';
import EyeCloseIcon from '../icons/EyeClose';
import LoadingBlackIcon from '../icons/LoadingBlack';
import defaultAvatar from '../statics/images/defaultAvatarx2.png';

// 消息处理
import PlusMessageBundle from '../utils/es';

// 手机号码规则
const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
// 邮箱验证
const emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
// 用户名验证
const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/;

// 验证码
const codeReg = /^[0-9]{4,6}$/;

const login = {
    components: {
        CloseIcon,
        EyeOpenIcon,
        EyeCloseIcon,
        LoadingBlackIcon
    },
    data() {
        return({
            account: '', // 账号
            password: '', // 密码

            isValidAccount: false, // 是否合法手机号
            isValidPassword: false, // 是否合法密码

            isDisabled: true, // btn
            isLoading: false, // 登录loading
            isShowPassword: true, // 是否显示真实密码

            errors: {}, // 错误集合
            error: "", // 显示错误
            errorKey: "", // 错误类型

            isWeiXin: TS_WEB.isWeiXin,
            offset: TS_WEB.isWeiXin ? 0 : 12,

            // 路由跳转信息
            redirect: this.$route.query.redirect ? this.$route.query.redirect : 'feeds'
        });
    },
    computed: {
        btnDisabled() {
            return !(this.isValidAccount && this.isValidPassword);
        }
    },
    watch: {
        errors: function(val) {
            const Messageable = PlusMessageBundle(val);

            this.error = Messageable.getMessage();
            this.errorKey = Messageable.getInputKey();
        },
        account: function(val) {

            this.clearError("login");
            this.isValidAccount = this.checkAccount();

        },
        password: function(val) {

            this.clearError("password");
            this.isValidPassword = val.length >= 6;
        },
    },
    methods: {

        // 清理错误信息
        clearError(key) {
            key = key || this.errorKey;
            let errors = this.errors;
            if(errors[key]) {
                delete errors[key];
                this.errors = { ...errors };
            }
        },

        // 验证账号
        checkAccount() {
            return(new Function(`return ` + [phoneReg, emailReg, usernameReg].map((reg) => {
                return reg.test(this.account);
            }).join("||")))();
        },

        // 提交表单 
        submit() {
            this.isLoading = true;
            if(!this.isValidPassword || !this.isValidAccount) {
                return this.isLoading = false;
            };
            this.doLogin();
        },

        // 验证登录
        doLogin() {
            let { account, password } = this.$data;
            // 设备号，只获取设备平台
            let device_code = detecdOS(),
                param = {
                    login: account,
                    password,
                    device_code
                };
            addAccessToken().post(createAPI('tokens'), param, {
                validateStatus: status => status === 201
            }).then(response => {
                // 清空错误
                this.errors = {};
                const {
                    data: {
                        token = "",
                        user = {}
                    } = {}
                } = response;

                // 本地存储 登陆信息
                this.$storeLocal.set('UserLoginInfo', { token: token, user_id: user.id });
                window.TS_WEB.currentUserId = user.id;

                // 写入vuex
                this.$store.dispatch(USERS_APPEND, cb => {
                    cb(user);
                });

                // 保存登录用户信息
                this.$store.dispatch('UPDATE_INFO_OF_MINE', {...user, token});

                // do something

                // 查询新消息
                this.getMessages();

                // 获取会话列表
                this.getSessionList();

                // 跳转到动态页面
                router.push({ path: this.redirect });

                this.isLoading = false;
                this.isDisabled = false;
            }).catch(({ response: { data = { message: ["登录失败"] } } = {} }) => {
                this.errors = { ...data, ...this.errors };
                this.isLoading = false;
                this.isDisabled = true;
            });
        },

        // 查询新消息
        getMessages() {
            // 设置消息提示查询时间
            let time = 0,
                nowtime = parseInt(new window.Date().getTime() / 1000),
                types = 'diggs,comments,follows';

            time = this.$storeLocal.get('messageFlushTime') || nowtime - 86400;

            // 查询新消息
            addAccessToken().get(createOldAPI(`users/flushmessages?key=${types}&time=${time+1}`), {}, {
                validateStatus: status => status === 200
            }).then(response => {
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
                for(let index in data) {
                    if(data[index].key === "follows") { // 新增关注数
                        count.fans = data[index].count;
                    } else if(data[index].key === 'comments') { // 评论数
                        count.comments.count = data[index].count;
                        count.comments.uids = data[index].uids;
                        count.comments.time = data[index].time;
                    } else if(data[index].key === 'diggs') { // 点赞数
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
                            Array.from(new Set(count.diggs.uids)).forEach(uid => {
                                window.TS_WEB.dataBase.diggslist.where('[user_id+uid]').equals([window.TS_WEB.currentUserId, uid]).delete().then(() => {
                                    window.TS_WEB.dataBase.diggslist.put({
                                        user_id: window.TS_WEB.currentUserId,
                                        uid: uid
                                    })
                                }).catch(e => {
                                    console.log(e)
                                });
                            })
                        }
                        // 评论用户本地存储
                        if(count.comments.count) {
                            Array.from(new Set(count.comments.uids)).forEach(uid => {
                                window.TS_WEB.dataBase.commentslist.where('[user_id+uid]').equals([window.TS_WEB.currentUserId, uid]).delete().then(() => {
                                    window.TS_WEB.dataBase.commentslist.put({
                                        user_id: window.TS_WEB.currentUserId,
                                        uid: uid
                                    })
                                }).catch(e => {
                                    console.log(e)
                                });
                            })
                        }
                    }
                );
                this.$store.dispatch(MESSAGENOTICE, cb => {
                    cb(count)
                })
            }).catch(error => {
                console.log(error);
            })
        },

        // 获取会话列表
        getSessionList() {
            if(window.TS_WEB.socketUrl) {
                // 获取会话列表
                addAccessToken().get(createOldAPI('im/conversations/list/all'), {}, {
                    validateStatus: status => status === 200
                }).then(response => {
                    let data = response.data;
                    let lists = [];
                    if(data.status || data.code === 0) {
                        if(!data.data.length) return;

                        window.TS_WEB.dataBase.transaction('rw?', window.TS_WEB.dataBase.chatroom, () => {
                            data.data.forEach(list => {
                                window.TS_WEB.dataBase.chatroom.where('[cid+owner]').equals([list.cid, window.TS_WEB.currentUserId]).count(number => {
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
                                            getUserInfo(user_id).then(user => {
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
                        }).catch(e => {
                            console.log(e);
                        });
                    }
                });

                connect();
            }
        }
    }
};

export default login;
</script>
