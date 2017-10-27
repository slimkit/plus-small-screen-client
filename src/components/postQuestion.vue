<template>
  <transition-group name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
    <div :class="$style.postRoot" v-show="show" key="root">
      <transition :key="step" name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
        <section :class="$style.stepOne" v-show="step=== 1">
          <header class="commonHeader">
            <Row :gutter="24">
              <Col span="5">
                <Button :class="$style.actionBtn" type="text" @click="closePost">取消</Button>
              </Col>
              <Col span="14" class="title-col">
                发布问题
              </Col>
              <Col span="5" class="header-end-col">
                <Button :disabled="!nextStepOne" @click.native="setStep(2)" type="text">下一步</Button>
              </Col>
            </Row>
          </header>
          <section>
            <Row :gutter="24" :class="$style.titleRow">
              <Col span="24">
                <input type="text" v-focus :class="$style.title" v-model.trim="subject" placeholder="请输入问题并以问号结尾" />
              </Col>
            </Row>
            <ExistsQuestions :title="subject" />
          </section>
        </section>
      </transition>
      <transition :key="step" name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
        <section :class="$style.stepTwo" v-show="step === 2">
          <header class="commonHeader">
            <Row :gutter="24">
              <Col span="5">
                <BackIcon height="21" width="21" color="#bfbfbf" @click.native="setStep(1)"/>
              </Col>
              <Col span="14" class="title-col">
                问题详情
              </Col>
              <Col span="5" class="header-end-col">
                <Button :disabled="!nextStepTwo" @click.native="setStep(3)" type="text">下一步</Button>
              </Col>
            </Row>
          </header>
          <section>
            <Row :gutter="24" :class="$style.contentRow">
              <Col span="24">
                <!-- <Input
                  v-model="body"
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 16}"
                  :class="$style.content"
                  placeholder="详细描述你的问题，有助于收到准确的回答"
                  v-childfocus
                >
                </Input> -->
                <textarea ref="questionBody"></textarea>
              </Col>
            </Row>
          </section>
          <section :class="$style.toolBar">
            <Row :gutter="24" :class="$style.contentAction">
              <Col span="4">
                <DownArrowIcon height="21" width="21" color="#bfbfbf" />
              </Col>
              <Col span="20" class="header-end-col">
                <Upload
                  :class="$style.upload"
                  :action="action"
                  :show-upload-list="false"
                  :headers="headers"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                >
                    <DownArrowIcon height="21" width="21" color="#bfbfbf" />
                </Upload>
                <Poptip
                  :class="$style.poptip"
                  confirm
                  :title="anonymity ? '确定取消匿名发布吗?' : '确定设置匿名发布吗'"
                  @on-ok="setAnonymity(anonymity)"
                  placement="left-end"
                >
                  <DownArrowIcon style="margin-left: 16px;" height="21" width="21" :color="anonymity ? '#59b6d7' : '#bfbfbf'" />
                </Poptip>
              </Col>
            </Row>
          </section>
        </section>
      </transition>
      <transition :key="step" name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
        <section :class="$style.stepThree" v-show="step === 3">
          <header class="commonHeader">
            <Row :gutter="24">
              <Col span="5">
                <BackIcon height="21" width="21" color="#bfbfbf" @click.native="setStep(2)"/>
              </Col>
              <Col span="14" class="title-col">
                所属话题,至少一个
              </Col>
              <Col span="5" class="header-end-col">
                <Button :disabled="!nextStepThree" @click.native="setStep(4)" type="text">下一步</Button>
              </Col>
            </Row>
          </header>
          <section :class="$style.topicList" v-if="topics.length">
            <Tag :class="$style.topic" closable color="blue" v-for="(topic, index) in topics"  @on-close="deleteTopic(topic.id)" :key="index">{{ topic.name }}</Tag>
          </section>
          <section>
            <Row :gutter="24" :class="$style.topicSearchRow">
              <Col span="24">
                <Input
                  v-model="searhTopic"
                  type="text"
                  placeholder="搜索话题"
                  :class="$style.searchKey"
                >
                  <span slot="prepend">
                    <SearchIcon height="21" width="21" color="#bfbfbf" />
                  </span>
                </Input>
              </Col>
            </Row>
          </section>
          <Topics :search="searhTopic" v-on:selectTopic="selectTopic"/>
        </section>
      </transition>
      <transition :key="step" name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
        <section :class="$style.stepFour" v-show="step === 4">
          <header class="commonHeader">
            <Row :gutter="24">
              <Col span="5">
                <BackIcon height="21" width="21" color="#bfbfbf" @click.native="setStep(3)"/>
              </Col>
              <Col span="14" class="title-col">
                悬赏(可跳过)
              </Col>
              <Col span="5" class="header-end-col">
                <Button type="text" @click.native="resetAmount">重置</Button>
              </Col>
            </Row>
          </header>
          <section :class="$style.setAmount" v-if="topics.length">
            <Row :gutter="24" :class="$style.RowLide">
              <Col span="24">
                <p style="color: #ccc">设置悬赏</p>
              </Col>
            </Row>
            <Row :gutter="24" :class="$style.RowLide" style="border-bottom: 1px solid #e9eaec; padding-bottom: 16px; padding-top: 0;">
              <Col span="8">
                <Button
                  @click.native="setAmount(trueAmount(1))"
                  :class="['ivu-btn', 'ivu-btn-ghost', {active: showAmount(amount) == 1 && customAmount === ''}, $style.button]"
                >
                  1
                </Button>
              </Col>
              <Col span="8">
                <Button
                  @click.native="setAmount(trueAmount(5))"
                  :class="['ivu-btn', 'ivu-btn-ghost', {active: showAmount(amount) == 5 && customAmount === ''}, $style.button]"
                >
                  5
                </Button>
              </Col>
              <Col span="8">
                <Button
                  @click.native="setAmount(trueAmount(10))"
                  :class="['ivu-btn', 'ivu-btn-ghost', {active: showAmount(amount) == 10 && customAmount === ''}, $style.button]"
                >
                  10
                </Button>
              </Col>
            </Row>
            <Row :gutter="24" :class="$style.RowLide" type="flex" justify="space-around" style="padding-top: 8px; font-size: 14px;">
              <Col span="12" :class="$style.textAlignLeft">
                <label for="account">自定义{{goldName}}数量</label>
              </Col>
              <Col span="12"  :class="$style.textAlignRight">
                <input type="number" dir="rtl" :class="$style.balanceInput" autocomplete="off" :placeholder="`输入${goldName}数量`" v-model.number="customAmount" />
              </Col>
            </Row>
          </section>
          <section :class="$style.setReward">
            <Row :gutter="24" :class="$style.rewardRow">
              <Col span="12">
                悬赏邀请
              </Col>
              <Col span="12" class="header-end-col">
                <Switch v-model="rewardOpen" @on-change="setReward"></Switch>
              </Col>
            </Row>
            <Row v-if="rewardOpen" :gutter="24" :class="$style.rewardRow" @click.native="setExpertsOpen">
              <Col span="12">
                邀请
              </Col>
              <Col span="12" class="header-end-col">
                {{invitation_name}}<RightArrowIcon height="21" width="21" color="#bfbfbf" />
              </Col>
            </Row>
            <Row v-if="rewardOpen" :gutter="24" :class="$style.rewardRow">
              <Col span="12">
                围观
              </Col>
              <Col span="12" class="header-end-col">
                <Switch v-model="look" @on-change="setLook"></Switch>
              </Col>
            </Row>
          </section>
          <Experts v-if="expertsOpen" :open="expertsOpen" v-on:selectExpert="setExpertsClose" :topics="topics"/>
          <Row :gutter="24" :class="$style.rewardRuleEntry">
            <Col span="24">
              <Button type="text">悬赏规则</Button>
            </Col>
          </Row>
          <Row :gutter="24" :class="$style.publish">
            <Col span="24">
              <Button :disabled="!canPublish" @click="publish" type="primary" long size="large">发布</Button>
            </Col>
          </Row>
        </section>
      </transition>
    </div>
  </transition-group>
