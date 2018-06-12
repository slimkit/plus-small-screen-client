<template>
  <div class="module-questions-topics">
    <!-- navs. -->
    <nav class="module-questions-topics-nav">
      <router-link to="/question/topics" replace exact exact-active-class="active">全部话题</router-link>
      <router-link :to="{ path: '/question/topics', query: { type: 'follow' } }" replace exact exact-active-class="active">我关注的</router-link>
    </nav>

    <!-- Main -->
    <load-more
      ref="LoadQuestionTopicsContainer"
      :on-refresh="handleRefresh"
      :on-load-more="handleLoadMore"
    >
      <div class="module-questions-topics-item" v-for="topic in topics" :key="topic.id">
        <router-link tag="img" v-show="topic.avatar" :src="topic.avatar" :to="`/question-topics/${topic.id}`" />
        <router-link tag="a" :to="`/question-topics/${topic.id}`" class="title">
          <span class="topic">{{ topic.name }}</span>
          <span class="label">
            <span>{{ topic.follows_count }}</span>&nbsp;关注
            ·
            <span>{{ topic.questions_count }}</span>&nbsp;问题
          </span>
        </router-link>
        <button v-if="topic.has_follow || type === 'follow'" class="follow active" @click="handleUnfollow(topic)"><span>✓</span>已关注</button>
        <button v-else class="follow" @click="handleFollow(topic)"><span>+</span>关注</button>
      </div>
    </load-more>
  </div>
</template>

<script>
// import { Cell, Button } from 'mint-ui';
import {
  all,
  followTopics,
  follow,
  unfollow
} from "../../../api/question/topics";

/**
 * The component name.
 *
 * @type {String}
 */
const name = "module-questions-topics";

/**
 * Topics.
 */
export default {
  /**
   * The module name.
   */
  name,

  /**
   * The module using components.
   *
   * @type {Object}
   */
  components: {
    // 'mt-cell': Cell,
    // 'mt-button': Button
  },

  /**
   * The module data.
   *
   * @return {Object}
   * @author Seven Du <shiweidu@outlook.com>
   */
  data: () => ({
    topics: []
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
    },

    loadContainer() {
      return this.$refs.LoadQuestionTopicsContainer;
    },
    user() {
      const { CURRENTUSER: user } = this.$store.state;

      return user;
    }
  },

  /**
   * The module watcher.
   *
   * @type {Object}
   */
  watch: {
    /**
     * Type state watcher.
     *
     * @return {void}
     * @author Seven Du <shiweidu@outlook.com>
     */
    type() {
      this.topics = [];
      this.loadContainer.beforeRefresh();
    }
  },

  /**
   * The module methods.
   *
   * @type {Object}
   */
  methods: {
    /**
     * The module refresh handle.
     *
     * @return {[type]} [description]
     * @author Seven Du <shiweidu@outlook.com>
     */
    handleRefresh() {
      if (this.type === "follow") {
        this.handleRefreshByFollow();

        return;
      }

      this.handleRefreshByAll();
    },

    /**
     * The all topics refresh handle.
     *
     * @return {void}
     * @author Seven Du <shiweidu@outlook.com>
     */
    handleRefreshByAll() {
      const offset = 0;
      const limit = 15;
      all(offset, limit)
        .then(({ data }) => {
          this.topics = data;
          this.loadContainer.topEnd(false);
          this.loadContainer.bottomEnd(data.length < limit);
        })
        .catch(({ response: { data } = {} }) => {
          this.$Message.error(data);
          this.loadContainer.topEnd(false);
          this.loadContainer.bottomEnd(true);
        });
    },

    /**
     * The follow topics refresh handle.
     *
     * @return {void}
     * @author Seven Du <shiweidu@outlook.com>
     */
    handleRefreshByFollow() {
      const after = 0;
      const limit = 15;
      followTopics(after, limit)
        .then(({ data }) => {
          this.topics = data;
          this.loadContainer.topEnd(false);
          this.loadContainer.bottomEnd(data.length < limit);
        })
        .catch(({ response: { data } = {} }) => {
          this.$Message.error(data);
          this.loadContainer.topEnd(false);
          this.loadContainer.bottomEnd(true);
        });
    },
    handleLoadMore() {
      if (this.type === "follow") {
        this.handleLoadMoreByFollow();

        return;
      }

      this.handleLoadMoreByAll();
    },
    handleLoadMoreByAll() {
      const offset = this.topics.length;
      const limit = 15;
      all(offset, limit)
        .then(({ data }) => {
          this.topics = [...this.topics, ...data];
          this.loadContainer.bottomEnd(data.length < limit);
        })
        .catch(({ response: { data } = {} }) => {
          this.loadContainer.bottomEnd(true);
          this.$Message.error(data);
        });
    },
    handleLoadMoreByFollow() {
      const { id: after } = this.topisc[this.topics.length];
      const limit = 15;
      followTopics(after, limit)
        .then(({ data }) => {
          this.topics = [...this.topics, ...data];
          this.loadContainer.bottomEnd(data.length < limit);
        })
        .catch(({ response: { data } = {} }) => {
          this.loadContainer.bottomEnd(true);
          this.$Message.error(data);
        });
    },
    handleFollow(topic) {
      follow(topic.id)
        .then(() => {
          topic.has_follow = true;
          this.follows_count += 1;
        })
        .catch(({ response: { data } = {} }) => {
          this.$Message.error(data);
        });
    },
    handleUnfollow(topic) {
      unfollow(topic.id)
        .then(() => {
          topic.has_follow = false;
          topic.follows_count -= 1;
          if (this.type === "follow") {
            let newTopics = [];
            this.topics.forEach(_topic => {
              if (_topic.id !== topic.id) {
                newTopics.push(_topic);
              }
            });
            this.topics = newTopics;
          }
        })
        .catch(({ response: { data } = {} }) => {
          this.$Message.error(data);
        });
    }
  }
};
</script>

<style lang="less">
@root: module-questions-topics;
.@{root} {
  padding-top: 206px;
  padding-bottom: 100px;
  min-height: 100vh;
  &-nav {
    position: fixed;
    top: 116px;
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
    border-bottom: solid 1px #d7d8d8;
    z-index: 100;
    .active {
      color: #333;
    }
  }
  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 175px;
    padding: 28px 43px;
    background-color: #fff;
    border-bottom: solid 1px #d7d8d8;
    > img {
      width: 120px;
      height: 120px;
      margin-right: 18px;
    }
    .title {
      flex-grow: 1;
      display: inline-flex;
      align-items: flex-start;
      flex-direction: column;
      height: 120px;
      justify-content: center;
      .topic {
        margin-top: 17px;
        font-size: 32px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0px;
        height: 30px;
        letter-spacing: 0px;
        color: #333;
      }
      .label {
        margin-top: 19px;
        height: 26px;
        font-size: 28px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0px;
        letter-spacing: 0px;
        color: #666;
        > span {
          color: #59b6d7;
        }
      }
    }
    .follow {
      // width: 126px;
      height: 50px;
      background-color: #fff;
      border-radius: 8px;
      border: solid 2px #59b6d7;
      color: #59b6d7;
      font-size: 26px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 5px;
      letter-spacing: 0px;
      outline: none;
      > span {
        width: 20px;
        height: 20px;
        font-size: 36px;
        margin-right: 2px;
      }
      &.active {
        color: #ccc;
        border: solid 2px #ccc;
        > span {
          // display: none;
        }
      }
    }
  }
}
</style>
