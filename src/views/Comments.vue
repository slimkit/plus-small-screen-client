<template>
  <div class="comments">
    <div class="commonHeader">
      <Row :gutter="16">
        <Col span="4">
          <BackIcon @click.native="goTo(-1)" height="21" width="21" color="#999" />
        </Col>
        <Col span="16" class="title-col">
          评论
        </Col>
      </Row>
    </div>
    <div v-if="nothing" class="nothingDefault"> 
      <img :src="nothing" />
    </div>
    <mt-loadmore
      v-if="!nothing"
      :bottom-method="loadBottom"
      :top-method="loadTop"
      :bottom-all-loaded="bottomAllLoaded"
      :top-all-loaded="topAllLoaded"
      @bottom-status-change="bottomStatusChange"
      ref="loadmoreComments"
      :bottomDistance="70"
    >
      <div class="commentContent">
        <div :class="$style.comments">
          <Row :gutter="16" v-for="(comment, index) in formatedComments" :key="index" :class="$style.comment">
            <Col span="4" class="avatar-parent-col">
              <img @click="changeUrl(`/users/feeds/${comment.user_id}`)" class="avatar" :src="comment.avatar" :alt="comment.name" />
            </Col>
            <Col span="16">
              <h4 @click="changeUrl(`/users/feeds/${comment.user_id}`)">{{comment.name}}</h4>
              <div class="gray-color">
                <span v-if="comment.reply_to_user_id">回复</span>
                <span @click="changeUrl(`/users/feeds/${comment.reply_to_user_id}`)" class="primary-color" style="padding: 0 4px;" v-if="comment.reply_to_user_id">{{comment.reply_to_user_name}}: </span>
                {{comment.comment_content}}
              </div>
              <timeago style="font-size: 14px; color: #999;" :since="comment.time" locale="zh-CN" :auto-update="60"></timeago>
            </Col>
            <Col span="4">
              <div :class="$style.sourceContent">
                <img v-if="comment.cover" @click="changeUrl(`/feed/${comment.source_id}`)" :src="comment.cover" />
                <div v-if="!comment.cover" @click="changeUrl(`/feed/${comment.source_id}`)" :class="$style.source">
                  <div :class="$style.content">
                    {{comment.source_content}}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomAllLoaded">没有更多了</span>
        <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
        <span v-show="bottomStatus === 'loading' && !bottomAllLoaded">加载中...</span>
        <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
  import { NOTICE } from '../stores/types';
  import { createAPI, addAccessToken } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import { changeUrl, goTo } from '../utils/changeUrl';
  import timers from '../utils/timer';
  import getImage from '../utils/getImage';
  import BackIcon from '../icons/Back';
  import lodash from 'lodash';
  import { resolveImage } from '../utils/resource';
  const defaultNoBody = resolveImage(require('../statics/images/img_default_nobody@2x.png'));
  const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));
  
  const Comments = {
    components: {
      BackIcon
    },
    data: () => ({
      max_id: 0,
      comments: [],
      ids: [],
      bottomAllLoaded: false,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: ''
    }),
    methods: {
      changeUrl,
      goTo,
      loadTop () {
        addAccessToken().get(createAPI(`users/mycomments`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(response => {
          let comments = response.data.data;
          let newcomments = [];
          comments.forEach( comment => {
            if( this.ids.findIndex(function(value, index, arr) {
              return value == comment.id;
            }) == -1) {
              newcomments.push(comment);
            }
          });
          this.comments = [ ...newcomments, ...this.comments ];
          setTimeout( () => {
            if(this.$refs.loadmoreComments)
              this.$refs.loadmoreComments.onTopLoaded();
          }, 500)
        })
      },
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },
      loadBottom () {
        if(!this.max_id) return;
        addAccessToken().get(createAPI(`users/mycomments?max_id=${this.max_id}`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(response => {
          let comments = response.data.data;
          this.comments = [ ...this.comments, ...comments ];
          let length = comments.length;
          if(length < 15) {
            this.bottomAllLoaded = true;
          };
          this.max_id = comments[length -1].id;
          setTimeout( () => {
            if(this.$refs.loadmoreDiggs)
              this.$refs.loadmoreDiggs.onBottomLoaded();
          }, 500)
        })
      }
    },
    computed: {
      formatedComments () {
        let comments = this.comments;
        let newcomments = [];
        comments.forEach(comment => {
          let newcomment = {
            name: '',
            avatar: '',
            user_id: comment.user_id,
            reply_to_user_id: comment.reply_to_user_id,
            reply_to_user_name: '',
            time: 0,
            source_id: comment.source_id,
            source_content: comment.source_content,
            component: comment.component,
            comment_content: comment.comment_content,
            cover: ''
          };
          let user = localEvent.getLocalItem(`user_${comment.user_id}`);
          let reply_to_user = {};
          if(comment.reply_to_user_id) {
            reply_to_user = localEvent.getLocalItem(`user_${comment.reply_to_user_id}`);
            if(!lodash.keys(reply_to_user).length) {
              getUserInfo(comment.reply_to_user_id, 30).then( replyUser => {
                const { name = '' } = replyUser;
                newcomment.reply_to_user_name = name;
              });
            } else {
              const { name = '' } = reply_to_user;
              newcomment.reply_to_user_name = name;
            }
            
          }
          const { avatar: { 30: avatar = defaultAvatar} = {} } = user;
          const { name = '' } = user;
          if(comment.source_cover) {
            newcomment.cover = getImage(comment.source_cover, 20);
          }
          newcomment.name = name;
          newcomment.avatar = avatar;
          newcomment.time = timers(comment.created_at, 8, false)
          newcomments.push(newcomment);
        });
        return newcomments;
      },
      nothing () {
        return this.comments.length > 0 ? 0 : defaultNoBody;
      }
    },
    created () {
      addAccessToken().get(createAPI(`users/mycomments?max_id=${this.max_id}`),{},
        {
          validateStatus: status => status === 200
        }
      )
      .then(response => {
        this.comments = response.data.data;
        this.comments.forEach( comment => {
          this.ids.push(comment.id);
        });
        let length = this.comments.length;
        if(length < 15) {
          this.bottomAllLoaded = true;
          setTimeout( () => {
            if(this.$refs.loadmoreComments)
              this.$refs.loadmoreComments.onTopLoaded();
          }, 500)
        };
        if(length)
          this.max_id = this.comments[length - 1].id;
      })
    }
  };
  export default Comments;
</script>
<style lang="scss" module>
  .comments {
    .comment {
      border-bottom: 1px #e2e3e3 solid;
      padding: 8px 0;
      background-color: #fff;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .sourceContent {
    background-color: #ededed;
    padding: 2px;
    position: relative;
    height: 100%;
    &:before {
      content: '';
      display: block;
      padding-top: 100%;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      object-fit: cover;
      right: 0;
      bottom: 0;
      height: 100%;
    }
    .source {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      font-size: 10px;
      .content {
        padding: 4px;
        text-align: justify;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        word-break: break-all;
        display: -webkit-box;
      }
    }
  }
</style>
<style scoped>
  .comments {
    position: relative;
  }
  .row-container {
    align-items: flex-start;
  }
  .mint-loadmore {
    padding-bottom: 50px;
    overflow: initial;
  }
</style>