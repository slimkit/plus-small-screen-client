<template>
  <section :class="[$style.root, 'questionSearch']">
    <div class="commonHeader">
      <Row :gutter="24">
        <Col span="20">
          <Input v-model.trim="key">
            <span slot="prepend">
              <SearchIcon height="20" width="20" color="#bfbfbf" />
            </span>
          </Input>
        </Col>
        <Col span="4">
          <Button type="text" @click.native="goBack()">取消</Button>
        </Col>
      </Row>
    </div>
    <section class="container">
      <Tabs
        :value="type"
        @on-click="shift"
      >
        <TabPane label="问答" name="question">
          <mt-loadmore
            :bottom-method="loadMore"
            :top-method="loadNew"
            :bottom-all-loaded="bottomAllLoaded"
            :top-all-loaded="true"
            ref="loadmore"
            :bottomDistance="70"
            @bottom-status-change="bottomStatusChange"
          >
            <Row :class="$style.questionList" :gutter="24" :key="index" v-for="(question, index) in questions" @click.native="$router.push({name: 'questionDetail', params: {question_id: question.id}})">
              <Col span="24">
                <p>
                  {{ question.subject }}
                </p>
              </Col>
            </Row>
            <div slot="bottom" :class="[$style.mintLoadmoreBottom, 'mint-loadmore-bottom']">
              <span v-if="bottomAllLoaded">没有更多了</span>
              <section v-else>
                <span v-show="bottomStatus === 'pull' && !bottomAllLoaded">上拉加载更多</span>
                <span v-show="bottomStatus === 'loading'">加载中...</span>
                <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
              </section>
            </div>
          </mt-loadmore>
        </TabPane>
        <TabPane label="话题" name="topic">
          <mt-loadmore
            :bottom-method="topicLoadMore"
            :top-method="topicLoadNew"
            :bottom-all-loaded="topicBottomAllLoaded"
            :top-all-loaded="true"
            ref="topicloadmore"
            :bottomDistance="70"
            @bottom-status-change="topicBottomStatusChange"
          >
            <Row @click.native="$router.push({ name: 'topicDetail', params: { topic_id: topic.id }})" :gutter="24" :class="$style.listContainer" v-for="(topic, index) in topics" :key="index">
              <Col span="6">
                <img  :class="$style.topicImg" v-lazy="topic.avatar" :alt="topic.name" />
              </Col>
              <Col span="12">
                <section>
                  <h3 :class="$style.name">{{ topic.name }}</h3>
                  <span>{{ topic.follows_count }}</span> 关注 · <span>{{ topic.questions_count }}</span> 问题
                </section>
              </Col>
              <Col span="6" class="header-end-col">
                <Button v-if="!topic.has_follow" :class="[$style.unfollow,'followAboutButton']" type="ghost" @click.stop="follow(topic.id, index)"><PlusIcon height="16" width="16" color="#59b6d7" />关注</Button>
                <Button class="followAboutButton" v-else type="ghost" @click.stop="unFollow(topic.id, index)"><RightIcon height="16" width="16" color="#ccc" />已关注</Button>
              </Col>
            </Row>
            <div slot="bottom" :class="[$style.mintLoadmoreBottom, 'mint-loadmore-bottom']">
              <span v-if="topicBottomAllLoaded">没有更多了</span>
              <section v-else>
                <span v-show="topicBottomStatus === 'pull' && !topicBottomAllLoaded">上拉加载更多</span>
                <span v-show="topicBottomStatus === 'loading'">加载中...</span>
                <span v-show="topicBottomStatus === 'drop' && !topicBottomAllLoaded">释放加载更多</span>
              </section>
            </div>
          </mt-loadmore>
        </TabPane>
      </Tabs>
    </section>
  </section>
</template>
<style lang="less" module>
  .root {
    background-color: #f4f5f5;
    .mintLoadmoreBottom {
      margin-bottom: -50px;
    }
    .listContainer {
      padding-top: 12px;
      padding-bottom: 12px;
      background-color: #fff;
      border-bottom: 1px solid #ededed;
      &:last-child {
        border-bottom: none;
      }
      .name {
        word-break: break-all;
      }
      .topicImg {
        width: 100%;
      }
      .unfollow {
        border: 1px solid #59b6d7;
        color: #59b6d7;
      }
    }
    .questionList {
      padding-top: 12px;
      padding-bottom: 12px;
      background-color: #fff;
      border-bottom: 1px solid #efefef;
      p {
        font-size: 16px;
        word-break: break-all;
      }
    }
  }
