<template>
  <div>
    <head-top :go-back='true' title='问题详情'></head-top>
    <div :class="classNameBuilder('container')">
      <load-more
        ref="questionLoadContainer"
        :on-refresh="handleRefreshAnswers"
        :on-load-more="handleLoadMoreAnswers"
      >
        <!-- Main -->
        <div :class="classNameBuilder('main')">

          <!-- Topics -->
          <div :class="classNameBuilder('main-topics')">
            <router-link
              v-for="topic in topics"
              :to="`/question-topics/${topic.id}`"
              :key="topic.id"
              class="label"
            >
              {{ topic.name }}
            </router-link>
          </div>

          <!-- Title -->
          <h3 :class="classNameBuilder('main-title')">{{ question.subject }}</h3>

          <!-- Body -->
          <div :class="['markdown-body', classNameBuilder('main-body')]" v-html="htmlBody"></div>

          <!-- watch -->
          <div :class="classNameBuilder('main-watch')">
            <div :class="classNameBuilder('main-watch-count')">
              <span class="follow-count">{{ question.watchers_count }}&nbsp;关注</span>
              <span v-show="question.amount">
                <span>·</span>
                <span class="shang">
                  <span>赏</span>
                  {{ question.amount }}
                </span>
              </span>
            </div>

            <!-- Watch question button -->
            <button
              v-if="question.watched"
              :class="[classNameBuilder('main-watch-follow'), 'active']"
              @click="handleUnwatch"
            >
              <span>✓</span>已关注
            </button>
            <button
              v-else
              :class="classNameBuilder('main-watch-follow')"
              @click="handleWatch"
            >
              <span>+</span>关注
            </button>
          </div>

          <!-- Button -->
          <div :class="classNameBuilder('main-button')">
            <div class="button">
              <svg :class="classNameBuilder('main-button-icon')">
                <use xlink:href="#base-reward" />
              </svg>
              {{ question.amount ? '已' : '未' }}设置悬赏
            </div>
            <span></span>
            <div class="button">
              <svg :class="classNameBuilder('main-button-icon')">
                <use xlink:href="#base-edit" />
              </svg>
              添加回答
            </div>
          </div>
        </div>

        <!-- Amswers -->
        <div :class="classNameBuilder('answers-tool')">
          <div>{{ question.answers_count }}个回答</div>
          <button @click="handleTargetAnswersOrder">
            {{ answersTimeOrder ? '时间排序' : '默认排序' }}
            <svg class="icon">
              <use xlink:href="#base-filter-list" />
            </svg>
          </button>
        </div>

        <!-- Answer list -->
        <module-question-answers-item
          v-for="answer in answers"
          :key="answer.id"
          :answer="answer"
        />
      </load-more>
    </div>
    <div :class="classNameBuilder('tabbar')">
      <a href="#" :class="classNameBuilder('tabbar-item')">
        <svg :class="classNameBuilder('tabbar-icon')">
          <use xlink:href="#message-comments" />
        </svg>
        评论
      </a>
      <a href="#" :class="classNameBuilder('tabbar-item')">
        <svg :class="classNameBuilder('tabbar-icon')">
          <use xlink:href="#base-share" />
        </svg>
        分享
      </a>
      <a v-show="editer" href="#" :class="classNameBuilder('tabbar-item')">
        <svg :class="classNameBuilder('tabbar-icon')">
          <use xlink:href="#edit" />
        </svg>
        编辑
      </a>
      <a href="#" :class="classNameBuilder('tabbar-item')">
        <svg :class="classNameBuilder('tabbar-icon')">
          <use xlink:href="#base-more" />
        </svg>
        更多
      </a>
    </div>
  </div>
</template>

<script>
import { show, watch, unwatch } from '../../api/question/questions';
import { listByDefault, listByTime } from '../../api/question/answer';
import { render } from '../../util/markdown';
import QuestionAnswersItem from '../modules/question/QuestionAnswersItem';
/**
 * The page name.
 *
 * @type {String}
 */
const name = 'page-question';

