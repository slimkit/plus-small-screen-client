<template>
  <div class="module-questions-topics">
    <!-- navs. -->
    <nav class="module-questions-topics-nav">
      <router-link
        to="/question/topics"
        replace
        exact
        exact-active-class="active">全部话题</router-link>
      <router-link
        :to="{ path: '/question/topics', query: { type: 'follow' } }"
        replace
        exact
        exact-active-class="active">我关注的</router-link>
    </nav>

    <!-- Main -->
    <load-more
      ref="LoadQuestionTopicsContainer"
      :on-refresh="handleRefresh"
      :on-load-more="handleLoadMore" >
      <topic-card
        v-for="topic in topics"
        :key="topic.id"
        :topic="topic"
        :type="type"
        @follow="handleFollow"
        @unfollow="handleUnfollow"/>
    </load-more>
  </div>
</template>

<script>
import TopicCard from "./components/TopicCard.vue";
import * as api from "@/api/question/topics.js";

export default {
  name: "TopicList",
  components: {
    TopicCard
  },
  data: () => ({
    topics: []
  }),
  computed: {
    type() {
      const { type = "hot" } = this.$route.query;
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
  watch: {
    type() {
      this.topics = [];
      this.loadContainer.beforeRefresh();
    }
  },
  mounted() {
    this.loadContainer.beforeRefresh();
  },
  methods: {
    handleRefresh() {
      if (this.type === "follow") {
        this.handleRefreshByFollow();

        return;
      }

      this.handleRefreshByAll();
    },
    handleRefreshByAll() {
      const offset = 0;
      const limit = 15;
      api
        .all(offset, limit)
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
    handleRefreshByFollow() {
      const after = 0;
      const limit = 15;
      api
        .getFollowTopics(after, limit)
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
      api
        .all(offset, limit)
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
      api
        .getFollowTopics(after, limit)
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
      api.followTopic(topic.id).then(() => {
        topic.has_follow = true;
        this.follows_count += 1;
      });
    },
    handleUnfollow(topic) {
      api
        .unfollowTopic(topic.id)
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
  padding-top: 182px;
  padding-bottom: 100px;
  min-height: 100vh;
  &-nav {
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
    border-bottom: solid 1px #d7d8d8;
    z-index: 100;
    > a {
      color: #d7d8d8;
    }
    .active {
      color: #333;
    }
  }
}
</style>
