<template>
  <div class="comments">
    <div class="commonHeader">
      <Row :gutter="16">
        <Col span="4">
          <div class="" @click="goTo(-1)">
            <BackIcon height="21" width="21" color="#999" />
          </div>
        </Col>
        <Col span="16" class="title-col">
          评论
        </Col>
      </Row>
    </div>
    <div class="commentContent">
      <div :class="$style.comments">
        <Row :gutter="16" v-for="(comment, index) in formatedComments" :key="index" :class="$style.comment">
          <div class="row-container" @click="changeUrl('')">
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
              <div >
                <img v-if="comment.cover" :src="comment.cover" />
                <div :class="$style.sourceContent" v-if="!comment.cover">
                  <div :class="$style.source">
                    {{comment.source_content}}
                  </div>
                </div>
              </div>
            </Col>
          </div>
        </Row>
      </div>
    </div>
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

  const Comments = {
    components: {
      BackIcon
    },
    data: () => ({
      max_id: 0,
      comments: []
    }),
    methods: {
      changeUrl,
      goTo
    },
    computed: {
      formatedComments () {
        let comments = this.comments;
        let newcomments = [];
        comments.forEach(comment => {
          let newcomment = {
            name: '',
            avatar: '',
            user_id: comment.to_user_id,
            reply_to_user_id: comment.reply_to_user_id,
            reply_to_user_name: '',
            avatar: '',
            time: 0,
            source_id: comment.source_id,
            source_content: comment.source_content,
            component: comment.component,
            comment_content: comment.comment_content,
            cover: ''
          };
          let user = localEvent.getLocalItem(`user_${comment.to_user_id}`);
          let reply_to_user = {};
          if(comment.reply_to_user_id) {
            reply_to_user = localEvent.getLocalItem(`user_${comment.reply_to_user_id}`);
            if(!Object.keys(reply_to_user).length) {
              getUserInfo(comment.reply_to_user_id, replyUser => {
                const { name = '' } = replyUser;
                newcomment.reply_to_user_name = name;
              });
            } else {
              const { name = '' } = reply_to_user;
              newcomment.reply_to_user_name = name;
            }
            
          }
          const { avatar: { 30: avatar = ''} = {} } = user;
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
      commentsCount () {
        return this.comments.length > 0;
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
      })
      .catch(({ response: { message = '网络状况堪忧' } = {} } ) => {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: data.message,
            time: 2000,
            status: false
          });
        });
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
    .source {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      font-size: 12px;
      padding: 5px;
      text-align: justify;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      word-break: break-all;
      color: #999;
      align-items: center;
    }
  }
</style>