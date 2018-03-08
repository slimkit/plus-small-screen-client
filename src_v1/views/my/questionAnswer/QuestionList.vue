<template>
  <div :class="$style.listRoot">
    <!-- Loadding -->
    <div id="spinner" v-if="loading">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
    </div>
    <!-- Question not empty. -->
    <!-- 因为 for 和 if 是同级运行且 for 优先级高于 if，官方推荐使用 template 做 if。 -->
    <template v-else-if="! empty">
      <div :class="[$style.wrapper, 'wrapper']">
        <mt-loadmore
          :bottom-method="loadBottom"
          :top-method="loadTop"
          :bottom-all-loaded="bottomAllLoaded"
          :top-all-loaded="true"
          ref="loadmore"
          :bottomDistance="70"
          @bottom-status-change="bottomStatusChange"
          @top-status-change="topStatusChange"
        >
          <section 
            v-for="question in questions" :key="question.id"
            :class="$style.question"
            @click="$router.push({name: 'questionDetail', params: {question_id: question.id}})"
          >
            <h3>{{ question.subject }} <ExcellentIcon v-if="question.excellent" width="21" height="21" color="#FCB02B" /></h3>
            <img :class="$style.answerImg" v-if="question.answer && getFile(question.answer.body)" v-lazy="getFile(question.answer.body)" />
            <Row :gutter="24" v-if="question.answer">
              <Col span="24">
                <section :class="$style.answerBody">
                  <div v-if="question.answer.anonymity" :class="$style.nobody">
                    <span>匿</span>
                    <i>匿名用户：</i>
                  </div>
                  <div v-else :clas="$style.anybody">
                    <img v-lazy="question.answer.user.avatar || defaultAvatar" :alt="question.answer.user.name">
                    <i>{{ question.answer.user.name }}：</i>
                  </div>
                  <span>{{ answerBody(getPureContent(question.answer.body)) }}</span>
                </section>
              </Col>
            </Row>
            <Row :gutter="24" :class="$style.tool">
              <Col span="16">
                <span>{{question.watchers_count}}</span> 关注 · <span>{{ question.answers_count }}</span> 回答
                <span :class="$style.special" v-if="question.amount"> · <RewardCon color="#FCA92B" height="14" width="14" /><i>{{showAmount(question.amount)}}</i></span>
              </Col>
              <Col span="8" class="header-end-col">
                <timeago 
                  :since="timer(question.created_at, 8, false)" 
                  locale="zh-CN" 
                  :auto-update="60"
                />
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
    </template>

    <!-- Question is empty. -->
    <img v-else style="width: 80vw; left: 10vw;  position: fixed; top: 30vh;" :src="nothingImage" alt="" />
  </div>
