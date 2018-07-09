<template>
  <router-link
    :to="path"
    :class="styles"
    class="m-flex-shrink0 m-flex-grow0 m-avatar-box"
    @click.native.stop>
    <img
      v-if="avatar"
      :src="avatar"
      class="m-avatar-img"
      @error="handelError">
    <i
      v-if="icon"
      :style="icon"
      class="m-avatar-icon"/>
  </router-link>
</template>
<script>
export default {
  name: "Avatar",
  props: {
    size: { type: String, default: "def" },
    user: { type: Object, required: true }
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
      return this.uid ? `/users/${this.uid}` : "javascript:;";
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
