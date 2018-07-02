<template>
  <div class="module-question-list-item">
    <!-- The question title. -->
    <router-link 
      :to="`/questions/${question.id}`" 
      tag="h3" 
      class="module-question-list-item_title">
      {{ question.subject }}
      <span 
        v-show="question.excellent" 
        class="module-question-list-item-shang-i">精</span>
    </router-link>

    <!-- The question first image. -->
    <router-link
      v-if="firstImageStyle"
      :style="firstImageStyle"
      :to="`/questions/${question.id}`"
      tag="div"
      class="module-question-list-item_image"
    />

    <!-- Answer. -->
    <module-question-list-answer-card :answer="answer" />

    <!-- Bottom -->
    <router-link 
      :to="`/questions/${question.id}`" 
      class="module-question-list-item_button" 
      tag="div">
      <span>
        <span class="module-question-list-item_button-style1">{{ question.watchers_count }}</span>&nbsp;关注
      </span>
      <span>
        <span>·</span>
        <span class="module-question-list-item_button-style1">{{ question.answers_count }}</span>&nbsp;回答
      </span>
      <span v-show="question.amount">
        <span>·</span>
        <span class="module-question-list-item-shang">
          <span>赏</span>
          {{ question.amount }}
        </span>
      </span>
      <span class="module-question-list-item_button-time">{{ question.updated_at | time2tips }}</span>
    </router-link>
  </div>
</template>

<script>
import UserAvatar from "../UserAvatar";
import QuestionListAnswerCard from "./QuestionListAnswerCard";
import { syntaxTextAndImage } from "../../../util/markdown";

/**
 * Question list item.
 */
export default {
  /**
   * The component name.
   *
   * @type {String}
   */
  name: "ModuleQuestionListItem",

  /**
   * The component using components.
   *
   * @type {Object}
   */
  components: {
    [UserAvatar.name]: UserAvatar,
    [QuestionListAnswerCard.name]: QuestionListAnswerCard
  },

  /**
   * The component props.
   *
   * @type {Object}
   */
  props: {
    question: { type: Object, required: true }
  },

  /**
   * The component compoted data.
   *
   * @type {Object}
   */
  computed: {
    /**
     * Answer data.
     *
     * @return {Object|null}
     * @author Seven Du <shiweidu@outlook.com>
     */
    answer() {
      const { answer } = this.question;

      return answer;
    },

    /**
     * Question body, Images and text contents.
     *
     * @return {Object: { images: Array, text: string }}
     * @author Seven Du <shiweidu@outlook.com>
     */
    body() {
      return syntaxTextAndImage(this.question.body);
    },

    /**
     * Question body first image style.
     *
     * @return {string|false}
     * @author Seven Du <shiweidu@outlook.com>
     */
    firstImageStyle() {
      const { images } = this.body;
      const image = images.pop();

      if (image) {
        return `background-image: url(${image})`;
      }

      return false;
    }
  }
};
</script>

<style lang="less">
.module-question-list-item {
  background: #fff;
  padding: 31px;
  margin-bottom: 10px;
  // position: relative;
  // z-index: -1;
  .module-question-list-item_title {
    margin: 0;
    margin-bottom: 46px;
    font-size: 32px;
    font-weight: normal;
    font-stretch: normal;
    color: #333;
    line-height: 1.4;
  }
  .module-question-list-item_image {
    width: 100%;
    height: 300px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-bottom: 46px;
  }
  .module-question-list-item_button {
    width: 100%;
    font-size: 28px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #999999;
    &-time {
      float: right;
    }
    &-style1 {
      color: #58b6d7;
    }
  }
  &-shang {
    color: #fca308;
    &-i,
    span {
      color: #fca308;
      width: 20px;
      height: 21px;
      font-size: 22px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 0px;
      letter-spacing: 0px;
      border: solid 1px #fca308;
      padding: 4px;
    }
  }
}
</style>
