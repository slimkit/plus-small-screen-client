<template>
  <section :class="$style.QuestionDetail">
    <!-- Loadding -->
    <div id="spinner" v-if="loading">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
    </div>
    <header class="commonHeader">
      <Row :gutter="24">
        <Col span="5">
          <BackIcon height="21" @click.native="goBack()" width="21" color="#979797" />
        </Col>
        <Col span="14" class="title-col">
          问题详情
        </Col>
      </Row>
    </header>
    <section :class="$style.detail">
      <Row :gutter="24" :class="$style.topics">
        <Col span="24">
          <section :class="$style.topicContainer">
            <Tag @click="$router.push({ name: 'topicDetail', params: { topic_id: topic.id }})" :class="$style.topic" v-for="topic in question.topics" :key="topic.id">{{ topic.name }}</Tag>
          </section>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col span="24">
          <h2 style="padding: 12px 0; color: #323232;">{{question.subject}}</h2>
          <div @click="showAll = true;" v-if="!showAll" :class="$style.someDesc">{{ getContent(question.body || '') }}</div>
          <div v-else @click="showAll = false" :class="$style.allDesc" v-html="getHtml" />
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.watch">
        <Col span="12">
          <span :class="$style.follow">{{ question.watchers_count }} 关注</span>
          <span :class="$style.special" v-if="question.amount"> · <RewardCon color="#FCA92B" height="16" width="16" /><i>{{showAmount(question.amount)}}</i></span>
          <span :class="$style.special" v-if="question.look"> · <LookIcon color="#FCA92B" height="16" width="16" /><i>{{showAmount($storeLocal.get('onlookers_amount'))}}</i></span>
        </Col>
        <Col span="12" class="header-end-col">
          <Button size="small"  class="followAboutButton" v-if="question.watched" @click.native="unFollow()" type="ghost"><RightIcon color="#ccc" width="14" height="14" />已关注</Button>
          <Button class="followAboutButton" size="small" v-else type="ghost" :class="$style.unFollow" @click.native="follow()"><PlusIcon color="#59B6D7" width="14" height="14"/>关注 </Button>
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.answerEntry">
        <Col span="12" class="title-col" v-if="question.amount && question.invitations.length">
          <Poptip placement="bottom" style="display: flex">
            <span class="IconWithText"><RewardIcon height="21" width="21" />已设置悬赏</span>
            <div :class="$style.api" slot="content">
              <img style="width: 8vw; vertical-align: middle; margin-right: 3vw;" v-lazy="question.invitations[0].avatar || defaultAvatar" alt="">{{question.invitations[0].name}}
            </div>
          </Poptip>
        </Col>
        <Col span="12" class="title-col" v-else-if="question.amount">
          <span class="IconWithText"><RewardIcon height="21" width="21" />已设置悬赏</span>
        </Col>
        <Col span="12" class="title-col" v-else>
          <span class="IconWithText"><RewardIcon height="21" width="21" />未设置悬赏</span>
        </Col>
        <Col span="12" :class="['title-col', $style.hasleftborder]">
          <span class="IconWithText" v-if="question.my_answer" @click="$router.push({name: 'AnswerDetail', params: {answer_id: question.my_answer.id}})">
            <AnswerIcon height="21" width="21" color="#646464"/>
            查看回答
          </span>
          <span class="IconWithText" style="" v-else @click="answerQuestion">
            <AnswerIcon height="21" width="21" color="#646464"/>
            添加回答
          </span>
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.order">
        <Col span="12">
          {{question.answers_count}} 个回答
        </Col>
        <Col span="12" class="header-end-col">
          <span v-if="order_type === 'default'">默认排序</span>
          <span v-else>时间排序</span>
          <OrderIcon style="margin-left: 2vw;" height="21" width="21" />
        </Col>
      </Row>
      <section :class="$style.answers" v-if="hasAnswers">
        <div :class="[$style.wrapper, 'wrapper']">
          <mt-loadmore
            :bottom-method="loadMore"
            :top-method="loadNew"
            :bottom-all-loaded="bottomAllLoaded"
            :top-all-loaded="true"
            ref="loadmore"
            :bottomDistance="70"
            @bottom-status-change="bottomStatusChange"
          >
            <section v-if="question.invitation_answers.length" :class="$style.answerContainer" v-for="(invitation_answer, index) in question.invitation_answers" @click="$router.push({name: 'AnswerDetail', params: {answer_id: invitation_answer.id}})">
              <Row :class="$style.answer" @click.native="$router.push({name: 'AnswerDetail', params: {answer_id: invitation_answer.id}})" :gutter="24" :key="invitation_answer.id">
                <Col span="4">
                  <img v-lazy="invitation_answer.user.avatar || defaultAvatar" style="width: 100%" alt="">
                </Col>
                <Col span="20">
                  <div :class="$style.userTime">
                    <section :class="$style.user">
                      <router-link :to="{name: 'userSpace', params: { user_id: invitation_answer.user.id}}">{{invitation_answer.user.name}}</router-link> 
                      <InvitedIcon height="21" width="57" color="#59B6D7" />
                      <AdoptionIcon v-if="invitation_answer.adoption" height="21" width="45" color="#56BC9A" />
                    </section>
                    <timeago 
                      :class="$style.time" 
                      :since="time(invitation_answer.created_at, 8, false)" 
                      locale="zh-CN" 
                      :auto-update="60"
                    />
                  </div>
                  <p 
                    :class="$style.answerBody" 
                    v-html="getContent(invitation_answer.body)"
                  />
                </Col>
              </Row>
              <Row :gutter="24" :class="$style.counts">
                <Col offset="4" span="8" style="display: inline-flex" :class="$style.count">
                  <span v-if="!invitation_answer.liked">
                    <UnDiggIcon 
                      @click.native.stop="diggAnswer(invitation_answer.id, index, 'invitation_answers')" 
                      color="#979797" 
                      height="21" 
                      width="21" 
                    /> 
                    {{invitation_answer.likes_count}}
                  </span>
                  <span v-else>
                    <DiggIcon 
                      @click.native.stop="unDiggAnswer(invitation_answer.id, index, 'invitation_answers')" 
                      color="#f4504d" 
                      height="21" 
                      width="21" 
                    />
                    {{invitation_answer.likes_count}}
                  </span>
                  <span>
                    <CommentIcon color="#979797" height="21" width="21" />
                    {{invitation_answer.comments_count}}
                  </span>
                </Col>
                <Col span="12" v-if="question.look" class="header-end-col">
                  {{invitation_answer.onlookers_count}}人正在围观
                  <Button style="margin-left: 2vw;" size="small" type="primary" v-if="invitation_answer.could">去围观</Button>
                  <Button style="margin-left: 2vw;" size="small" v-else>已围观</Button>
                </Col>
                </Col>
              </Row>
            </section>
            <section v-if="question.adoption_answers.length" :class="$style.answerContainer" v-for="(adoption_answer, index) in question.adoption_answers" @click="$router.push({name: 'AnswerDetail', params: {answer_id: adoption_answer.id}})">
              <Row :class="$style.answer" :gutter="24" :key="adoption_answer.id">
                <Col span="4">
                  <img v-lazy="adoption_answer.user.avatar || defaultAvatar" style="width: 100%" alt="">
                </Col>
                <Col span="20">
                  <div :class="$style.userTime">
                    <section :class="$style.user">
                      <router-link :to="{name: 'userSpace', params: { user_id: adoption_answer.user.id}}">{{adoption_answer.user.name}}</router-link> 
                      <AdoptionIcon height="21" width="auto" color="#56BC9A" />
                    </section>
                    <timeago 
                      :class="$style.time" 
                      :since="time(adoption_answer.created_at, 8, false)" 
                      locale="zh-CN" 
                      :auto-update="60"
                    />
                  </div>
                  <p 
                    :class="$style.answerBody" 
                    v-html="getContent(adoption_answer.body)"
                  />
                </Col>
              </Row>
              <Row :gutter="24" :class="$style.counts">
                <Col offset="4" span="20" style="display: inline-flex" :class="$style.count">
                  <span v-if="!adoption_answer.liked">
                    <UnDiggIcon 
                      @click.native.stop="diggAnswer(adoption_answer.id, index, 'adoption_answers')" 
                      color="#979797" 
                      height="21" 
                      width="21" 
                    /> 
                    {{adoption_answer.likes_count}}
                  </span>
                  <span v-else>
                    <DiggIcon 
                      @click.native.stop="unDiggAnswer(adoption_answer.id, index, 'adoption_answers')" 
                      color="#f4504d" 
                      height="21" 
                      width="21" 
                    />
                    {{adoption_answer.likes_count}}
                  </span>
                  <span>
                    <CommentIcon color="#979797" height="21" width="21" />
                    {{adoption_answer.comments_count}}
                  </span>
                </Col>
              </Row>
            </section>
            <section :class="$style.answerContainer" @click="$router.push({name: 'AnswerDetail', params: {answer_id: answer.id}})" v-for="(answer, index) in answers" :key="answer.id">
              <Row :class="$style.answer" :gutter="24">
                <Col span="4">
                  <img v-lazy="answer.user.avatar || defaultAvatar" style="width: 100%" alt="">
                </Col>
                <Col span="20">
                  <div :class="$style.userTime">
                    <section :class="$style.user">
                      <router-link :to="{name: 'userSpace', params: { user_id: answer.user.id}}">{{answer.user.name}}</router-link>
                    </section>
                    <timeago 
                      :class="$style.time" 
                      :since="time(answer.created_at, 8, false)" 
                      locale="zh-CN" 
                      :auto-update="60"
                    />
                  </div>
                  <p 
                    :class="$style.answerBody" 
                    v-html="getContent(answer.body)"
                  />
                </Col>
              </Row>
              <Row :gutter="24" :class="$style.counts">
                <Col offset="4" span="20" style="display: inline-flex" :class="$style.count">
                  <span v-if="!answer.liked">
                    <UnDiggIcon 
                      @click.native.stop="diggAnswer(answer.id, index, 'answers')" 
                      color="#979797" 
                      height="21" 
                      width="21" 
                    /> 
                    {{answer.likes_count}}
                  </span>
                  <span v-else>
                    <DiggIcon 
                      @click.native.stop="unDiggAnswer(answer.id, index, 'answers')" 
                      color="#f4504d" 
                      height="21" 
                      width="21" 
                    />
                    {{answer.likes_count}}
                  </span>
                  <span>
                    <CommentIcon color="#979797" height="21" width="21" />
                    {{answer.comments_count}}
                  </span>
                </Col>
              </Row>
            </section>
            <div slot="bottom" :class="[$style.mintLoadmoreBottom, 'mint-loadmore-bottom']">
              <span v-if="bottomAllLoaded">没有更多了</span>
              <section v-else>
                <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
                <span v-show="bottomStatus === 'loading'">加载中...</span>
                <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
              </section>
            </div>
          </mt-loadmore>
        </div>
      </section>
      <img v-lazy="noAnswerPic" v-else :class="$style.noAnswerPic" alt="">
    </section>
  </section>
