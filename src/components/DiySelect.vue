<template lang="html">
  <div 
    :class="{open}" 
    class="diy-select" 
    @click="open = !open">
    <div class="diy-select--label">{{ curSelectValue }}</div>
    <div 
      v-show="open" 
      class="diy-select--options">
      <div 
        v-for="option in options" 
        :key="option.label" 
        class="diy-select--option" 
        @click="setCurVal(option)">
        <template v-if="option.hasMsg">
          <v-badge :dot="option.hasMsg">{{ option.label }}</v-badge>
        </template>
        <span v-else>{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DiySelect",
  props: {
    value: null,
    options: {
      type: Array
    },
    placeholder: {
      type: String,
      default: "请选择"
    }
  },
  data() {
    return {
      curVal: "",
      open: false
    };
  },
  computed: {
    curSelectValue: {
      set(val) {
        if (this.options) {
          this.options.forEach(option => {
            if (option.value === val) {
              return (this.curVal = option);
            }
          });
        }
      },
      get() {
        if (
          typeof this.curVal !== "undefined" &&
          typeof this.curVal.label !== "undefined"
        ) {
          return this.curVal.label;
        } else {
          return this.placeholder;
        }
      }
    }
  },
  watch: {
    value(val) {
      this.curSelectValue = val;
    }
  },
  mounted() {
    this.curSelectValue = "0";
  },
  methods: {
    setCurVal(val) {
      this.curVal = val;
      this.$emit("input", val.value);
    }
  }
};
</script>

<style lang="less" src='./style/diySelect.less'>
</style>
