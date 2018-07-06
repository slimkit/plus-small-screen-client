<template>
  <div
    class="question-answer-item"
    @click="viewDetail">
    <div
      class="avatar"
      @click.stop="viewUser">
      <user-avatar
        :size="0.56"
        :anonymity="anonymity"
        :src="user.avatar"
        :sex="user.sex" />
    </div>
    <div class="main">
      <h3 class="main-header">
        <template @click.stop="viewUser">{{ anonymity ? '匿名用户' : user.name }}</template>
        <span>{{ answer.created_at | time2tips }}</span>
      </h3>
      <div class="main-body">{{ answer.body | markdownText }}</div>
      <div class="main-button">
        <button @click.stop="handleLikeTarget">
          <svg class="icon">
            <use :xlink:href="answer.liked ? '#feed-like' : '#feed-unlike'" />
          </svg>
          {{ answer.likes_count | formatNum }}
        </button>
        <span>
          <svg class="icon">
            <use xlink:href="#message-comments" />
          </svg>
          {{ answer.comments_count | formatNum }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from "./components/UserAvatar.vue";
import { like, unlike } from "@/api/question/answer";

export default {
  name: "QuestionAnswerItem",
  components: {
    UserAvatar
  },
  props: {
    answer: { type: Object, required: true }
  },
  data: () => ({
    likeTargetHanding: false
  }),
  computed: {
    anonymity() {
      const { anonymity } = this.answer;
      return !!anonymity;
    },
    user() {
      const { user = {} } = this.answer;
      return user;
    }
  },
  methods: {
    handleLike() {
      like(this.answer.id)
        .then(() => {
          this.likeTargetHanding = false;
          this.answer.liked = true;
          this.answer.likes_count += 1;
        })
        .catch(({ response: { data } = {} }) => {
          this.likeTargetHanding = false;
          this.$Message.error(data);
        });
    },
    handleUnlike() {
      unlike(this.answer.id)
        .then(() => {
          this.likeTargetHanding = false;
          this.answer.liked = false;
          this.answer.likes_count -= 1;
        })
        .catch(({ response: { data } = {} }) => {
          this.likeTargetHanding = false;
          this.$Message.error(data);
        });
    },
    handleLikeTarget() {
      if (this.likeTargetHanding) {
        this.$Message.warning("正在执行，请勿重复点击!");
        return;
      } else if (this.answer.liked) {
        this.handleUnlike();
        return;
      }
      this.handleLike();
    },
    viewDetail() {
      this.$router.push(
        `/questions/${this.answer.question_id}/answers/${this.answer.id}`
      );
    },
    viewUser() {
      if (!this.user.id) return;
      this.$router.push(`/users/${this.user.id}`);
    }
  }
};
</script>

<style lang="less" scoped>
.question-answer-item {
  width: 100%;
  background-color: #fff;
  margin-bottom: 9px;
  padding-top: 30px;
  padding-right: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;

  .avatar {
    width: 112px;
    min-width: 112px;
    max-width: 112px;
    flex-grow: 1;
    text-align: center;
  }

  .main {
    flex-grow: 1;
    width: 100%;

    .main-header {
      width: 100%;
      font-size: 26px;
      font-weight: normal;
      font-stretch: normal;
      color: #333;
      margin-top: 0;
      margin-bottom: 29px;

      > span {
        float: right;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        color: #ccc;
      }
    }

    .main-body {
      text-align: initial;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      font-size: 28px;
      font-weight: normal;
      font-stretch: normal;
      color: #666;
      margin-bottom: 28px;
      line-height: 1.4;
    }

    .main-button {
      display: flex;
      flex-direction: row;
      border-top: solid 1px #d7d8d8;
      padding: 22px 0;

      > * {
        margin-right: 90px;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        color: #b3b3b3;

        .icon {
          margin-right: 4px;
          width: 30px;
          height: 30px;
          margin-bottom: -6px;
          fill: #999;

          &.active {
            fill: red;
          }
        }
      }

      button {
        background-color: transparent;
        outline: none;
      }
    }
  }
}
</style>
