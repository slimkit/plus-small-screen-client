<template>
  <router-link
  :to="path" 
  class="m-flex-shrink0 m-flex-grow0 m-avatar-box"
  :class="styles" >
    <img v-if="user.avatar" :src="user.avatar" class="m-avatar-img">
    <i v-if="icon" :style='icon' class="m-avatar-icon"></i>
  </router-link>
</template>
<script>
export default {
  name: "avatar",
  props: {
    size: {
      type: String,
      default: "def"
    },
    user: {
      required: true
    }
  },
  computed: {
    uid() {
      return this.user.id;
    },
    sex() {
      return ~~this.user.sex;
    },
    icon() {
      const { verified = {} } = this.user;
      return verified && verified.icon
        ? {
            "background-image": `url("${verified.icon}")`
          }
        : false;
    },
    path() {
      return this.uid ? `/user/${this.uid}` : "javascript:;";
    },
    styles() {
      const sex = ["secret", "man", "woman"];
      return [`m-avatar-box-${this.size}`, `m-avatar-box-${sex[this.sex]}`];
    }
  }
};
</script>
