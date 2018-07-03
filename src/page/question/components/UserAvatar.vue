<template>
  <avatar
    v-bind="$props"
    @click.native="handleClick">
    <!-- If anonymity user. -->
    <template v-if="anonymity">匿</template>

    <!-- Not avatar resource show icons. -->
    <svg
      v-else-if="!src"
      width="100%"
      height="100%"
      class="avatar_icon">
      <use
        :xlink:href="defaultAvatar"
        xmlns:xlink="http://www.w3.org/1999/xlink"/>
    </svg>

    <!-- Show user avatar image. -->
    <img
      v-else
      :src="src">
  </avatar>
</template>

<script>
import Avatar from "./Avatar";

export default {
  name: "UserAvatar",
  components: {
    Avatar
  },
  props: {
    src: { type: String, default: "" },
    sex: { type: Number, default: 0 },
    anonymity: { type: Boolean, default: false },
    classes: { type: [Array, String], default: "" },
    size: { type: [String, Number], default: 0.4 },
    sizeUnit: { type: String, default: "rem" }
  },
  computed: {
    /**
     * Not image resource default avatar icon class type.
     *
     * @return {string}
     * @author Seven Du <shiweidu@outlook.com>
     */
    defaultAvatar() {
      switch (this.sex) {
        case 1:
          return "#avatar-man";
        case 2:
          return "#avatar-woman";
        case 0:
        default:
          return "#avatar-secret";
      }
    }
  },
  methods: {
    /**
     * The component click handle.
     *
     * @param {Object} event
     * @return {void}
     * @author Seven Du <shiweidu@outlook.com>
     */
    handleClick(event) {
      this.$emit("click", event);
    }
  }
};
</script>
