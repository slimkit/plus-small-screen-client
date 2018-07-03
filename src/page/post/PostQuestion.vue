<template>
  <div class="p-post-question">
    <header class="m-pos-f m-box m-aln-center m-justify-bet m-head-top m-main m-bb1">
      <div class="m-flex-grow1 m-flex-shrink1 m-flex-base0">
        <a
          v-if="step === 1"
          @click.prevent="cancel">取消</a>
        <svg
          v-else
          class="m-style-svg m-svg-def"
          @click="preStep">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box m-flex-grow1 m-flex-shrink0 m-flex-base0 m-justify-center m-head-top-title">
        <span>{{ title }}</span>
      </div>
      <div class="m-flex-grow1 m-flex-shrink1 m-flex-base0 m-text-r">
        <a
          v-if="step !== 3"
          :class="{ disabled }"
          class="m-send-btn"
          @click.prevent="nextStep">下一步</a>
        <a
          v-if="step === 3 && selectedTops.length > 0"
          class="m-send-btn"
          @click="beforePost">发布</a>
      </div>
    </header>
    <transition-group
      :enter-active-class="animated.enterClass"
      :leave-active-class="animated.leaveClass"
      tag="main"
      class="m-box-model m-flex-grow1 m-flex-shrink1 p-post-question-main"
      style="padding-top: 0.9rem;">
      <div
        v-show="step === 1"
        key="step1"
        class="m-pos-f m-box-model m-flex-grow1 m-flex-shrink1 m-main">
        <div class="m-box m-flex-grow0 m-shrink0 m-bb1 m-lim-width question-title">
          <content-text
            ref="contentText"
            :rows="1"
            :maxlength="50"
            :warn-length="30"
            class="m-reles-txt-wrap"
            placeholder="请输入问题并以问号结尾"
            @input="serachQuestionByKey"
          />
        </div>
        <ul class="m-box-model m-flex-grow1 m-flex-shrink1 m-lim-width question-list">
          <router-link
            v-for="q in questions"
            v-if="q.id"
            :key="q.id"
            :to="`/questions/${q.id}`"
            tag="li">
            {{ q.subject }}
          </router-link>
        </ul>
      </div>
      <div
        v-show="step === 2"
        key="step2"
        class="m-pos-f m-box-model m-flex-grow1 m-flex-shrink1 m-main"
        @click="autoFoucs">
        <div class="m-rich-box">
          <span
            v-if="showPlaceholder"
            class="placeholder">详细描述你的问题，有助于受到准确的回答</span>
          <div
            ref="editor"
            tabindex="0"
            class="m-editor"
            contenteditable="true"
            @blur="onBlur"
            @input="setContent"/>
        </div>
      </div>
      <div
        v-show="step === 3"
        key="step3"
        class="m-pos-f m-box-model m-flex-grow1 m-flex-shrink1 m-main">
        <ul class="m-flex-grow0 m-flex-shrink0 m-topics ml">
          <li
            v-for="topic in selectedTops"
            :key="`selected-${topic.id}`"
            class="m-box m-aln-center m-topic"
            @click="selectedTopic(topic)">
            <span>{{ topic.name }}</span>
            <svg class="m-style-svg m-svg-def">
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#base-clean"/>
            </svg>
          </li>
        </ul>
        <div class="m-box m-aln-center m-flex-grow0 m-shrink0 m-bb1 m-lim-width question-title">
          <svg
            class="m-style-svg m-svg-def"
            style="fill: #ccc; margin-right: 0.3rem">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#base-search"/>
          </svg>
          <input
            v-model="topicKeyWord"
            type="search"
            placeholder="搜索话题"
            @input="inputTopicKeyWord">
          <svg
            v-show="topicKeyWord.length > 0"
            class="m-style-svg m-svg-def"
            style="fill: #ccc; margin-right: 0.3rem"
            @click="topicKeyWord = ''">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#base-clean"/>
          </svg>
        </div>
        <div class="m-flex-grow1 m-flex-shrink1 m-topics">
          <div
            v-for="topic in topics"
            :key="topic.id"
            class="m-box m-aln-center m-topic m-bb1"
            @click="selectedTopic(topic)"
          >
            <img
              :src="topic.avatar"
              class="m-flex-grow0 m-flex-shrink0 m-topic-avatar">
            <section class="m-flex-grow1 m-flex-shrink1 m-box-model m-ovxh">
              <h3>{{ topic.name }}</h3>
              <p>{{ topic.description }}</p>
            </section>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import _ from "lodash";
