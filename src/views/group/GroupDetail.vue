<template>
<div class="group-detail">
  <Row :gutter="24"
       class="gd-header"
       :class="{active:scrollTop > 99}">
    <Col span="4"
         @click.native="goTo(-1)">
    <back-icon height="21"
               width="21"
               color="#999"></back-icon>
    </Col>
    <Col span="16"
         class="gd-title"> {{ group.title || '圈子详情' }}
    </Col>
    <Col span="4"
         class="group-action"
         style="padding: 0; margin-left: -12px">
    <div class="action-btn"
         v-if="!is_member"
         @click.stop.prevent="joinGroup">
      <Icon type="plus"></Icon>
      <span>加入</span>
    </div>
    </Col>
  </Row>
  <post-feed v-if="is_member"></post-feed>
  <div class="gd-content">
    <div class="gd-cover">
      <div class="blur-box">
        <div class="blur"
             :style="{'background-image': `url(${cover})`}"></div>
        <div class="gd-cover-container">
          <div class="gd-avatar">
            <img :src="avatar">
          </div>
          <p class="gd-title">
            {{group.title || '圈子详情'}}
          </p>
          <p class="gd-intro">
            {{group.intro || '暂无介绍'}}
          </p>
          <div class="gd-info">
            <span>订阅 <b>{{ group.members_count }}</b></span>
            <span>分享 <b>{{ group.posts_count }}</b></span>
          </div>
        </div>
      </div>
    </div>
    <feeds-list :groupID='+$route.params.id'></feeds-list>
  </div>
</div>

</template>

<script>
import backIcon from '../../icons/Back';
import { goTo } from '../../utils/changeUrl';
import axios, { addAccessToken, createAPI } from '../../utils/request';

import groupFeedsList from './GroupFeedsList';

import { resolveImage } from '../../utils/resource';
const defaultCover2 = resolveImage('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')

import g_post_feed from './GroupPostFeed';
export default {
  name: 'group-detail',
  components: {
    backIcon,
    'post-feed': g_post_feed,
    'feeds-list': groupFeedsList,
  },
  data() {
    return ({
      scrollTop: 0,
      group: {
        id: this.$route.params.id,
        cover: {},
        intro: '',
        title: '',
        avatar: {},
        posts_count: 0,
        members_count: 0
      },

      feeds: []
    })
  },
  computed: {
    is_member() {
      return this.group.is_member > 0
    },
    avatar() {
      const id = (this.group.avatar || {}).id
      return id ? `/api/v2/files/${id}` : defaultCover2
    },
    cover() {
      const id = (this.group.cover || {}).id
      return id ? `'/api/v2/files/${id}'` : defaultCover2
    }
  },
  methods: {
    goTo,
    joinGroup() {
      addAccessToken().post(createAPI(`groups/${this.group.id}/join`), {
        validateStatus: status => (status === 201)
      }).then(({status, data = {
            message: '加入成功！'
          }}) => {
        this.group.is_member = true;
      }).catch(({response: {data = { message: "加入失败!" }}}) => {
        const msg = this.$MessageBundle(data).getMessage();
        this.$Message.error(msg);
      });
    },
    getGroupById() {
      const {id} = this.$route.params
      return id ?
        axios.get(createAPI(`groups/${id}`)).then(({data}) => {
          this.group = {
            ...this.group,
            ...data
          }
        }).catch(err => console.log(err)) : false
    },
  },
  created() {
    this.getGroupById()
  },
  mounted() {
    this.$el.addEventListener('scroll', (e) => {
      this.scrollTop = this.$el.scrollTop;
    });
  }
}

</script>

<style lang="scss">
.group-detail {
  height: 100%;
  overflow: auto;
  .gd-header {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 46px;
    z-index: 6;
    font-size: 16px;
    transition: background 0.5s linear;
    background-color: rgba(255, 255, 255, 0);
    border-bottom: 1px solid transparent;
    svg {
      fill: #fff;
      transition: all 0.5s linear;
    }
    .action-btn {
      width: 100%;
      border-color: #fff;
      color: #fff;
      transition: all 0.5s linear;
    }
    .gd-title {
      height: 100%;
      line-height: 46px;
      text-align: center;
      transition: all 0.5s linear;
      opacity: 0;
      transform: translateY(100%);
    }
    &.active {
      background-color: rgba(255, 255, 255, 1);
      border-color: #ededed;
      .gd-title {
        opacity: 1;
        transform: translateY(0);
      }
      .action-btn {
        border-color: #59b6d7;
        color: #59b6d7;
      }
      svg {
        fill: #333;
      }
    }
  }
  .gd-content {
    min-height: 100%;
    .gd-cover {
      height: 225px;
      .blur-box {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background-color: #ededed;
        >.blur {
          display: block;
          filter: blur(5px) brightness(150%);
          background-size: cover;
          background-position: center;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 5;
          transform: scale(1.5);
        }
      }
    }
    .gd-cover-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      padding: 46px 15px 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      color: #fff;
      > {
        flex: 0 0 auto;
        * {
          opacity: .7;
        }
      }
      .gd-avatar {
        opacity: 1;
        overflow: hidden;
        width: 64px;
        height: 64px;
        border: 2px solid #fff;
        img {
          width: 100%;
          objct-fill: cover;
        }
      }
      .gd-title {
        opacity: 1;
        font-size: 16px;
        margin: 10px auto;
      }
      .gd-intro {
        font-size: 14px;
        width: 100%;
        height: 14px;
        line-height: 14px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 15px;
        white-space: nowrap;
      }
      .gd-info {
        b {
          margin-left: 5px;
        }
        >span+span {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