</style>
<style lang="less">
  .questionSearch {
    .commonHeader {
      .ivu-input-group-prepend {
        background-color: #efefef;
        border: none;
      }
      .ivu-input {
        background-color: #efefef;
        border-radius: 6px;
        border-left: none;
        border: none;
        font-size: 16px;
        &:focus, &:hover {
          border: none;
          box-shadow: none;
        }
      }
    }
    .container {
      height: calc(~"100vh - 46px");
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      .ivu-tabs-bar {
        background-color: #fff;
        margin-bottom: 0;
        .ivu-tabs-tab {
          width: 50vw;
          margin-right: 0;
          text-align: center;
          font-size: 16px;
          padding-bottom: 12px;
          padding-top: 12px;
        }
      }
    }
  }
</style>
<script>
  import { createAPI, addAccessToken, createRequestURI } from '../../utils/request';
  import { resolveImage } from '../../utils/resource';
  import SearchIcon from '../../icons/Search';
  import PlusIcon from '../../icons/Plus';
  import RightIcon from '../../icons/Right';

  const QuestionSearch = {
    components: {
      SearchIcon,
      RightIcon,
      PlusIcon
    },
    data: () => ({
      key: '',
      type: 'question',
      limit: 20,
      questions: [],
      topics: [],
      name: '', // 话题关键字
      subject: '', // 问题关键字
      topicBottomStatus: '',
      bottomStatus: '',
      bottomAllLoaded: true,
      topicBottomAllLoaded: true
    }),
    watch: {
      key (newKey) {
        if(newKey === '') {
          this.subject = '';
          this.name = '';
        } else {
          const { type } = this;
          if( type === 'question') {
            this.subject = newKey;
          } else {
            this.name = newKey;
          }
        }
      },
      type (newType) {
        if(newType === 'question') {
          this.subject = this.key;
          this.name = '';
        } else {
          this.name = this.key;
          this.subject = '';
        }
      },
      name ( newName ) {
        if(newName !== '') {
          this.getTopics('new');
        }
      },
      subject (newSubject) {
        if(newSubject !== '') {
          this.getQuestions('new');
        }
      }
    },
    methods: {
      goBack() {
        if(window.history.length < 2) {
          this.$router.push('/questions/');
          return;
        }
        this.$router.back();
      },
      follow (id, index) {
        addAccessToken().put(
          createAPI(`user/question-topics/${id}`),
          {
            validataStatus: status => status === 201
          }
        )
        .then( () => {
          this.topics[index].has_follow = true;
        })
      },
      unFollow (id, index) {
        addAccessToken().delete(
          createAPI(`user/question-topics/${id}`),
          {
            validataStatus: status => status === 204
          }
        )
        .then( () => {
          if(this.type === 'follow') {
            this.topics.splice(index, 1);
            return ;
          }

          this.topics[index].has_follow = false;
        })
      },
      bottomStatusChange (status) {
        this.bottomStatus = status;
      },
      topicBottomStatusChange (status) {
        this.topicBottomStatus = status;
      },
      loadMore () {
        this.getQuestions('loadMore');
      },
      loadNew () {
        this.getQuestions('loadNew')
      },
      topicLoadMore () {
        this.getTopics('loadMore');
      },
      topicLoadNew () {
        this.getTopics('loadNew')
      },
      shift(type) {
        this.type = type;
      },
      getQuestions (loadtype = 'new') {
        if(loadtype === 'loadMore' && this.bottomAllLoaded) {
          this.$refs.loadmore.onBottomLoaded();
          return;
        }
        const { limit, questions: { length = 0 }, subject } = this;
        let params = {
          type: 'all',
          limit,
          subject
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

      getTopics ( loadtype = 'new') {
        if(loadtype === 'loadMore' && this.topicBottomAllLoaded) {
          this.$refs.topicloadmore.onBottomLoaded();

          return;
        }
        const { name, limit, topics: { length = 0 } } = this;
        let url = 'question-topics';
        let params = {
          limit,
          name,
          follow: 'yes'
        }

        if(loadtype === 'loadMore') {
          params.offset = length;
        }
        addAccessToken().get(
          createAPI(url),
          {
            params
          },
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          if(loadtype === 'new' ) {
            this.topics = data;

            if(data.length === limit) {
              this.topicBottomAllLoaded = false;
            }

            return;
          }

          if(loadtype === 'loadNew') {
            this.topics = _.uniqBy([
              ...data,
              ...this.topics
            ], 'id');
            this.$refs.topicloadmore.onTopLoaded();
            return;
          }

          if(loadtype === 'loadMore') {
            this.topics = [
              ...this.topics,
              ...data
            ];
            if(data.length === limit) {
              this.topicBottomAllLoaded = false;
            }
            if(data.length < limit) {
              this.topicBottomAllLoaded = true;
            }
            this.$refs.topicloadmore.onBottomLoaded();

            return;
          }
        })
      }
    },
    beforeMount () {

    }
  };

  export default QuestionSearch;
</script>