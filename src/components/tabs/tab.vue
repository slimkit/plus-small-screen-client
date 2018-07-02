<template>
  <div 
    :class="{ active }"
    class="v-tab"
    @click="tabClick"><slot>{{ title }}</slot></div>
</template>
<script>
export default {
  name: "VTab",
  props: {
    title: [String],
    value: {}
  },
  data() {
    return {
      active: false
    };
  },
  methods: {
    tabClick(e) {
      if (this.$parent.handleTabClick) {
        this.$parent.handleTabClick(this.value, this);
      }
      this.$emit("click", e);
    }
  }
};
</script>
<style lang='less'>
</style>
