<template>
  <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
    <section v-show="show" :class="$style.postAnswer">
      <header :class="['commonHeader', $style.commonHeader]">
        <Row :gutter="24">
          <Col span="4">
            <Button type="text" @click.natice="close">取消</Button>
          </Col>
          <Col span="16" :class="['title-col', $style.title]">
            添加回答
          </Col>
          <Col span="4" class="header-end-col">
            <Button @click.native="doAnswer" type="text" :disabled="body.length == 0">发布</Button>
          </Col>
        </Row>
      </header>
      <section :class="$style.answerBody">
        <Row :gutter="24" :class="$style.contentRow">
          <Col span="24">
            <textarea ref="answerBody"></textarea>
          </Col>
        </Row>
      </section>
    </section>
  </transition>
</template>
<style lang="less" module>
  .postAnswer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    overflow: hidden;
    background: #fff;
    z-index: 10;
    display: block;
    height: 100%;
    width: 100%;
    .answerBody {
      .contentRow {
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ededed;
        textarea {
          border: none;
          box-shadow: none;
        }
      }
    }
  }
</style>
<script>
  import { mapState } from 'vuex';
  import mdEditor from 'plus-editor.md/dist/pluseditor.min';
  import 'plus-editor.md/dist/pluseditor.css';
  import { SHOWPOSTANSWER } from '../stores/types';
  import { createAPI, addAccessToken } from '../utils/request';
  import fileUpload from '../utils/uploadFile';
  
  const PostAnswer = {
    data: () => ({
      body: '', // 回答内容
      anonymity: 0, // 是否匿名
      editor: {}
    }),
    methods: {
      doAnswer () {
        const { question, body, anonymity } = this;
        if(!body.length) {
          this.$Message.warring({
            content: '请填写回答内容'
          });

          return;
        }
        addAccessToken().post(
          createAPI(`questions/${question}/answers`),
          {
            body,
            anonymity
          },
          {
            validataStatus: status => status === 201
          }
        )
        .then(({ data }) => {
          this.callback();
          this.body = '';
          this.anonymity = 0;
          this.callback();
          this.$store.dispatch(SHOWPOSTANSWER, cb => {
            cb({
              show: false,
              question: 0,
              id: 0
            })
          })
        })
        .catch(({ response: { data } }) => {
          this.$Message.error(this.$MessageBundle(data).getMessage());
        })
      },
      close () {
        this.body = '',
        this.anonymity = 0;
        this.$store.dispatch(SHOWPOSTANSWER, cb => {
          cb({
            show: false,
            question: 0
          })
        })
      },
      listenEditorInput () {
        this.editor.codemirror.on('change', () => {
          this.body = this.editor.value();
        })
      },
    },
    computed: {
      ...mapState({
        show: state => state.showPostAnswer.showPostAnswer.show,
        question: state => state.showPostAnswer.showPostAnswer.question, // 被回答的问题id
        answer_id: state => state.showPostAnswer.showPostAnswer.answer_id,
        callback: state => state.showPostAnswer.showPostAnswer.callback
      })
    },
    mounted () {
      if((_.keys(this.editor).length === 0)) {
        this.editor = new mdEditor({
          element: this.$refs.answerBody,
          placeholder: "请输入你的回答",
          fileApiPath: '/api/v2/files/',
          initialValue: this.body,
          uploadFile (file, callback) {
            fileUpload(file, (id) => {
              callback(id);
            })
          }
        });
        this.listenEditorInput();
      }
    }
  };

  export default PostAnswer;
</script>