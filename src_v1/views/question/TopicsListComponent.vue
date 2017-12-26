<template>
  <section :class="$style.componentRoot">
    <!-- Loadding -->
    <div id="spinner" v-if="loading">
      <div id="spinner-parent">
        <div class="spinner-double-bounce-bounce2" />
        <div class="spinner-double-bounce-bounce1" />
      </div>
    </div>
    <template v-else-if="! empty">
      <div :class="[$style.wrapper, 'wrapper']">
        <mt-loadmore
          :bottom-method="loadMore"
          :top-method="loadNew"
          :bottom-all-loaded="bottomAllLoaded"
          :top-all-loaded="false"
          ref="loadmore"
          :bottomDistance="70"
          @bottom-status-change="bottomStatusChange"
          @top-status-change="topStatusChange"
        >
          <section
            :class="$style.listContainer"
            v-for="(topic, index) in topics"
            @click="$router.push({ name: 'topicDetail', params: { topic_id: topic.id }})"
          >
            <Row :gutter="24">
              <Col span="6">
                <img :class="$style.topicImg" v-lazy="topic.avatar" :alt="topic.name" />
              </Col>
              <Col span="12">
                <section>
                  <h3 :class="$style.name">{{ topic.name }}</h3>
                  <span>{{ topic.follows_count }}</span> 关注 · <span>{{ topic.questions_count }}</span> 问题
                </section>
              </Col>
              <Col span="6" class="header-end-col">
                <Button class="followAboutButton" v-if="type !== 'follow' && !topic.has_follow" :class="$style.unfollow" type="ghost" @click.stop="follow(topic.id, index)"> <PlusIcon height="16" width="16" color="#59b6d7" />关注</Button>
                <Button class="followAboutButton" v-else-if="type === 'follow'" type="ghost" @click.stop="unFollow(topic.id, index)"><RightIcon height="16" width="16" color="#ccc" />已关注</Button>
                <Button class="followAboutButton" v-else type="ghost" @click.stop="unFollow(topic.id, index)"><RightIcon height="16" width="16" color="#ccc" />已关注</Button>
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
    <img v-lazy="nothingImage" style="width: 80vw; left: 10vw;  position: fixed; top: 30vh;" v-else alt="" />
  </section>
</template>
<style lang="less" module>
  .componentRoot {
    .wrapper {
      height: calc(~"100vh - 109px");
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
      .mintLoadmoreBottom {
        margin-bottom: -50px;
      }
    }
  }
</style>
<style lang="less" scoped="">
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
  import PlusIcon from '../../icons/Plus';
  import RightIcon from '../../icons/Right';

  const nothingImage = resolveImage(require('../../statics/images/defaultNothingx2.png'));
  const TopicsListComponent = {
    components: {
      PlusIcon,
      RightIcon
    },
    data: () => ({
      type: 'all',
      loading: false,
      topics: [],
      bottomAllLoaded: true,
      bottomStatus: '',
      topStatus: '',
      nothingImage,
      limit: 20,
    }),
    methods: {
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
      topStatusChange (status) {
        this.topStatus = status;
      },
      /**
       * 底部加载更多
       * @return {[type]} [description]
       */
      loadMore () {
        if(this.bottomAllLoaded) return;
        this.getTopics('loadMore')
      },

      /**
       * 顶部下拉刷新
       * @return {[type]} [description]
       */
      loadNew () {
        this.getTopics('loadNew');
      },
      /**
       * 底部状态变化
       * @param  {[type]} status [description]
       * @return {[type]}        [description]
       */
      bottomStatusChange (status) {
        this.bottomStatus = status;
      },
      getTopics (loadtype = 'new') {
        const { type, limit, topics: { length = 0 } } = this;
        let url = 'question-topics';
        let params = {
          limit
        }
        if(type === 'follow') {
          url = 'user/question-topics';
        }
        if(type === 'all') {
          params.follow = 'yes';
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
            this.loading = false;

            if(data.length === limit) {
              this.bottomAllLoaded = false;
            }

            return;
          }

          if(loadtype === 'loadNew') {
            this.topics = _.uniqBy([
              ...data,
              ...this.topics
            ], 'id');
            this.$refs.loadmore.onTopLoaded();
            return;
          }

          if(loadtype === 'loadMore') {
            this.topics = [
              ...this.topics,
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
        })
      }
    },

    watch: {
      '$route': function (route) {
        this.type = route.params.type;
        this.loading = true;
        this.getTopics();
      }
    },

    computed: {
      /**
       * The question is emoty.
       * @return {Boolean}
       */
      empty () {
        const { length } = this.topics;
        
        return ! length;
      }
    },

    mounted () {
      this.type = this.$route.params.type || 'all';
      this.loading = true;
      this.getTopics();
    }
  };

  export default TopicsListComponent;
</script>