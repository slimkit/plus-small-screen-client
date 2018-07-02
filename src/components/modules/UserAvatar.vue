<template>
  <module-avatar 
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
  </module-avatar>
</template>

<script>
import Avatar from "./Avatar";

/**
 * UserAvatar component.
 */
export default {
  /**
   * The component name.
   *
   * @type {String}
   */
  name: "ModuleUserAvatar",

  /**
   * The component using components.
   *
   * @type {Object}
   */
  components: {
    [Avatar.name]: Avatar
  },

  /**
   * The component props.
   *
   * @type {Object}
   */
  props: {
    src: String,
    sex: { type: Number, default: 0 },
    anonymity: { type: Boolean, default: false },
    classes: { type: [Array, String] },
    size: { type: [String, Number], default: 0.4 },
    sizeUnit: { type: String, default: "rem" }
  },

  /**
   * the component computed data.
   *
   * @type {Object}
   */
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

  /**
   * The component methods.
   *
   * @type {Object}
   */
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
