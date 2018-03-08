<template>
  <div class="v-tabs">
    <slot></slot>
    <span class="v-tab-link-highlight init" ref="highlight"></span>
  </div>
</template>
<script>
export default {
  name: "v-tabs",
  props: ["value"],
  data() {
    return {};
  },
  updated() {
    this.setTabLightStyle();
  },
  methods: {
    handleTabClick(value) {
      if (this.value !== value) {
        this.$emit("change", value);
      }
    },
    getActiveIndex() {
      if (!this.$children || this.$children.length === 0) return -1;
      let activeIndex = -1;
      this.$children.forEach((tab, i) => {
        if ((tab.active = tab.value === this.value)) {
          activeIndex = i;
          return false;
        }
      });
      return activeIndex;
    },
    setTabLightStyle() {
      const cl = this.$children;
      const el = this.$refs.highlight;
      const index = this.getActiveIndex();
      const $el = index >= 0 ? cl[index].$el : {};
      const x = $el.offsetLeft;
      const w = $el.clientWidth;
      el.style.width = w > 0 ? w + 10 + "px" : "100%";
      el.style.transform = `translate3d(${x - 5}px, 0, 0)`;
    }
  },
  mounted() {
    this.setTabLightStyle();
    setTimeout(() => {
      this.$refs.highlight.classList.remove("init");
    }, 300);
  }
};
</script>