export default {
  /**
   * The page component name.
   *
   * @type {String}
   */
  name,
  components: {
    [QuestionAnswersItem.name]: QuestionAnswersItem
  },
  /**
   * The page data.
   *
   * @return {Object}
   * @author Seven Du <shiweidu@outlook.com>
   */
  data: () => ({
    question: {},
    answersTimeOrder: false,
    answers: []
  }),
  /**
   * The page computed data.
   *
   * @type {Object}
   */
  computed: {
    /**
     * The loged user.
     *
     * @return {Object}
     * @author Seven Du <shiweidu@outlook.com>
     */
    logedUser() {
      const { CURRENTUSER: user } = this.$store.state;

      return user;
    },

    /**
     * The loged user is deiter?
     *
     * @return {boolean}
     * @author Seven Du <shiweidu@outlook.com>
     */
    editer() {
      // 请不要删除，目前暂时不需要管理员可修改问题。
      // 后续需要增加的功能。
      // const { roles = [] } = this.logedUser;
      // for (let index in roles) {
      //   let role = roles[index];
      //   if (role.name === 'founder') {
      //     return true;
      //   }
      // }

      return false;
    },
    topics() {
      const { topics = [] } = this.question;

      return topics;
    },
    htmlBody() {
      const { body = '' } = this.question;

      return render(body);
    },
    loadContainer() {
      return this.$refs.questionLoadContainer;
    },
    answerRequestMethod() {
      if (this.answersTimeOrder) {
        return listByTime;
      }

      return listByDefault;
    }
  },
  watch: {
    answersTimeOrder() {
      this.answers = [];
      this.loadContainer.beforeRefresh();
    }
  },
  /**
   * Methods.
   *
   * @type {Object}
   */
  methods: {
    /**
     * Class name builder.
     *
     * @param {string} className
     * @return {string}
     * @author Seven Du <shiweidu@outlook.com>
     */
    classNameBuilder(className) {
      return `${name}-${className}`;
    },
    fetch(cb = null) {
      show(this.$route.params.id).then(({ data }) => {
        this.question = data;
        if (cb instanceof Function) {
          cb();
        }
      }).catch(({ response: { data } = {} }) => {
        this.loadContainer.topEnd(false);
        this.loadContainer.bottomEnd(true);
        this.$Message.error(data);
      });
    },
    refreshAnswer() {
      this.answerRequestMethod(this.$route.params.id).then(({ data }) => {
        this.loadContainer.topEnd(false);
        this.loadContainer.bottomEnd(data.length < 15);
        this.answers = data;
      }).catch(({ response: { data } = {} }) => {
        this.loadContainer.topEnd(false);
        this.loadContainer.bottomEnd(true);
        this.$Message.error(data);
      });
    },
    handleRefreshAnswers() {
      this.fetch(this.refreshAnswer);
    },
    handleTargetAnswersOrder() {
      this.answersTimeOrder = !this.answersTimeOrder;
    },
    handleWatch() {
      watch(this.$route.params.id).then(() => {
        this.question.watched = true;
        this.question.watchers_count += 1;
      }).catch(({ response: { data } = {} }) => {
        this.$Message.error(data);
      });
    },
    handleUnwatch() {
      unwatch(this.$route.params.id).then(() => {
        this.question.watched = false;
        this.question.watchers_count -= 1;
      }).catch(({ response: { data } = {} }) => {
        this.$Message.error(data);
      });
    },
    handleLoadMoreAnswers() {
      this.answerRequestMethod(
        this.$route.params.id,
        this.answers.length
      ).then(({ data }) => {
        this.loadContainer.bottomEnd(data.length < 15);
        this.answers = [ ...this.answers, ...data ];
      }).catch(({ response: { data } = {} }) => {
        this.loadContainer.bottomEnd(true);
        this.$Message.error(data);
      });
    }
  }
};
</script>

<style lang="less">
@root: page-question;
.@{root} {
  &-container {
    padding-bottom: 94px;
  }
  &-tabbar {
    position: fixed;
    z-index: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 94px;
    width: 100%;
    background-color: #fff;
    bottom: 0;
    border-top: solid 1px #d7d8d8;
    &-item {
      flex-grow: 1;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    &-icon {
      width: 32px;
      height: 32px;
      margin-bottom: 6px;
    }
  }
  &-main {
    background-color: #fff;
    padding: 30px 30px 0;
    width: 100%;
    max-width: 100%;
    height: auto;
    &-topics {
      width: 100%;
      height: auto;
      padding: 0 0 17px 0;
      border-bottom: solid 1px #d7d8d8;
      > .label {
        display: inline-block;
        height: 41px;
        background-color: #def0f7;
        border-radius: 20px;
        font-size: 23px;
        font-weight: normal;
        font-stretch: normal;
        color: #666;
        padding: 8px 20px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
    &-title {
      font-size: 35px;
      color: #333333;
      font-weight: normal;
    }
    &-body {
      font-size: 29px;
    }
    &-watch {
      width: 100%;
      font-size: 26px;
      color: #999;
      margin: 44px auto;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      &-follow {
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
      &-count {
        .follow-count {
          margin-right: 12px;
        }
        .shang {
          margin-left: 12px;
          color: #fca308;
          > span {
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
    }
    &-button {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: row;
      width: 100%;
      height: 90px;
      border-top: solid 1px #d7d8d8;
      font-size: 28px;
      > .button {
        flex-grow: 1;
        width: 100%;
        height: 90px;
        line-height: 90px;
        text-align: center;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
      > span {
        height: 40px;
        width: 2px;
        background-color: #d7d8d8;
      }
      &-icon {
        width: 30px;
        height: 30px;
        margin-top: -2px;
        margin-right: 20px;
      }
    }
  }
  &-answers-tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    color: #999;
    padding: 25px 27px;
    > button {
      background-color: transparent;
      outline: none;
      > .icon {
        width: 30px;
        height: 30px;
        margin-bottom: -6px;
        margin-left: 14px;
      }
    }
  }
}
</style>
