<template>
  <div class="p-setting">
    <header class="m-pos-f m-box m-aln-center m-head-top m-main m-bb1">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0">
        <svg 
          class="m-style-svg m-svg-def" 
          @click="goBack">
          <use 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box-model m-flex-grow1 m-aln-center m-flex-base0 m-head-top-title">
        <span>设置</span>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"/>
    </header>
    <main style="padding-top: 0.9rem">
      <ul class="m-box-model m-entry-group padding">
        <router-link 
          to="/changePassword" 
          tag="li" 
          class="m-entry">
          <span>修改密码</span>
          <svg class="m-style-svg m-svg-def m-entry-append">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-arrow-r"/>
          </svg>
        </router-link>
        <router-link 
          to="/about" 
          tag="li" 
          class="m-entry">
          <span class="m-box m-text-box m-flex-grow1">关于我们</span>
          <span class="m-box m-text-box m-flex-grow1 m-justify-end m-entry-extra">{{ version }}</span>
          <svg class="m-style-svg m-svg-def m-entry-append">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-arrow-r"/>
          </svg>
        </router-link>
        <li 
          class="m-entry" 
          @click="signOut">
          <a>退出登录</a>
          <svg class="m-style-svg m-svg-def m-entry-append">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-arrow-r"/>
          </svg>
        </li>
      </ul>
    </main>
  </div>
</template>
<script>
import bus from "@/bus.js";
export default {
  name: "Setting",
  computed: {
    version() {
      return "V3.5.3";
    }
  },
  methods: {
    signOut() {
      const actions = [
        {
          text: "退出",
          style: {
            color: "#f4504d"
          },
          method: () => {
            this.$store.dispatch("SIGN_OUT");
            this.$nextTick(() => {
              this.$router.push("/signin");
            });
          }
        }
      ];
      bus.$emit("actionSheet", actions, "取消", "确认退出?");
    }
  }
};
</script>