import { mapGetters } from "vuex";
import bus from "@/bus.js";
import ContentText from "./components/ContentText.vue";

export default {
  name: "PostQuestion",
  components: { ContentText },
  data() {
    return {
      step: 1,

      topics: [],
      questions: [],

      curpos: 0,
      showPlaceholder: true,

      animated: {},

      topicKeyWord: "",
      selectedTops: [],

      question: {
        title: "",
        body: ""
      }
    };
  },
  computed: {
    ...mapGetters(["compose"]),
    title() {
      switch (this.step) {
        case 1:
          return "发布问题";
        case 2:
          return "问题详情";
        case 3:
          return "至少添加一个话题";
        case 4:
          return "悬赏（可跳过）";
        default:
          return "发布问题";
      }
    },
    disabled() {
      switch (this.step) {
        case 1:
          return !this.question.title;
        case 2:
          return !this.question.body;
        case 3:
          return !0;
        case 4:
          return !0;
      }
    }
  },
  watch: {
    step(val) {
      val === 2 &&
        this.$nextTick(() => {
          this.$refs.editor.innerHTML = this.question.body;
        });
      val === 3 && this.getTopics();
    },
    compose(val) {
      this.question.title = val;
    }
  },
  created() {
    const question = this.$lstore.getData("H5_POST_QUESTION_DRAFT");

    question &&
      (question.title || question.body) &&
      Object.assign(this.question, question);
  },
  methods: {
    selectedTopic(topic) {
      const index = this.selectedTops.indexOf(topic);
      index > -1
        ? this.selectedTops.splice(index, 1)
        : this.selectedTops.length > 4
          ? this.$Message.error("添加话题不可以超过5个")
          : this.selectedTops.push(topic);
    },
    serachQuestionByKey: _.debounce(function() {
      // GET /questions subject
      this.$http
        .get("/questions", {
          params: {
            subject: this.compose
          }
        })
        .then(({ data = [] }) => {
          this.questions = data;
        });
    }, 1e3),
    inputTopicKeyWord: _.debounce(function() {
      // GET /question-topics
      if (!this.topicKeyWord) return;
      this.$http
        .get("/question-topics", {
          params: {
            name: this.topicKeyWord
          }
        })
        .then(({ data = [] }) => {
          this.topics = data;
        });
    }, 1000),
    onBlur() {
      this.showPlaceholder = this.question.body.length === 0;
      // this.moveCurPos();
    },
    moveCurPos() {},
    autoFoucs() {
      this.$refs.editor.focus();
      this.showPlaceholder = false;
    },
    setContent(e) {
      const value = e.target.innerText;
      if (value === this.question.body) return;
      this.question.body = value;
      // this.moveCurPos();
    },
    getTopics() {
      // GET /question-topics
      this.$http.get(`/question-topics`).then(({ data = [] }) => {
        this.topics = data;
      });
    },
    preStep() {
      this.step > 1 &&
        ((this.animated = {
          enterClass: "animated slideInLeft",
          leaveClass: "animated slideOutRight"
        }),
        (this.step -= 1));
    },
    nextStep() {
      if (this.disabled) return;
      this.step < 4 &&
        ((this.animated = {
          enterClass: "animated slideInRight",
          leaveClass: "animated slideOutLeft"
        }),
        this.step === 1
          ? this.question.title.endsWith("?") ||
            this.question.title.endsWith("？")
            ? (this.step = 2)
            : this.$Message.error(`输入问题请以"?"结束`)
          : (this.step += 1));
    },
    beforePost() {
      const { body, title } = this.question;
      if (!body) return (this.step = 2), this.$Message.error("请输入问题详情");

      if (!title) return (this.step = 1), this.$Message.error("请输入问题标题");

      if (this.selectedTops.length === 0)
        return (this.step = 3), this.$Message.error("至少选择一个话题");

      this.postQuestion({
        subject: title,
        topics: this.selectedTops,
        body,
        text_body: body
      });
    },
    postQuestion(params) {
      // POST /questions
      this.$http
        .post(`/questions`, params, {
          validateStatus: s => s === 201
        })
        .then(({ data: { message, question } }) => {
          this.$Message.success(message);
          this.$router.push(`/questions/${question.id}`);
          this.$lstore.removeData("H5_POST_QUESTION_DRAFT");
        });
    },
    cancel() {
      this.question.title || this.question.body
        ? bus.$emit(
            "actionSheet",
            [
              {
                style: {
                  color: "#f4504d"
                },
                text: "放弃",
                method: this.goBack
              },
              {
                text: "保存草稿",
                method: () => {
                  this.$lstore.setData("H5_POST_QUESTION_DRAFT", this.question);
                  this.goBack();
                }
              }
            ],
            "取消",
            "你还有未发布的内容，是否放弃发布？"
          )
        : this.goBack();
    }
  }
};
</script>