</template>
<style lang="less" module>
  .listRoot {
    background-color: #f4f5f5;
    height: 100%;
    .wrapper {
      height: 100%;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      .mintLoadmoreBottom {
        margin-bottom: -50px;
      }
      .question {
        padding-top: 12px;
        padding-bottom: 12px;
        margin-top: 6px;
        background-color: #fff;
        section:first-child {
          margin-top: 0;
        }
        h3 {
          padding: 8px 12px;
          font-weight: 500;
          display: flex;
          svg {
            margin-left: 2vw;
          }
        }
        .answerImg {
          width: 100vw;
        }
        
        .answerBody {
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;  
          display: -webkit-box;  
          -webkit-line-clamp: 3;  
          -webkit-box-orient: vertical;
          word-break: break-all;
          font-size: 14px;
          div {
            justify-content: center;
            align-items: center;
            &:first-child {
              display: inline-block;
            }
            &:last-child {
              display: inline;
            }
            i {
              font-style: normal;
              padding-left: 2vw;
            }
            img {
                width: 6vw;
                height: 6vw;
                vertical-align: middle;
            }
          }
          
        }
        .tool {
          padding-top: 12px;
          color: #bfbfbf;
          font-size: 14spx;
          span {
            color: #59b6d7;
            &.special {
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
          }
        }
      }
    }
    
  }
</style>
<style lang="less" scoped>
  .wrapper {
    .mint-loadmore {
      min-height: 100%;
    }
  }
</style>
<script>
  import _ from 'lodash';
  import { createAPI, addAccessToken } from '../../../utils/request';
  import { resolveImage } from '../../../utils/resource';
  import getPureContent from '../../../utils/getPureContent';
  import timer from '../../../utils/timer';
  import ExcellentIcon from '../../../icons/Excellent';
  import RewardCon from '../../../icons/RewardCon';
  import { showAmount } from '../../../utils/balance';
  import markdownIt from 'markdown-it';
  import plusImageSyntax from 'markdown-it-plus-image';
  import hljs from 'highlight.js';
  import "github-markdown-css";
  import 'highlight.js/styles/github.css';

  const defaultAvatar = resolveImage(require('../../../statics/images/defaultAvatarx2.png'));
  const nothingImage = resolveImage(require('../../../statics/images/defaultNothingx2.png'));
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
  
  const QuestionListComponent = {
    components: {
      ExcellentIcon,
      RewardCon
    },
    data: () => ({
      questions: [],
      defaultAvatar,
      limit: 10,
      nothingImage,
      loading: false,
      bottomAllLoaded: false,
      bottomStatus: '',
      topStatus: ''
    }),
    methods: {
      timer,
      showAmount,
      getPureContent,
      getPureText (str) {
        return ( (md.render(str)).replace(/<\/?.+?>/g,"") ).replace(/ /g,"");
      },
      topStatusChange (status) {
        this.topStatus = status;
      },
      /**
       * 底部状态变化
       * @param  {[type]} status [description]
       * @return {[type]}        [description]
       */
      bottomStatusChange (status) {
        this.bottomStatus = status;
      },
      answerBody (body) {
        if (body === '') return '';
        return this.getPureText(body);
      },
      getFile (str) {
        if(!str) return 0;
        let file = str.match(/@!\[.*?]\((\d+)\)/);
        return file ? createAPI(`files/${file[1]}`) : 0;
      },
      /**
       * 加载数据
       * @param  {Boolean} type [true加载更新，false刷新当前页面]
       */
      loadData (action='') {
        const { type, limit, questions: { length = 0 } } = this;
        let params = { type, limit};
        if (action == 'load') {
          params.after =  this.questions[length-1].id;
        }
        addAccessToken().get(
          createAPI(`user/questions`),{ params },
          { validataStatus: status => status === 200 }
        ).then(({ data }) => {

          this.loading = false;
          let items = [...data, ...this.questions];

          if (this.limit > data.length) {
            this.bottomAllLoaded = true;
          }

          if (!action || action == 'refresh') {
            this.questions = _.uniqBy(items, 'id');
            if (action == 'refresh') {
              this.$refs.loadmore.onTopLoaded();
            }
          } else {
            this.questions = items;
            this.$refs.loadmore.onBottomLoaded();
          }

        })
      },
      /**
       * 加载更多数据
       * @return {[type]} [description]
       */
      loadBottom () {
        this.loadData('load');
      },
      /**
       * 重新加载刷新当前页
       * @return {[type]} [description]
       */
      loadTop () {
        this.loadData('refresh');
      }
    },
    watch: {
      '$route': function (route) {
        this.questions = [];
        this.loading = true;
        this.loadData();
      }
    },
    computed: {
      type () {
        this.questions = [];
        return  this.$route.params.type || 'all';
      },
      /**
       * The question is emoty.
       * @return {Boolean}
       */
      empty () {
        const { length } = this.questions;
        return ! length;
      }
    },
    mounted () {
      this.loading = true;
      this.loadData();
    }
  };

  export default QuestionListComponent;
</script>