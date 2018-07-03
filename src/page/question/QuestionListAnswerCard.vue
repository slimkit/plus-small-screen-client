<template>
  <div
    v-if="answer"
    class="module-question-list-answer-card">
    <!-- User avatar. -->
    <user-avatar
      :anonymity="anonymity"
      :src="user.avatar"
      :sex="user.sex" />
    <!-- Body -->
    {{ showUsername }}：{{ body }}
  </div>
  <div
    v-else
    class="module-question-list-answer-card-empty" />
</template>

<script>
import UserAvatar from "./components/UserAvatar.vue";
import { syntaxTextAndImage } from "@/util/markdown";

export default {
  name: "QuestionListAnswerCard",
  components: {
    UserAvatar
  },
  props: {
    answer: {
      type: [Object],
      default: null,
      validator: function(value) {
        if (!value || typeof value === "object") return true;
        return false;
      }
    }
  },
  computed: {
    /**
     * The answer anonymity.
     *
     * @return {Boolean}
     * @author Seven Du <shiweidu@outlook.com>
     */
    anonymity() {
      const { anonymity } = this.answer;
      return !!anonymity;
    },

    /**
     * Get user.
     *
     * @return {Object}
     * @author Seven Du <shiweidu@outlook.com>
     */
    user() {
      const { user } = this.answer;
      return user || {};
    },

    /**
     *  Get show username.
     *
     * @return {string}
     * @author Seven Du <shiweidu@outlook.com>
     */
    showUsername() {
      if (this.anonymity) return "匿名用户";
      return this.user.name;
    },
    body() {
      const { body } = this.answer;
      return syntaxTextAndImage(body || "").text;
    }
  }
};
</script>

<style lang="less">
@root: module-question-list-answer-card;

.@{root} {
  font-size: 30px;
  font-weight: normal;
  font-stretch: normal;
  color: #666;
  text-align: initial;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin-bottom: 46px;
  line-height: 1.4;
}

.@{root}-empty {
  display: none;
}
</style>
