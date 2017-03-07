<template>
  <div class="container">
    <!-- <header class="header">
      <el-row justify="start" type="flex" align="middle">
        <el-col :span="3" class="close back">
          <i class="el-icon-close"></i>
        </el-col>
        <el-col :span="17"><div class="grid-content bg-purple-light title ">登录</div></el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light right-top-button">
            <router-link to="/login">登录</router-link>
          </div>
        </el-col>
      </el-row>
    </header> -->
    <div class="main-content">
      <form role="form" @submit.prevent="submit">
        <div :class="$style.loginForm">
          <el-row :class="$style.formChildrenRow" class="bottom-border" justify="start" type="flex" align="middle">
            <el-col :span="5" offset="1">
              <label for="phone" :class="loginFormTitle">用户名</label>
            </el-col>
            <el-col :span="15">
              <input type="tel" placeholder="输入昵称" v-model.trim="name" id="name" name="name" value="{{ name }}" />
            </el-col>
            <el-col :span="1" offset="1">
              <i v-on:click="cleanPhone" v-show="isShowClean" class="el-icon-circle-close"></i>
            </el-col>
          </el-row>
          <el-row :class="$style.formChildrenRow" class="bottom-border" justify="start" type="flex" align="middle">
            <el-col :span="5" offset="1">
              <label for="phone" :class="loginFormTitle">用户名</label>
            </el-col>
            <el-col :span="15">
              <input type="tel" placeholder="输入昵称" v-model.trim="name" id="name" name="name" value="{{ name }}" />
            </el-col>
            <el-col :span="1" offset="1">
              <i v-on:click="cleanPhone" v-show="isShowClean" class="el-icon-circle-close"></i>
            </el-col>
          </el-row>
          <el-row :class="$style.formChildrenRow" justify="start" type="flex" align="middle">
            <el-col :span="5" offset="1">
              <label for="password" :class="loginFormTitle">密码</label>
            </el-col>
            <el-col :span="15">
              <input type="password" v-show="isShowPassword" v-model.trim="password" placeholder="请输入6位以上密码" id="password" name="password" />
              <input type="text"  v-model.trim="passwordText" v-show="isShowPasswordText" value="" placeholder="请输入6位以上密码" />
            </el-col>
            <el-col :span="1" offset="1">
              <i v-on:click="showPassword" :class="{ 'el-icon-arrow-up': isShowPasswordText, 'el-icon-arrow-down': isShowPassword }"></i>
            </el-col>
          </el-row>
        </div>
        <div id="notice">
          <el-row justify="start" type="flex" align="middle">
            <el-col :span="22" offset="1">
              <p class="notice error">{{ error }}</p>
            </el-col>
          </el-row>
        </div>
        <div :class="operation">
         <el-row justify="start" type="flex" align="middle">
            <el-col :span="22" offset="1">
              <el-button type="primary" native-type="submit" :disabled="isDisabled" :class="$style.loginButton" size="large">登录</el-button>
            </el-col>
          </el-row>
        </div>
      </form>
      <div :class="$style.otherOperation">
        <el-row justify="start" type="flex">
          <el-col :span="12" offset="1">
            <router-link to="/register">
              注册账号
            </router-link>
          </el-col>
          <el-col :span="10">
            <router-link style="float: right" to="/findpassword">
              找回密码
            </router-link>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  const register = {
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
      errors: {} // 错误对象
    })
  }
</script>

<style lang="scss" module>
  .formChildrenRow {
    height: 55px;
    line-height: 55px;
    position: relative;
  }
  .loginForm {
    background-color: #fff;
    &:focus, &:active {
      background-color: #fff;
    }
  }
  .loginButton {
    width: 100%;
    background-color: #59b6d7;
    border: none;
    &:focus, &:active {
      background-color: #4ab2ce;
      color: #fff;
    }
  }

  .otherOperation {
    height: 42px;
    line-height: 42px;
  }

  .otherOperation a{
    font-size: 14px;
  }

</style>
<style lang="css">
  .el-icon-circle-close {
    /*right: 2.08333%;*/
    font-size: 18px;
    /*top: 17px;*/
    /*position: absolute;*/
    z-index: 2;
  }
  .el-icon-circle-close:before {
    color: #999;
  }
</style>
