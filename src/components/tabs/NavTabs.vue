<template>
  <div 
  :id="id"
  >
    <v-tabs :class='{fixed}' :value='curTab' @change="handleTabChange" v-if='navs.length > 0'>
      <v-tab
      v-for='({ path, title }, index) in navs'
      v-if='path'
      :key='index'
      :title='title' 
      :value='path'/>
    </v-tabs>
    <transition :name="transitionName">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import vTab from './tab.vue';
import vTabs from './tabs.vue';
export default {
  name: 'nav-tabs',
  props: {
    fixed: null,
    id: {
      type: String
    },
    navs: {
      type: Array,
      required: true
    },
    value: {}
  },
  components: {
    vTab,
    vTabs
  },
  data() {
    return {
      curTab: this.value,
      transitionName: 'router-fade-in-left'
    };
  },
  watch: {
    value(val) {
      this.curTab = val;
    },
    $route(to, from) {
      if (to.meta.index < from.meta.index) {
        this.transitionName = 'router-fade-in-left';
      } else {
        this.transitionName = 'router-fade-in-right';
      }
    }
  },
  methods: {
    handleTabChange(val) {
      this.curTab = val;
      this.$router.push({
        path: val
      });
      this.$emit('input', val);
    }
  }
};
</script>

<style src='./tabs.less' lang='less'>

</style>
