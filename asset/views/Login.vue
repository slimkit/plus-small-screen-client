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
            <router-link to="/register">注册</router-link>
          </div>
        </el-col>
      </el-row>
    </header> -->
    <div class="main-content">
      <div :class="$style.loginForm">
        <el-row class="form-children-row bottom-border" justify="start" type="flex" align="middle">
          <el-col :span="5" offset="1">
            <label for="phone" class="login-form-title">手机号</label>
          </el-col>
          <el-col :span="18">
            <input type="tel" placeholder="请输入手机号" id="phone" name="phone" />
          </el-col>
        </el-row>
        <el-row class="form-children-row" justify="start" type="flex" align="middle">
          <el-col :span="5" offset="1">
            <label for="password" class="login-form-title">密码</label>
          </el-col>
          <el-col :span="18">
            <input type="password" placeholder="请输入6位以上密码" id="password" name="password" />
          </el-col>
        </el-row>
      </div>
      <div id="notice">
        <el-row justify="start" type="flex" align="middle">
          <el-col :span="22" offset="1">
            <p class="notice error">登录密码错误</p>
          </el-col>
        </el-row>
      </div>
      <div :class="operation">
       <el-row justify="start" type="flex" align="middle">
          <el-col :span="22" offset="1">
            <el-button type="primary" :class="$style.loginButton" size="large">登录</el-button>
          </el-col>
        </el-row>
      </div>
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

<style lang="scss" module>
  .formChildrenRow {
    height: 55px;
    line-height: 55px;
  }
  .loginForm {
    background-color: #fff;
  }
  .loginButton {
    width: 100%;
    background-color: #59b6d7;
    border: none;
    &:focus {
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