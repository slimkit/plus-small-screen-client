<template>
  <div class="v-tab"
  :class='{ active }'
  @click='tabClick'><slot>{{ title }}</slot></div>
</template>
<script>
export default {
  name: 'v-tab',
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
      this.$emit('click', e);
    }
  }
};
</script>
<style lang='less'>

</style>
