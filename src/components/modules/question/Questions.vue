<template>
  <div class="module-questions">

    <!-- Question navs. -->
    <nav class="module-questions-nav">
      <router-link
        to="/question"
        replace
        exact
        exact-active-class="active">热门</router-link>
      <router-link
        :to="navRouterLinkBuilder('excellent')"
        replace
        exact
        exact-active-class="active">精选</router-link>
      <router-link
        :to="navRouterLinkBuilder('reward')"
        replace
        exact
        exact-active-class="active">悬赏</router-link>
      <router-link
        :to="navRouterLinkBuilder('new')"
        replace
        exact
        exact-active-class="active">最新</router-link>
      <router-link
        :to="navRouterLinkBuilder('all')"
        replace
        exact
        exact-active-class="active">全部</router-link>
    </nav>

    <!-- Question main. -->
    <main class="module-questions-main">
      <div
        v-if="loading"
        :class="classNamebuilder('main-loading')">
        <icon-loading :class="classNamebuilder('main-loading_icon')" />
      </div>
      <module-question-list-item
        v-for="question in questions"
        :key="question.id"
        :question="question"
      />
      <div
        v-if="questions.length && !loadmore"
        :class="classNamebuilder('main-loadmore')">
        <button
          :class="classNamebuilder('main-loadmore_button')"
          @click="fetchQuestionsMore">
          加载更多
        </button>
      </div>
      <div
        v-else-if="loadmore"
        :class="[classNamebuilder('main-loadmore')]">
        <button :class="[classNamebuilder('main-loadmore_button'), 'active']">
          <icon-loading :class="classNamebuilder('main-loading_icon')" />
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import { list } from "../../../api/question/questions";
import message from "plus-message-bundle";
import QuestionsItem from "./QuestionsItem";
import Loading from "../../../icons/Loading";

/**
 * Questions page module.
 */
export default {
  /**
   * The module name.
   *
   * @type {string}
   */
  name: "ModuleQuestions",

  /**
   * The components.
   *
   * @type {Object}
   */
  components: {
    [QuestionsItem.name]: QuestionsItem,
    [Loading.name]: Loading
  },

  /**
   * Data.
   *
   * @return {Object}
   * @author Seven Du <shiweidu@outlook.com>
   */
  data: () => ({
    /**
     * Questions.
     *
     * @type {Array}
     */
    questions: [],

    /**
     * Questions loading status.
     *
     * @type {Boolean}
     */
    loading: false,

    /**
     * Load more question.
     *
     * @type {Boolean}
     */
    loadmore: false
  }),

  /**
   * The module computed data.
   *
   * @type {Object}
   */
  computed: {
    /**
     * The route query type value.
     *
     * @return {string}
     * @author Seven Du <shiweidu@outlook.com>
     */
    type() {
      const {
        query: { type = "hot" }
      } = this.$route;

      return type;
    }
  },

  /**
   * Watch methods.
   *
   * @type {Object}
   */
  watch: {
    /**
     * Watch $route.
     *
     * @return {void}
     * @author Seven Du <shiweidu@outlook.com>
     */
    $route(newRoute, oldRoute) {
      if (
        newRoute.path === oldRoute.path &&
        newRoute.query.type !== oldRoute.query.type
      ) {
        this.fetchQuestions();
      }
    }
  },

  mounted() {
    this.fetchQuestions();
  },

  /**
   * The module methods.
   *
   * @type {Object}
   */
  methods: {
    /**
     * Nav router link builder.
     *
     * @param {string} type
     * @return {Object}
     * @author Seven Du <shiweidu@outlook.com>
     */
    navRouterLinkBuilder(type) {
      return {
        path: "/question",
        query: { type }
      };
    },

    /**
     * Fetch question method.
     *
     * @return {void}
     * @author Seven Du <shiweidu@outlook.com>
     */
    fetchQuestions() {
      this.loading = true;
      this.questions = [];
      list(this.type)
        .then(({ data }) => {
          this.questions = data;
          this.loading = false;
        })
        .catch(({ response: { data } = {} }) => {
          this.loading = false;
          this.$Message.error(message(data, "加载失败，请刷新重试！"));
        });
    },

    fetchQuestionsMore() {
      this.loadmore = true;
      list(this.type, this.questions.length + 1)
        .then(({ data }) => {
          this.loadmore = false;
          if (!data.length) {
            this.$Message.error("没有更多数据了");
            return;
          }

          this.questions = [...this.questions, ...data];
        })
        .catch(({ response: { data } = {} }) => {
          this.loadmore = false;
          this.$Message.error(message(data, "加载失败，请刷新重试！"));
        });
    },

    /**
     * Class name builder.
     *
     * @param {string} className
     * @return {string}
     * @author Seven Du <shiweidu@outlook.com>
     */
    classNamebuilder(className) {
      return `module-questions-${className}`;
    }
  }
};
</script>

<style lang="less">
.module-questions {
  padding-top: 182px;
  padding-bottom: 100px;
  min-height: 100vh;
  .module-questions-nav {
    position: fixed;
    top: 90px;
    display: flex;
    width: 100%;
    height: 90px;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    color: #999;
    font-size: 30px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0;
    letter-spacing: 0;
    border-bottom: solid 0.01rem #d7d8d8;

    @media screen and (min-width: 769px) {
      width: 768px;
    }
    .active {
      color: #333;
    }
  }
  .module-questions-main {
    &-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
      &_icon {
        width: 120px;
        height: 30px;
        fill: #58b6d7;
      }
    }
    &-loadmore {
      margin: 24px auto;
      text-align: center;
      &_button {
        padding: 12px 24px;
        color: #58b6d7;
        background-color: transparent;
        border: solid 1px #58b6d7;
        border-radius: 6px;
        outline: none;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        &.active {
          color: #aaa;
          border: none;
        }
      }
    }
  }
}
</style>
