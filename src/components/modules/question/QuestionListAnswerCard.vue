<template>
  <div class="module-question-list-answer-card" v-if="answer">
    <!-- User avatar. -->
    <module-user-avatar :anonymity="anonymity" :src="user.avatar" :sex="user.sex" />
    <!-- Body -->
    {{ showUsername }}：{{ body }}
  </div>
  <div v-else class="module-question-list-answer-card-empty" />
</template>

<script>
import UserAvatar from '../UserAvatar';
import { syntaxTextAndImage } from '../../../util/markdown';

/**
 * The module name.
 *
 * @type {string}
 */
const name = 'module-question-list-answer-card';

/**
 * Question list item answer card.
 */
export default {
  /**
   * The component name.
   *
   * @type {string}
   */
  name,

  /**
   * The module using components.
   *
   * @type {Object}
   */
  components: {
    [UserAvatar.name]: UserAvatar
  },

  /**
   * The module props.
   *
   * @type {Object}
   */
  props: {
    answer: {
      required: true,
      validator: function(value) {
        if (!value || value instanceof Object) {
          return true;
        }

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
      if (this.anonymity) {
        return '匿名用户';
      }

      return this.user.name;
    },

    body() {
      const { body } = this.answer;

      return syntaxTextAndImage(body || '').text;
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
  margin-bottom: 24px;
}
.@{root}-empty {
  display: none;
}
</style>