</template>
<style lang="less" module>
  .QuestionDetail {
    .detail {
      background-color: #fff;
      .topics {
        padding-top: 12px;
        .topicContainer {
          padding-bottom: 12px;
          border-bottom: 1px solid #efefef;
          .topic {
            background: #DEF0F7;
            border-radius: 15px;
            padding: 4px 12px;
            border: none;
            font-size: 14px;
            color: #979797;
            height: auto;
            line-height: 1;
          }
        }
      }
      .answers {
        background-color: #f4f5f5;
        .mintLoadmoreBottom {
          margin-bottom: -50px;
        }
        .answerContainer {
          margin-bottom: 6px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .counts {
          padding-top: 12px;
          padding-bottom: 12px;
          background-color: #fff;
          .count {
            span {
              display: inherit;
              margin-right: 3vw;
              svg {
                margin-right: 2vw;
              }
            }
          }
        }
        .answer {
          display: block;
          padding-top: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ededed;
          background-color: #fff;
          &:last-child {
            border-bottom: none;
          }
          .answerBody {
            font-size: 14px;
            color: #5A5A5A;
            text-align: initial;
            overflow: hidden;
            text-overflow: ellipsis;  
            display: -webkit-box;  
            -webkit-line-clamp: 3;  
            -webkit-box-orient: vertical;
            word-break: break-all;
            margin: 4px 0 12px 0;
          }
          .userTime{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .user {
              color: #2b2b2b;
              font-size: 16px;
              display: inline-flex;
              align-items: center;
              svg {
                margin-left: 1vw;
              }
              a {
                color: #2b2b2b;
              }
              i {
                font-size: 12px;
                font-style: normal;
              }
            }
            .time {
              text-align: right;
              color: #C5C5C5;
              font-size: 12px;
            }
          }
        }
      }
      .order {
        padding-top: 12px;
        padding-bottom: 12px;
        background-color: #F4F5F5;
        color: #999999;
      }
      .answerEntry {
        color: #656565;
        padding-top: 12px;
        padding-bottom: 12px;
        .api {
          text-align: center;
        }
        .hasleftborder {
          border-left: 1px solid #efefef;
        }
      }
      .watch {
        font-size: 14px;
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #efefef;
        .follow {
          color: #979797;
        }
        .special {
          display: inline-flex;
          align-items: center;
          i {
            color: #FCA92B;
            font-style: normal;
          }
          svg {
            margin-left: 1vw;
            margin-right: 1vw;
          }
        }
        .unFollow {
          border: 1px solid #59b6d7;
          color: #59b6d7;
        }
      }
      h2 {
        font-weight: 500;
      }
      div {
        &.allDesc {
          color: #6B6B6B;
          word-break: break-all;
          display: -webkit-box; 
          -webkit-box-orient: vertical;
          img {
            width: 100%;
          }
        }
        &.someDesc {
          color: #6B6B6B;
          word-break: break-all;
          display: -webkit-box; 
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;  
          -webkit-line-clamp: 3;  
        }
      }
    }
  }
</style>
<script>
  import { SHOWPOSTANSWER } from '../../stores/types';
  import BackIcon from '../../icons/Back';
  import time from '../../utils/timer';
  import getContent from '../../utils/getPureContent';
  import _ from 'lodash';
  import { createAPI, addAccessToken } from '../../utils/request';
  import { showAmount, trueAmount } from '../../utils/balance';
  import { resolveImage } from '../../utils/resource';
  import markdownIt from 'markdown-it';
  import plusImageSyntax from 'markdown-it-plus-image';
  import hljs from 'highlight.js';
  import DiggIcon from '../../icons/Digg';
  import UnDiggIcon from '../../icons/UnDigg';
  import CommentIcon from '../../icons/Comment';
  import OrderIcon from '../../icons/Order';
  import RewardIcon from '../../icons/Reward';
  import AnswerIcon from '../../icons/Answer';
  import LookIcon from '../../icons/Look';
  import RewardCon from '../../icons/RewardCon';
  import RightIcon from '../../icons/Right';
  import AdoptionIcon from '../../icons/Adoption';
  import InvitedIcon from '../../icons/Invited';
  import PlusIcon from '../../icons/Plus';
  // 引入样式库
  import "github-markdown-css";
  import 'highlight.js/styles/github.css';

  const defaultAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));
  // markdown 解析
  const md = markdownIt({
    breaks: true,
    html: false,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }
   
      try {
        return hljs.highlightAuto(str).value;
      } catch (__) {}
   
      return ''; // use external default escaping 
    }
  }).use(plusImageSyntax, `/api/v2/files/`);

  const QuestionDetail = {
    components: {
      BackIcon,
      CommentIcon,
      DiggIcon,
      OrderIcon,
      UnDiggIcon,
      RewardIcon,
      AnswerIcon,
      LookIcon,
      RewardCon,
      RightIcon,
      AdoptionIcon,
      InvitedIcon,
      PlusIcon
    },
    data: () => ({
      loading: false,
      showAll: false,
      question: {
        id: 0
      },
      defaultAvatar,
      order_type: 'default',
      bottomAllLoaded: true,
      bottomStatus: '',
      topStatus: '',
      answers: [],
      limit: 20,
      locked: false
    }),
    methods: {
      time,
      showAmount,
      trueAmount,
      goBack() {
        if(window.history.length < 2) {
          this.$router.push('/questions/questions/hot');
          return;
        }
        this.$router.back();
      },
      unDiggAnswer (id, index, data) {
        const { locked } = this;
        let answers = []
        if(data !== 'answers') {
          answers = this.question[data];
        } else {
          answers = this[data];
        }
        
        if(locked) return;
        addAccessToken().delete(
          createAPI(`question-answers/${id}/likes`),
          {
            validataStatus: status => status === 204
          }
        )
        .then( () => {
          answers[index].liked = false;
          answers[index].likes_count -= 1;
          if(data !== 'answers') {
            this.question[data] = answers;
          } else {
            this[data] = answers;
          }
          this.locked = false;
        })
        // .catch(({ response: { data }}) => {
        //   this.locked = false;
        // });
      },

      diggAnswer (id, index, data) {
        const { locked } = this;
        let answers = []
        if(data !== 'answers') {
          answers = this.question[data];
        } else {
          answers = this[data];
        }
        if(locked) return;
        addAccessToken().post(
          createAPI(`question-answers/${id}/likes`),
          {
            validataStatus: status => status === 201
          }
        )
        .then( () => {
          answers[index].liked = true;
          answers[index].likes_count += 1;
          if(data !== 'answers') {
            this.question[data] = answers;
          } else {
            this[data] = answers;
          }
          this.locked = false;
        })
        // .catch(({ response: { data }}) => {
        //   this.locked = false;
        // });
      },
      /**
       * 打开回答界面
       * @return {[type]} [description]
       */
      answerQuestion () {
        const { id: question } = this.question;
        this.$store.dispatch(SHOWPOSTANSWER, cb => {
          cb({
            show: true,
            question
          })
        })
      },
      loadMore() {
        this.getAnswers('loadMore');
      },
      loadNew () {
        this.getAnswers('loadNew');
      },

      bottomStatusChange (status) {
        this.bottomStatus = status;
      },
      unFollow () {
        addAccessToken().delete(
          createAPI(`user/question-watches/${this.question.id}`),
          {
            validataStatus: status => status === 204
          }
        )
        .then ( () => {
          this.question.watched = false
          this.question.watchers_count -= 1;
        })
      },

      follow () {
        addAccessToken().put(
          createAPI(`user/question-watches/${this.question.id}`),
          {
            validataStatus: status => status === 204
          }
        )
        .then ( () => {
          this.question.watched = true
          this.question.watchers_count += 1;
        })
      },
      getContent,
      getQuestion () {
        addAccessToken().get(
          createAPI(`questions/${this.question.id}`),
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          this.question = {...data};
          this.loading = false;
        })
        .catch(({ response: { data } }) => {
          console.log(data);
        })
      },

      getAnswers (type = 'new') {
        if (type === 'loadMore' && this.bottomAllLoaded) return;
        const { limit, answers: { length }, question: { id }, order_type } = this;
        let params = {
          limit,
          order_type
        }
        if(type === 'loadMore') {
          params.offset = length;
        }
        addAccessToken().get(
          createAPI(`questions/${id}/answers`),
          {
            ...params
          },
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          const { length: dataLength } = data;
          if(type === 'new') {
            this.answers = data;
            if ( dataLength === limit ) {
              this.bottomAllLoaded = false;
            } else {
              this.bottomAllLoaded = true;
            }

            return;
          }

          if(type === 'loadNew') {
            this.answers = _.uniqBy([
              ...data,
              ...this.answers
            ], 'id');
            this.$refs.loadmore.onTopLoaded();
            return;
          }

          if(type === 'loadMore') {
            this.answers = [
              ...this.answers,
              ...data
            ]

            if(dataLength === limit) {
              this.bottomAllLoaded = false;
            } else {
              this. bottomAllLoaded = true;
            }

            this.$refs.loadmore.onBottomLoaded();
            return;
          }
        })
      }
    },
    computed: {
      getHtml() {
        const { body = '' } = this.question;
        return md.render(body);
      },
      body () {
        const { body = '' } = this.question;
        return body;
      },
      hasAnswers () {
        const { answers_count } = this;
        return answers_count !== 0;
      }
    },
    
    created () {
      this.question.id = this.$route.params.question_id || 0;
    },

    beforeMount() {
      this.loading = true;
      this.getQuestion();
      this.getAnswers();
    }
  };

  export default QuestionDetail;
</script>