</template>
<style lang="less" module>
  .postRoot {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    overflow: hidden;
    background: #efefef;
    z-index: 10;
    display: block;
    height: 100%;
    width: 100%;
    .stepOne {
      background-color: #fff;
      .titleRow {
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ededed;
        .title {
          width: 100%;
        }
      }
    }
    .stepTwo {
      background-color: #fff;
      height: 100%;
      .contentRow {
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ededed;
        .content {
          border: none;
          textarea {
            border: none;
            box-shadow: none;
          }
        }
      }
      .toolBar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        padding-bottom: 12px;
        padding-top: 12px;
        border-bottom: 1px solid #ededed;
        border-top: 1px solid #ededed;
        height: 47px;
        .contentAction {
          .upload {
            div {
              display: block;
            }
          }
          .poptip {
            div {
              display: block;
            }
          }
        }
      }
    }
    .stepThree {
      background-color: #fff;
      .topicList {
        padding: 12px 12px 0 12px;
        .topic {
          background-color: #59b6e7;
          font-size: 16px;
          border-radius: 15px;
        }
      }
      .topicSearchRow {
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ededed;
        .searchKey {
          border: none;
          div {
            border: none;
            background-color: #fff;
          }
          input {
            border: none;
            font-size: 16px;
            &:focus, &:hover{
              border: none;
              outline: 0;
              box-shadow: none;
            }
          }
        }
      }
    }
    .stepFour {
      .setAmount {
        background-color: #fff;
        .RowLide {
          padding-top: 12px;
          padding-bottom: 12px;
          .button {
            width: 100%;
          }
          &:last-child {
            border-bottom: 1px solid #ededed;
          }
        }
        .textAlignLeft {
          text-align: left;
        }
        .balanceInput {
          width: 100%;
        }
      }
      .setReward {
        background-color: #fff;
        margin-top: 12px;
        background-color: #fff;
        .rewardRow {
          padding-top: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #efefef;
          &:last-child {
            border-bottom: none;
          }
        }
      }
      .rewardRuleEntry {
        margin-top: 12px;
        button {
          background: none;
        }
      }
      .publish {
        margin-top: 12px;
      }
    }
  }
