<template>
  <header class="module-question-app-bar">
    <!-- Left Buttoms -->
    <div class="module-question-app-bar_buttom">
      <svg 
        class="m-style-svg m-svg-def" 
        @click="goBack">
        <use 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          xlink:href="#base-back"/>
      </svg>
    </div>

    <!-- Conter Tabs -->
    <div class="module-question-app-bar_tab">
      <!-- Queation type link. -->
      <router-link
        :class="questionRouteClassName"
        :replace="true"
        :exact="true"
        to="/question"
      >
        问答
      </router-link>

      <!-- Tags type link. -->
      <router-link
        :class="topicsRouteClassName"
        :replace="true"
        :exact="true"
        to="/question/topics"
      >
        话题
      </router-link>
    </div>

    <!-- Right Buttoms -->
    <div class="module-question-app-bar_buttom module-question-app-bar_buttom-right">
      <router-link
        to="/question/search"
      >
        <svg class="module-question-app-bar_buttom-icon">
          <use 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xlink:href="#base-search" />
        </svg>
      </router-link>
    </div>
  </header>
</template>

<script>
/**
 * Question Page App Bar.
 */
export default {
  /**
   * The module name.
   *
   * @type {string}
   */
  name: "ModuleQuestionAppBar",

  /**
   * The component computed data.
   *
   * @type {Object}
   */
  computed: {
    /**
     * Route path.
     *
     * @return {string}
     * @author Seven Du <shiweidu@outlook.com>
     */
    routePath() {
      const { path } = this.$route;

      return path;
    },

    /**
     * Question route class name.
     *
     * @return {Array}
     * @author Seven Du <shiweidu@outlook.com>
     */
    questionRouteClassName() {
      return [
        "module-question-app-bar_tab-item",
        { active: this.hasQuestionRouteActive }
      ];
    },

    /**
     * Topics route class name.
     *
     * @return {Array}
     * @author Seven Du <shiweidu@outlook.com>
     */
    topicsRouteClassName() {
      return [
        "module-question-app-bar_tab-item",
        { active: this.hasTopicRouteActive }
      ];
    },

    /**
     * Has question route active.
     *
     * @return {Boolean}
     * @author Seven Du <shiweidu@outlook.com>
     */
    hasQuestionRouteActive() {
      return this.routePath === "/question";
    },

    /**
     * Has topics route active.
     *
     * @return {Boolean}
     * @author Seven Du <shiweidu@outlook.com>
     */
    hasTopicRouteActive() {
      return this.routePath === "/question/topics";
    }
  }
};
</script>

<style lang="less">
// Root box class name.
.module-question-app-bar {
  width: 100%;
  height: 116px;
  background: #fff;
  border-bottom: solid 1px #dedede;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px;
  padding-left: 30px;
  position: fixed;
  z-index: 100;
  @media screen and (min-width: 769px) {
    width: 768px;
  }
  // App bar tab box class name.
  .module-question-app-bar_tab {
    width: 250px;
    height: 60px;
    display: inline-flex;
    .module-question-app-bar_tab-item {
      width: 125px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      box-sizing: content-box;
      border: solid 1px #59b6d7;
      color: #59b6d7;
      font-size: 32px;
      &.active {
        background: #59b6d7;
        color: #fff;
      }
      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }
      &:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }
    }
  }
  .module-question-app-bar_buttom {
    width: 100px;
    &.module-question-app-bar_buttom-right {
      text-align: right;
    }
    .module-question-app-bar_buttom-icon {
      fill: #333;
      width: 42px;
      height: 42px;
    }
  }
}
</style>
