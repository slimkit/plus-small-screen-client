<template>
  <div>
    <h1>TS+ 粗犷入口</h1>
    <p>
      <router-link to="/">
        <a href="#">to Home</a>
      </router-link>
      <router-link to="/login">
        <a href="#">to Login</a>
      </router-link>
      <router-link to="/register">
        <a href="#">to Register</a>
      </router-link>
      <router-link to="/findpassword">
        <a href="#">to FindPassword</a>
      </router-link>
      <router-link to="/feeds">
        <a href="#">to Feeds</a>
      </router-link>
    </p>
    <router-view></router-view>
  </div>
</template>
