<template lang="html">
  <div class="diy-select" :class="{open}" @click='open = !open'>
    <div class="diy-select--label">{{ curSelectValue }}</div>
    <div class="diy-select--options" v-show='open'>
      <div class="diy-select--option" v-for='(option, index) in options' @click='setCurVal(option)'>
        <template v-if='option.hasMsg'>
          <v-badge :dot='option.hasMsg'>{{ option.label }}</v-badge>
        </template>
        <span v-else>{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiySelect',
  props: {
    value: null,
    options: {
      type: Array
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      curVal: '',
      open: false
    };
  },
  watch: {
    value(val) {
      this.curSelectValue = val;
    }
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
          typeof this.curVal !== 'undefined' &&
          typeof this.curVal.label !== 'undefined'
        ) {
          return this.curVal.label;
        } else {
          return this.placeholder;
        }
      }
    }
  },
  methods: {
    setCurVal(val) {
      this.curVal = val;
      this.$emit('input', val.value);
    }
  },
  mounted() {
    this.curSelectValue = '0';
  }
};
</script>

<style lang="less" src='./style/diySelect.less'>

</style>
