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
          :bottom-method="loadMore"
          :top-method="loadNew"
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
          >
            <h3>{{ question.subject }}</h3>
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
                  {{ getContent(question.answer.body) }}
                </section>
              </Col>
            </Row>
            <Row :gutter="24" :class="$style.tool">
              <Col span="16">
                <span>{{question.watchers_count}}</span> 关注 · <span>{{ question.answers_count }}</span> 回答
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
    <img v-else style="width: 80vw; left: 10vw;  position: fixed; top: 30vh;" v-lazy="nothingImage" alt="" />
  </div>
</template>
<style lang="less" module>
  .listRoot {
    background-color: #f4f5f5;
    .wrapper {
      height: calc(~"100vh - 109px");
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
          font-size: 16px;
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
          font-size: 16px;
          span {
            color: #59b6d7;
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
  import { createAPI, addAccessToken } from '../../utils/request';
  import { resolveImage } from '../../utils/resource';
  import timer from '../../utils/timer';
  const defaultAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));
  const nothingImage = resolveImage(require('../../statics/images/defaultNothingx2.png'));
  
  const QuestionListComponent = {
    data: () => ({
      type: 'hot',
      questions: [],
      defaultAvatar,
      limit: 20,
      nothingImage,
      loading: false,
      bottomAllLoaded: true,
      bottomStatus: '',
      topStatus: ''
    }),
    methods: {
      timer,
      topStatusChange (status) {
        this.topStatus = status;
      },
      /**
       * 底部加载更多
       * @return {[type]} [description]
       */
      loadMore () {
        if(this.bottomAllLoaded) return;
        this.getQuestions('loadMore')
      },

      /**
       * 顶部下拉刷新
       * @return {[type]} [description]
       */
      loadNew () {
        this.getQuestions('loadNew');
      },
      /**
       * 底部状态变化
       * @param  {[type]} status [description]
       * @return {[type]}        [description]
       */
      bottomStatusChange (status) {
        this.bottomStatus = status;
      },
      /**
       * 获取问题列表
       * @return {[type]} [description]
       */
      getQuestions (loadtype = 'new') {
        const { type, limit, questions: { length = 0 } } = this;
        let params = {
          type,
          limit
        }
        if(loadtype === 'loadMore') {
          params.offset = length;
        }
        addAccessToken().get(
          createAPI(`questions`),
          {
            params
          },
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          if(loadtype === 'new' ) {
            this.questions = data;
            this.loading = false;
            if(data.length === limit) {
              this.bottomAllLoaded = false;
            }

            return;
          }

          if(loadtype === 'loadNew') {
            this.questions = _.uniqBy([
              ...data,
              ...this.questions
            ], 'id');
            this.$refs.loadmore.onTopLoaded();
            return;
          }

          if(loadtype === 'loadMore') {
            this.questions = [
              ...this.questions,
              ...data
            ];
            if(data.length === limit) {
              this.bottomAllLoaded = false;
            }
            if(data.length < limit) {
              this.bottomAllLoaded = true;
            }
            this.$refs.loadmore.onBottomLoaded();

            return;
          }
        });
      },
      getFile (str) {
        let file = str.match(/@!\[.*?]\((\d+)\)/);
        return file ? createAPI(`files/${file[1]}`) : 0;
      },
      getContent (str) {
        let content = str.replace(/@!\[.*?]\((\d+)\)/, "[图片]");
        return content
      }
    },
    watch: {
      '$route': function (route) {
        this.type = route.params.type;
        this.loading = true;
        this.getQuestions();
      }
    },
    computed: {
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
      this.type = this.$route.params.type || 'hot';
      this.loading = true;
      this.getQuestions();
    }
  };

  export default QuestionListComponent;
</script>