<template>
  <Modal 
    v-model="show"
    v-if="show"
    :class="[$style.root, show ? $style.show : '']" 
    width="100%"
    :closable="false"
    :mask-closable="false"
    class-name="expertList"
    :transfer="false"
  >
    <div slot="header" style="color:#f60;text-align:center">
      <Row :gutter="24">
        <Col span="20">
          <Input v-model.trim="key">
            <span slot="prepend">
              <SearchIcon height="20" width="20" color="#bfbfbf" />
            </span>
          </Input>
        </Col>
        <Col span="4">
          <Button type="text" @click.native="closeExpert">取消</Button>
        </Col>
      </Row>
    </div>
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
          @click.native="selectUser(user)"
        >
          <Col span="6" :class="$style.avatar">
            <img v-lazy="user.avatar" :alt="user.uname">
          </Col>
          <Col span="18" :class="$style.userBody">
            <h3>{{ user.name }}</h3>
            <section>
              <span>{{user.extra.answers_count}}</span> 回答 . 
              <span>{{user.extra.likes_count}}</span> 赞
            </section>
            <section v-if="user.tags">
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
    <div slot="footer"></div>
  </Modal>
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
  import SearchIcon from '../../icons/Search';
  import _ from 'lodash';
  import { createAPI, addAccessToken, createRequestURI } from '../../utils/request';
  import { resolveImage } from '../../utils/resource';

  const nothingImg = resolveImage(require('../../statics/images/defaultNothingx3.png'));
  const noAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));
  const expert = {
    components: {
      SearchIcon
    },
    props: [
      'selectExpert',
      "open",
      'topics'
    ],
    data: () => ({
      showSpinner: false,
      key: '',
      users: [],
      bottomAllLoaded: true,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      limit: 20,
      show: false
    }),
    watch: {
      key (newKey) {
        if(newKey !== '') {
          this.getUsers('new');
        }

        if(newKey === '') {
          this.getExperts('new');
        }
      }
    },
    methods: {
      selectUser(user) {
        this.show = false;
        this.$emit('selectExpert', user);
      },
      closeExpert () {
        this.show = false;
        this.$emit('selectExpert', {});
      },
      loadNew () {
        const { key } = this;
        if (key) {
          this.getUsers('loadNew');
        } else {
          this.getExperts('loadNew');
        }
      },
      loadMore () {
        const { key } = this;
        if (key) {
          this.getUsers('loadMore');
        } else {
          this.getExperts('loadMore');
        }
      },
      bottomStatusChange (status) {
        this.bottomStatus = status;
      },

      getUsers (type = 'new') {
        if ( type === 'loadMore' && this.bottomAllLoaded ) {
          this.$refs.loadmore.onBottomLoaded();

          return
        }
        const { key, users: { length = 0 }, limit } = this;
        let data = { keyword: key, limit };
        if (type === 'loadMore') {
          data.offset = length;
        }
        addAccessToken().get(
          createAPI(`user/search`),
          {
            params: {
              ...data
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
            if (data.length === limit) this.bottomAllLoaded = false;
            this.$refs.loadmore.onBottomLoaded();

            return
          }
          if (type === 'new') {
            this.users = data;
            if (data.length === limit) this.bottomAllLoaded = false;

            return;
          }
          if (type === 'loadNew') {
            this.users = _.uniqBy([
              ...data,
              ...this.users
            ], 'id');

            this.$refs.loadmore.onTopLoaded();
          }
        })
      },

      getExperts ( type = 'loadNew') {
        const { users, key, tops, limit } = this;
        let params = {};

        if ( type === 'loadMore' ) {
          params.offset = users.length;
        }
        params.topics = _.join(this.tops, ',');

        addAccessToken().get(
          createAPI('question-experts'),
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
            if (data.length === limit) this.bottomAllLoaded = false;
            this.$refs.loadmore.onBottomLoaded();

            return
          }
          if (type === 'new') {
            this.users = data;
            if (data.length === limit) this.bottomAllLoaded = false;

            return;
          }
          if (type === 'loadNew') {
            this.users = _.uniqBy([
              ...data,
              ...this.users
            ], 'id');

            this.$refs.loadmore.onTopLoaded();
          }
        })
      }
    },

    created () {
      this.show = this.open;
      this.getExperts('new');
    },

    computed: {
      tops () {
        let ids = this.topics.map( topic => {
          return topic.id
        });
        return ids;
      },
      nothing () {
        return this.users.length == 0 ? nothingImg : 0;
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

  export default expert;
</script>