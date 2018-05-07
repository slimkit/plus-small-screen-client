<template>
  <router-link
  @click.native.stop
  :to="path"
  class="m-flex-shrink0 m-flex-grow0 m-avatar-box"
  :class="styles" >
    <img v-if="avatar" :src="avatar" @error="handelError" class="m-avatar-img">
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
      return this.avatar
        ? [`m-avatar-box-${this.size}`]
        : [`m-avatar-box-${this.size}`, `m-avatar-box-${sex[this.sex]}`];
    },
    avatar: {
      get() {
        return this.user.avatar;
      },
      set(val) {
        this.user.avatar = val;
      }
    }
  },
  methods: {
    handelError() {
      this.avatar = null;
    }
  }
};
</script>