<style lang="less">
.p-post-question-main {
  > div {
    animation-duration: 0.3s;
  }
  .m-pos-f {
    top: 90px;
  }
  .question-title {
    padding: 0 40px;
    input {
      font-size: 30px;
      line-height: 1.5;
      width: 100%;
    }
  }
  .question-list {
    li {
      border-bottom: 1px solid @border-color; /*no*/
      color: @text-color2;
      font-size: 30px;
      padding: 40px;
    }
  }
  .m-reles-body {
    height: auto;
    margin-bottom: 0;

    textarea {
      font-size: 0.32rem;
      line-height: 1.5;
      overflow: auto;
      margin-top: 0.35rem;
      padding: 0 0.3rem;
      background-color: transparent;
      outline: 0;
      border: 0;
      resize: none;
      width: 100%;
      max-height: 100%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
    }
  }
}
.m-rich-box {
  font-size: 30px;
  width: 100%;
  padding: 40px;
  position: relative;
  .placeholder {
    position: absolute;
    color: #ccc;
  }
}
.m-editor {
  border: 0;
  outline: 0;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-x: hidden;
  overflow-y: auto;
  _overflow-y: visible;
  -webkit-user-modify: read-write-plaintext-only; // 只是编辑text文本，只能解决webkit内核里面问题，手机端适用
  -webkit-user-select: text; // 解决IOS部分手机不支持contenteditable=true属性问题
}

.m-topics {
  overflow-y: auto;
  &.ml {
    margin-left: 15px;
  }
  li.m-topic {
    float: left;
    margin-left: 15px;
    margin-top: 20px;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    border-radius: 25px;
    background-color: rgba(89, 182, 215, 0.2);
    color: @text-color2;
    > .m-svg-def {
      margin-left: 20px;
      width: 32px;
      height: 32px;
      fill: #b2b2b2;
    }
  }
  div.m-topic {
    padding: 30px;
    .m-topic-avatar {
      width: 80px;
      height: 80px;
      background-color: #ccc;
      margin-right: 30px;
    }
    h3 {
      font-size: 30px;
      line-height: 1.5;
    }

    p {
      width: 100%;
      margin-top: 9px;
      overflow: hidden;
      font-size: 24px;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: @text-color3;
    }
  }
}
</style>