</style>
<script>
  import _ from 'lodash';
  import mdEditor from 'plus-editor.md';
  import 'plus-editor.md/dist/pluseditor.css';
  import { showAmount, trueAmount } from '../utils/balance';
  import { mapState } from 'vuex';
  import { SHOWQUESTIONPOST } from '../stores/types';
  import BackIcon from '../icons/Back';
  import DownArrowIcon from '../icons/DownArrow';
  import SearchIcon from '../icons/Search';
  import ExistsQuestions from '../views/question/ExistsQuestions';
  import Topics from '../views/question/Topics';
  import { createAPI, addAccessToken, createRequestURI } from '../utils/request';
  import storeLocal from 'store';
  import RightArrowIcon from '../icons/RightArrow';
  import Experts from '../views/question/Experts';
  
  const { token = ''} = storeLocal.get('UserLoginInfo') || {};
  const postQuestion = {
    components: {
      BackIcon,
      ExistsQuestions,
      DownArrowIcon,
      SearchIcon,
      Topics,
      RightArrowIcon,
      Experts
    },
    data: () => ({
      goldName: window.TS_WEB.goldName,
      searhTopic: '',
      step: 1,
      subject: '',
      body: '',
      anonymity: 0,
      amount: 0,
      look: 0,
      invitations: [],
      invitation_name: '',
      automaticity: 0,
      topics: [],
      customAmount: '',
      rewardOpen: false,
      expertsOpen: false,
      action: createAPI('files'),
      headers: {
        Authorization: `Bearer ${token}`
      },
      editor: {}
    }),
    watch: {
      customAmount: function (amount) {
        this.customAmount = amount;
        this.amount = 0;
      },
    },
    methods: {
      showAmount,
      trueAmount,
      listenEditorInput () {
        this.editor.codemirror.on('change', () => {
          this.body = this.editor.value();
        })
      },
      publish () {
        const { rewardOpen, subject, body, topics, amount, customAmount, invitations, automaticity, look, anonymity } = this;
        let data = {};
        if (rewardOpen) {
          data.invitations = invitations;
          if (look) {
            data.look = true;
          }

          data.automaticity = automaticity;
        }

        if (amount) {
          data.amount = amount;
        }

        if (customAmount) {
          data.amount = trueAmount(customAmount);
        }

        data.anonymity = anonymity;
        data.subject = subject;
        data.body = body;
        data.topics = topics.map( topic => {
          return {
            id: topic.id
          }
        });

        addAccessToken().post(
          createAPI('questions'),
          {
            ...data
          },
          {
            validataStatus: status => status === 201
          }
        )
        .then(({ data: { question: {  id } = {} } }) => {
          this.$Message.success({
            content: '发布成功',
            duration: 2
          });
          this.$store.dispatch(SHOWQUESTIONPOST, cb => {
           cb(false);
          })
          setTimeout( () => {
            this.$router.push(`/questions/${id}/detail`);
          }, 1000);
        })
        .catch(({ response: { data } }) => {
          console.log(data);
        })
      },
      setExpertsOpen () {
        console.log('xxcv');
        this.expertsOpen = true;
      },
      setExpertsClose (user) {
        setTimeout( () => {
          document.body.style.overflow = 'hidden';
        }, 300);
        if (_.keys(user).length) {
          this.invitation_name = user.name;
          this.invitations = [
            {
              "user": user.id
            }
          ]
        }
        this.expertsOpen = false;
      },
      setReward (status) {
        this.rewardOpen = status;
        if (!status) {
          this.look = false; // 关闭围观
          this.invitations = []; // 关闭邀请
          this.invitation_name = '';
          this.automaticity = false;
        }
        if(status) {
          this.automaticity = true;
        }
      },
      setLook(status) {
        this.look = status;
      },
      setAmount (amount) {
        this.customAmount = '';
        this.amount = amount;
      },
      /**
       * 选中话题
       * @param  {[type]} topic [description]
       * @return {[type]}       [description]
       */
      selectTopic (topic) {
        const { topics } = this;
        if(_.findIndex(topics, t => {
          return t.id === topic.id
        }) !== -1) {
          this.$Message.info({
            content: '已经添加过该话题了',
            duratioin: 3
          });

          return;
        }

        this.topics.unshift({
          id: topic.id,
          name: topic.name
        });
      },
      /**
       * 删除被选中的话题
       * @return {[type]} [description]
       */
      deleteTopic(id) {
        console.log(id);
        let topics = this.topics;
        let newTopics = _.remove(topics, topic => {
          return topic.id !== id;
        });

        this.topics = newTopics;
      },
      handleSuccess (response, file, fileList) {
        console.log(response);
      },
      handleError (error, file, fileList) {
        console.log(error);
      },
      /**
       * 设置/取消匿名发布
       * @param {[type]} anonymity [description]
       */
      setAnonymity (anonymity) {
        setTimeout( () => { 
          this.anonymity = anonymity ? 0 : 1;
        }, 500);
      },

      resetAmount () {
        this.amount = 0;
        this.customAmount = '';
        this.rewardOpen = false;
        this.invitations = [];
        this.anonymity = false;
        this.look = false;
        this.invitation_name = '';
      },
      /**
       * 关闭发布框，重置状态
       * @return {[type]} [description]
       */
      closePost() {
        this.step = 1;
        this.subject = '';
        this.body = '';
        this.topics = [];
        this.amount = 0;
        this.invitations = [];
        this.automaticity = 0;
        this.searhTopic = '';
        this.anonymity = 0;
        this.look = 0;
        this.customAmount = '';
        this.invitation_name = '';
        this.rewardOpen = false;
        this.$store.dispatch(SHOWQUESTIONPOST, cb => {
          cb(false);
        });
      },
      setStep(step) {
        this.step = step;
      }
    },
    computed: {
      ...mapState({
        show: state => state.showQuestionPost.showQuestionPost.show,
      }),
      nextStepOne () {
        return (this.subject.length > 0 && (_.last(this.subject) === '?' || _.last(this.subject) === '？'));
      },
      nextStepTwo () {
        return this.body.length > 0;
      },
      nextStepThree () {
        return this.topics.length > 0;
      },
      canPublish () {
        if (this.rewardOpen) {
          return (
            (this.amount !== 0 || this.customAmount !== '') && 
            this.subject && 
            this.body && 
            this.topics.length > 0 && 
            this.invitations.length > 0 && 
            this.automaticity
          );
        }

        return (
          this.subject && 
          this.body && 
          this.topics.length > 0
        );
      }
    },
    mounted () {
      if (_.keys(this.editor).length === 0) {
        this.editor = new mdEditor({
          element: this.$refs.questionBody,
          placeholder: "详细描述你的问题，有助于收到准确的回答",
          fileApiPath: '/api/v2/files',
          initialValue: this.body
        });
        this.listenEditorInput();
      }
    }
  };

  export default postQuestion;
</script>