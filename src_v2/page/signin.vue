<template>
    <div class="signin_page">
        <head-top append='true' title='登录'></head-top>
        <div class="normal_signin">
            <div class="forms">
                <div class="forms_row">
                    <label for="account">账户</label>
                    <input type="text" v-model='account' id="account" placeholder="用户名/手机号/邮箱">
                    <v-icon type='base-clean' v-if='account.length > 0' @click.native='account=""' />
                </div>
                <div class="forms_row">
                    <label for="password">密码</label>
                    <input type="text" v-model='password' id="password" v-if='eye' placeholder="输入6位以上登录密码">
                    <input type="password" v-model='password' id="password" v-else placeholder="输入6位以上登录密码">
                    <v-icon :type='`eye-${eye?"open":"close"}`' width='.3rem' height='.3rem' @click.native='eye=!eye' />
                </div>
            </div>
            <div class="forms_error ellipsis">{{ error }}</div>
            <button class="long_btn" :disabled='disabled' @click='signIn'>登录</button>
            <div class="other_link">
                <router-link to='/feed/new'>不登录, 先随便逛逛</router-link>
                <router-link to='/forgot'>忘记密码</router-link>
            </div>
        </div>
        <!-- 三方登录 -->
        <div class="tr_signin">
            <h3>社交账号登录</h3>
            <div class="tr_signin_group">
                <figure v-for='(tr, index) in tr_signin' :key='`tr-signin-${index}`'>
                    <div class="tr_signin_icon">
                        <v-icon :type='tr.icon'></v-icon>
                    </div>
                    <p>{{ tr.title }}</p>
                </figure>
            </div>
        </div>
    </div>
</template>
<script>
import HeadTop from '../components/HeadTop';
import { detectOS } from '../util/';

export default {
    name: 'signin',
    components: {
        HeadTop,
    },
    data() {
        return {
            account: '',
            password: '',
            eye: false,
            error: '账号或密码错误',

            /* 后台获取三方登录数据 */
            tr_signin: [{
                icon: 'tr-QQ',
                title: 'QQ'
            }, {
                icon: 'tr-weibo',
                title: '微博'
            }, {
                icon: 'tr-wechat',
                title: '微信'
            }]
        }
    },
    computed: {
        disabled() {
            return(this.account.length < 2 || this.password.length < 6);
        }
    },
    methods: {
        signIn() {
            let device_code = detectOS(),
                param = {
                    login: this.account,
                    password: this.password,
                    device_code
                };
            window.alert(device_code);
            this.$http.post('tokens', param).then(res => {
                console.log(res);
            })
        }
    },
    mounted() {
        // // todo
        // window.app.style.height = '100%';
        // this.$el.parentElement.style.height = '100%';
    },
    beforeDestroy() {
        // window.app.style.height = '';
        // this.$el.parentElement.style.height = '';
    }
}
</script>
<style lang='less'>
.signin_page {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    >* {
        flex: 0 0 auto;
    }
    .normal_signin {
        flex: 1 1 auto;
    }
}

.tr_signin {
    color: #999;
    padding: 0 80px;
    h3 {
        margin: auto;
        padding: 0;
        text-align: center;
        font-size: 24px;
        &:before, &:after {
            content: '';
            display: inline-block;
            vertical-align: middle;
            height: 0;
            width: 190px;
            border-bottom: 1px solid currentColor; /*no*/
        }
        ;
        &:before {
            margin-right: 20px;
        }
        &:after {
            margin-left: 20px;
        }
    }
    &_group {
        text-align: center;
        margin: 60px 0;
        display: flex;
        justify-content: space-between;
        font-size: 24px;
    }
    &_icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 20px;
        box-shadow: 0 0 3px 3px #ededed;
        background: #fff;
        position: relative;
        svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
        }
    }
}

.forms {
    background: #fff;
    input {
        flex: 1 1 auto;
        font-size: 30px;
        height: 100%;
        margin: 0 60px;
    }
    input::-webkit-input-placeholder {
        font-size: 30px;
        color: #ccc;
    }
    input:-moz-placeholder {
        font-size: 30px;
        color: #ccc;
    }
    input::-moz-placeholder {
        font-size: 30px;
        color: #ccc;
    }
    input:-ms-input-placeholder {
        font-size: 30px;
        color: #ccc;
    }
    svg {
        width: 40px;
        height: 40px;
        fill: #b3b3b3;
    }
    &_row {
        height: 110px;
        line-height: 110px;
        padding: 30px;
        display: flex;
        align-items: center;
        font-size: 30px;
        >* {
            flex: 0 0 auto;
        }
        &+& {
            border-top: 1px solid #ededed; /*no*/
        }
    }
}

.forms_error {
    padding: 30px;
    color: #f4504d;
    font-size: 24px;
}

.long_btn {
    display: block;
    box-sizing: border-box;
    width: calc(~'100% - 60px');
    margin: 0 30px;
    height: 90px;
    line-height: 90px;
    text-align: center;
    font-size: 32px;
    color: #fff;
    border-radius: 12px;
    background: #59b6d7;
    &[disabled] {
        background: rgb(211, 211, 211);
        cursor: not-allowed;
    }
}

.other_link {
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26px;
    color: #999;
    a {
        color: inherit;
    }
}
</style>