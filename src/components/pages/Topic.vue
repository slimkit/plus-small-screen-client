<template>
  <div>
    <!-- Header bar. -->
    <head-top
      :title="topic.name || '话题详情'"
      :go-back="true"
      :append="true"
    >
      <button slot="append" :class="classNameBuilder('share')">
        <svg class="icon">
          <use xlink:href="#base-share" />
        </svg>
      </button>
    </head-top>

    <!-- Topic base -->
    <div><!-- 我是占位空元素 --></div>
    <div :class="classNameBuilder('topic')">
      <img src="https://images.zhibocloud.cn/question/topics/000/000/000/02.png">
      <div class="title">
        <h3 class="topic">{{ topic.name }}</h3>
        <span class="label">
            <span>{{ topic.follows_count }}</span>&nbsp;关注
            ·
            <span>{{ topic.questions_count }}</span>&nbsp;问题
          </span>
      </div>
      <button
        v-if="topic.has_follow"
        class="follow active"
        @click="handleUnfollow(topic)"
      >
        <span>✓</span>已关注
      </button>
      <button v-else class="follow" @click="handleFollow(topic)">
        <span>+</span>关注
      </button>
    </div>

    <!-- Topic desc -->
    <div :class="classNameBuilder('topic-desc')">
      话题简介：{{ topic.description }}
    </div>

    <!-- Experts -->
    <div :class="classNameBuilder('experts')">
      <span>{{ topic.experts_count }}位相关专家</span>
      <div>
        <user-avatar
          v-for="user, index in topic.experts"
          :key="user.id"
          :class="classNameBuilder('experts-user')"
          :size="0.5"
          :src="user.avatar"
          :sex="user.sex"
          :style="[{ zIndex: topic.experts.length - index }]"
        />
      </div>
    </div>

    <!-- Types nav -->
    <nav :class="classNameBuilder('types')" ref="types">
      <router-link :to="{ path: `/question-topics/${id}` }" replace exact exact-active-class="active">热门</router-link>
      <router-link :to="{ path: `/question-topics/${id}`, query: { type: 'excellent' } }" replace exact exact-active-class="active">精选</router-link>
      <router-link :to="{ path: `/question-topics/${id}`, query: { type: 'reward' } }" replace exact exact-active-class="active">悬赏</router-link>
      <router-link :to="{ path: `/question-topics/${id}`, query: { type: 'new' } }" replace exact exact-active-class="active">最新</router-link>
      <router-link :to="{ path: `/question-topics/${id}`, query: { type: 'all' } }" replace exact exact-active-class="active">全部</router-link>
    </nav>

    <!-- Questions -->
    <load-more
      ref="load"
      :class="[classNameBuilder('questions')]"
      :on-refresh="handleRefresh"
      :on-load-more="handleLoadQuestions"
      :scrolling="handleScrolling"
    >
      <question-item
        v-for="question in questions"
        :key="question.id"
        :question="question"
      />
    </load-more>

  </div>
</template>

