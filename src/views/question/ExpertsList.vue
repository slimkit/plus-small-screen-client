<template>
  <section :class="$style.root">
    <header class="commonHeader">
      <Row :gutter="24">
        <Col span="5">
          <BackIcon height="21" @click.native="goBack()" width="21" color="#979797" />
        </Col>
        <Col span="14" class="title-col">
          专家列表
        </Col>
      </Row>
    </header>
    <div class="nothingDefault" v-if="nothing"> 
      <img :src="nothing" />
    </div>
    <mt-loadmore
      v-else
      :bottom-method="loadMore"
      :top-method="loadNew"
      :bottom-all-loaded="bottomAllLoaded"
      :top-all-loaded="topAllLoaded"
      ref="loadmore"
      :bottomDistance="70"
      @bottom-status-change="bottomStatusChange"
      :class="$style.usersLoadMore"
    >
      <section>
        <Row 
          :gutter="24"
          v-for="(user, index) in formatedUsers"
          :key="index"
          :class="$style.userList"
           @click.native="$router.push({name: 'userSpace', params: {user_id: user.id}})"
        >
          <Col span="6" :class="$style.avatar">
            <img class="component-avatar" v-lazy="user.avatar" :alt="user.uname">
          </Col>
          <Col span="18" :class="$style.userBody">
            <h3>{{ user.name }}</h3>
            <section>
              <span>{{user.extra.answers_count}}</span> 回答 . 
              <span>{{user.extra.likes_count}}</span> 赞
            </section>
            <section v-if="user.tags.length">
              <Tag type="border" v-for="tag in user.tags" :key="tag.id">{{tag.name}}</Tag>
            </section>
          </Col>
        </Row>
      </section>
      <div slot="bottom" :class="['mint-loadmore-bottom', $style.mintLoadmoreBottom]">
        <span v-if="bottomAllLoaded">没有更多了</span>
        <section v-else>
          <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
          <span v-show="bottomStatus === 'loading'">加载中...</span>
          <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
        </section>
      </div>
    </mt-loadmore>
  </section>
</template>
<style lang="less" module>
  .root {
    &.show {
      z-index: 11;
    }
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .usersLoadMore {
      height: 100%;
      .avatar {
        img {
          width: 100%;
        }
      }
      .mintLoadmoreBottom {
        margin-bottom: -50px;
      }
      .userList {
        background-color: #fff;
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #efefef;
        &:last-child {
          border-bottom: none;
        }
        .userBody {
          text-align: initial;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
          span {
            color: #59b6d7;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .expertList {
    .ivu-modal {
      top: 0;
      margin: 0;
      height: 100%;
      .ivu-modal-content {
        border-radius: 0;
        height: 100%;
        .ivu-modal-header {
          padding: 8px 0;
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
        .ivu-modal-body {
          padding: 0;
          height: calc(~"100% - 52px");
          overflow: scroll;
          font-size: 16px;
        }
        .ivu-modal-footer {
          padding: 0;
          border-top: none;
        }
      }
    }
  }
</style>
<script>
  import _ from 'lodash';
  import { createAPI, addAccessToken, createRequestURI } from '../../utils/request';
  import { resolveImage } from '../../utils/resource';
  import BackIcon from '../../icons/Back';

  const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'));
  const noAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));
  const ExpertsList = {
    components: {
      BackIcon
    },
    data: () => ({
      showSpinner: false,
      users: [],
      bottomAllLoaded: true,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      limit: 20,
      show: false,
      topic_id: 0
    }),
    methods: {
      goBack() {
        if(window.history.length < 2) {
          this.$router.push(`/questions/topics/${this.topic}`);
          return;
        }
        this.$router.back();
      },
      loadNew () {
        this.getExperts('loadNew');
      },
      loadMore () {
        this.getExperts('loadMore');
      },
      bottomStatusChange (status) {
        this.bottomStatus = status;
      },

      getExperts ( type = 'loadNew') {
        if (type === 'loadMore' && this.bottomAllLoaded) {
          this.$refs.loadmore.onBottomLoaded();
          return;
        }
        const { topic_id, limit } = this;
        let params = {
          limit
        };

        addAccessToken().get(
          createAPI(`question-topics/${topic_id}/experts`),
          {
            params: {
              ...params
            }
          },
          {
            validataStatus: status => status === 200
          }
        )
        .then(({ data }) => {
          if (type === 'loadMore') {
            this.users = [
              ...this.users,
              ...data
            ];
            if (data.length === limit) {
              this.bottomAllLoaded = false;
            } else this.bottomAllLoaded = true;
            this.$refs.loadmore.onBottomLoaded();

            return
          }
          if (type === 'new') {
            this.users = data;
            if (data.length === limit) {
              this.bottomAllLoaded = false;
            } else {
              this.bottomAllLoaded = true;
            }

            return;
          }
          if (type === 'loadNew') {
            this.users = _.uniqBy([
              ...data,
              ...this.users
            ], 'id');

            this.$refs.loadmore.onTopLoaded();
            
            return;
          }
        })
      }
    },

    created () {
      this.topic_id = this.$route.params.topic_id || 0;
      this.getExperts('new');
    },

    computed: {
      nothing () {
        return this.users.length == 0 ? nothingImg : 0;
      },
      after () {
        const { users: { length = 0 } } = this;
        if (!length) return 0;
        return _.last(this.users)['id'];
      },
      formatedUsers () {
        const { users } = this;
        users.map( user => {
          user.avatar = user.avatar || noAvatar;
        });

        return users;
      }
    }
  };

  export default ExpertsList;
</script>