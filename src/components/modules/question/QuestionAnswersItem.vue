<template>
  <div class="module-question-answers-item">
    <div :class="classNameBuilder('avatar')">
      <module-user-avatar
        :size="0.56"
        :anonymity="anonymity"
        :src="user.avatar"
        :sex="user.sex"
      />
    </div>
    <div :class="classNameBuilder('main')">
      <h3 :class="classNameBuilder('main-header')">
        {{ anonymity ? '匿名用户' : user.name }}
        <span>{{ answer.created_at | time2tips }}</span>
      </h3>
      <div :class="classNameBuilder('main-body')">{{ answer.body | markdownText }}</div>
      <div :class="classNameBuilder('main-button')">
        <button @click="handleLikeTarget">
          <svg :class="[classNameBuilder('icon')]">
            <use  :xlink:href="answer.liked ? '#feed-like' : '#feed-unlike'" />
          </svg>
          {{ answer.likes_count | formatNum }}
        </button>
        <span>
          <svg :class="classNameBuilder('icon')">
            <use xlink:href="#message-comments" />
          </svg>
          {{ answer.comments_count | formatNum }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from "../UserAvatar";
import { like, unlike } from "../../../api/question/answer";
const name = "module-question-answers-item";
export default {
  name,
  props: {
    answer: { type: Object, required: true }
  },
  components: {
    [UserAvatar.name]: UserAvatar
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
    classNameBuilder(className) {
      return `${name}-${className}`;
    },
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
    }
  },
  created() {
    // this.answer.question_id = 1;
  }
};
</script>

<style lang="less">
@root: module-question-answers-item;
.@{root} {
  width: 100%;
  background-color: #fff;
  margin-bottom: 9px;
  padding-top: 30px;
  padding-right: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  &-avatar {
    width: 112px;
    min-width: 112px;
    max-width: 112px;
    flex-grow: 1;
    text-align: center;
  }
  &-main {
    flex-grow: 1;
    width: 100%;
    &-header {
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
    &-body {
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
    &-button {
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
        .@{root}-icon {
          margin-right: 4px;
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
  &-icon {
    width: 30px;
    height: 30px;
    margin-bottom: -6px;
    fill: #999;
  }
}
</style>