<script>
import UserAvatar from '../modules/UserAvatar';
import QuestionsItem from '../modules/question/QuestionsItem';
import { show, questions, follow, unfollow } from '../../api/question/topics';
const name = 'page-question-topic';
export default {
  name,
  components: {
    'user-avatar': UserAvatar,
    'question-item': QuestionsItem
  },
  data: () => ({
    topic: {},
    loading: true,
    questions: [],
    typeNavOffsetTop: 0
  }),
  computed: {
    id() {
      return this.$route.params.id;
    },
    type() {
      const { type = 'hot' } = this.$route.query;

      return type;
    },
    loadContainer() {
      return this.$refs.load;
    }
  },
  watch: {
    '$route'(newRoute, oldRoute) {
      console.log(newRoute.path === oldRoute.path && newRoute.query.type !== oldRoute.query.type);
      if (newRoute.path === oldRoute.path && newRoute.query.type !== oldRoute.query.type) {
        this.questions = [];
        this.loadContainer.beforeRefresh();
      }
    }
  },
  methods: {
    classNameBuilder(className) {
      return `${name}-${className}`;
    },
    handleRefresh() {
      show(this.id).then(({ data }) => {
        this.loading = false;
        this.topic = data;
        this.handleRefreshQuestions();
      }).catch(({ response: { data } = {} }) => {
        this.loading = true;
        this.loadContainer.topEnd(false);
        this.loadContainer.bottomEnd(true);
        this.$Message.error(data);
      });
    },
    handleRefreshQuestions() {
      const offset = 0;
      const limit = 15;
      questions(this.id, this.type, offset, limit).then(({ data }) => {
        this.questions = data;
        this.loadContainer.topEnd(false);
        this.loadContainer.bottomEnd(data.length < limit);
      }).catch(({ response: { data } = {} }) => {
        this.loadContainer.topEnd(false);
        this.loadContainer.bottomEnd(true);
        this.$Message.error(data);
      });
    },
    handleLoadQuestions() {
      const offset = this.questions.length;
      const limit = 15;
      questions(this.id, this.type, offset, limit).then(({ data }) => {
        this.questions = [ ...this.questions, ...data ];
        this.loadContainer.bottomEnd(data.length < limit);
      }).catch(({ response: { data } = {} }) => {
        this.loadContainer.bottomEnd(true);
        this.$Message.error(data);
      });
    },
    handleScrolling() {
      const nav = this.$refs.types;
      const offsetTop = this.typeNavOffsetTop;
      const y = document.documentElement.scrollTop + 48;
      if (y >= offsetTop) {
        nav.style.position = 'fixed';
        nav.style.marginTop = 0;
        nav.style.top = '0.9rem';
        return;
      }
      nav.style.position = 'relative';
      nav.style.marginTop = '-1rem';
      nav.style.top = '1.16rem';
    },
    handleFollow(topic) {
      follow(topic.id).then(() => {
        topic.has_follow = true;
        this.follows_count += 1;
      }).catch(({ response: { data } = {} }) => {
        this.$Message.error(data);
      });
    },
    handleUnfollow(topic) {
      unfollow(topic.id).then(() => {
        topic.has_follow = false;
        topic.follows_count -= 1;
        if (this.type === 'follow') {
          let newTopics = [];
          this.topics.forEach((_topic) => {
            if (_topic.id !== topic.id) {
              newTopics.push(_topic);
            }
          });
          this.topics = newTopics;
        }
      }).catch(({ response: { data } = {} }) => {
        this.$Message.error(data);
      });
    }
  },
  mounted() {
    this.typeNavOffsetTop = this.$refs.types.offsetTop;
    if (!(this.loadContainer.onLoadMore instanceof Function)) {
      document.onscroll = () => {
        this.handleScrolling();
      };
    }
  }
}
</script>

<style lang="less">
@root: page-question-topic;
.@{root} {
  width: 100%;
  height: auto;
  &-share {
    width: 40px;
    height: 90px;
    background-color: transparent;
    margin-top: 20px;
    > .icon {
      width: 40px;
      height: 40px;
    }
  }
  &-topic {
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
      }
    }
  }
  &-topic-desc {
    width: 100%;
    font-size: 28px;
    color: #666;
    padding: 29px 30px;
    background-color: #fff;
  }
  &-experts {
    width: 100%;
    padding: 30px;
    display: flex;
    background-color: #fff;
    border-top: solid 1px #d7d8d8;
    justify-content: space-between;
    align-items: center;
    > span {
      font-size: 28px;
      color: #999;
    }
    &-user {
      position: relative;
      border: solid 1px #fff;
      margin-left: -20px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  &-types {
    margin-top: -100px;
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
    border-bottom: solid 0.01rem #d7d8d8;
    z-index: 100;
    position: relative;
    .active {
      color: #333;
    }
  }
  &-questions {
    padding-top: 116px;
  }
}
</style>
