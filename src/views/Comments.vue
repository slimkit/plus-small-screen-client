<template>
  <div class="comments">
    <div class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5">
          <BackIcon @click.native="goTo(-1)" height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
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
      <section class="commentContent">
        <ul :class="$style.comments">
          <li v-for="(comment, index) in formated" :key="index" :class="$style.comment">
            <div :class="$style.commentContent">
              <div class="avatar-parent-col" style="width: 16vw">
                <img @click="changeUrl(`/users/feeds/${comment.user_id}`)" class="avatar" :src="comment.avatar" :alt="comment.name" />
              </div>
              <div span="16" style="width: 68vw; padding: 0 12px;">
                <!-- 评论者 -->
                <h4 @click="changeUrl(`/users/feeds/${comment.user_id}`)">{{comment.name}}</h4>
                <!-- 第三+评论者 -->
                <div class="gray-color">
                  <span v-if="comment.replyUser">回复</span>
                  <span @click="changeUrl(`/users/feeds/${comment.replyUser.user_id}`)" class="primary-color" style="padding: 0 4px;" v-if="comment.replyUser">{{comment.replyUser.name}}: </span>
                  {{comment.body}}
                </div>
                <timeago style="font-size: 14px; color: #999;" :since="comment.time" locale="zh-CN" :auto-update="60"></timeago>
              </div>
              <div style="width: 16vw">
                <div :class="$style.sourceContent">
                  <img v-if="comment.cover" @click="openCommentBox(index)" :src="comment.cover" />
                  <div v-if="!comment.cover" @click="openCommentBox(index)" :class="$style.source">
                    <div :class="$style.content">
                      {{comment.source_content}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 评论框 -->
            <section :class="$style.commentBox" v-if="openId === index" ref="commentInput" style="width: 100%;">
              <li>
                <Input 
                  type="textarea" 
                  ref="commentInput"
                  class="commentInput"
                  :autosize="{ minRows: 1, maxRows: 4 }" 
                  :minlength='1' 
                  :maxlength='255'
                  :autofocus="true"
                  v-model="commentsContent"
                  :placeholder="placeholder"
                  v-childfocus
                />
              </li>
              <li :class="$style.commentOperations">
                <p :class="$style.commentOperation" v-show="commentCount > 100">
                  <span :class="{ inputFull: commentCount > 100 }">{{ commentCount }}</span>/255
                </p>
                <Button :class="$style.commentOperation" type="text" class="sendButton" size="small" @click.native="closeCommentBox()">取消</Button>
                <Button 
                  :class="$style.commentOperation" 
                  type="primary" 
                  class="sendButton" 
                  :disabled="!commentCount" 
                  size="small" 
                  @click.native="sendComment()"
                >
                  发送
                </Button>
              </li>
            </section>
          </li>
        </ul>
      </section>
      <section slot="bottom" class="mint-loadmore-bottom">
        <span v-if="bottomAllLoaded">没有更多了</span>
        <section v-else>
          <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
          <span v-show="bottomStatus === 'loading' && !bottomAllLoaded">加载中...</span>
          <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
        </section>
      </section>
    </mt-loadmore>
  </div>
</template>
<script>
  import { NOTICE, CLEANMESSAGE } from '../stores/types';
  import { createAPI, addAccessToken, createOldAPI } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import { changeUrl, goTo } from '../utils/changeUrl';
  import timers from '../utils/timer';
  import BackIcon from '../icons/Back';
  import lodash from 'lodash';
  import { getUserInfo } from '../utils/user';
  import { resolveImage } from '../utils/resource';
  import buildURL from 'axios/lib/helpers/buildURL';
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
      topStatus: '',
      isWeiXin: TS_WEB.isWeiXin,
      formated: [],
      openId: -1,
      commentsContent: '',
      placeholder: '',
      commentLoading: false
    }),
    methods: {
      sendComment() {
        if(!this.commentCount || this.loading) return;
        this.loading = true;
        let source = this.comments[this.openId];
        // 评论来源
        let api = `feeds/${source.commentable_id}/comments`;
        if(source.commentable_type === 'news') {
          api = `news/${source.commentable_id}/comment`;
        }
        
        let comment_data = {
          body: this.commentsContent
        };

        if(source.user_id) {
          comment_data.reply_user = source.user_id
        }

        addAccessToken().post(createAPI(`${api}`),
          comment_data,
        {
          validateStatus: status => status === 201
        })
        .then( response => {
          this.commentsContent = '';
          this.loading = false;
          this.closeCommentBox();
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '评论成功',
              time: 1500,
              status: true
            });
          });
        })
      },
      openCommentBox (id) {
        this.openId = id;
        let user_id = this.formated[id].user_id;

        let item = this.$storeLocal.get(`user_${user_id}`);
        if(item === undefined) {
          getUserInfo( user_id, 30).then( user => {
            this.placeholder = `回复: ${user.name}`;
          })
        } else {
          this.placeholder = `回复: ${item.name}`;
        }
      },
      closeCommentBox () {
        this.openId = -1;
        this.commentsContent = '';
        this.placeholder = '';
      },
      changeUrl,
      goTo,
      loadTop () {
        addAccessToken().get(createAPI(`user/comments?limit=15`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(({data = []}) => {
          let comments = data;
          let newcomments = [];
          comments.forEach( comment => {
            if( this.ids.findIndex(function(value, index, arr) {
              return value == comment.id;
            }) == -1) {
              newcomments.push(comment);
            }
          });
          this._loadTopFormatedComments(newcomments);
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
        addAccessToken().get(createAPI(`user/comments?limit=15&after=${this.max_id}`),{},
          {
            validateStatus: status => status === 200
          }
        )
        .then(({data = []}) => {
          let comments = data;
          this._loadTopFormatedComments(comments, false);
          let length = comments.length;
          if(length < 15) {
            this.bottomAllLoaded = true;
          };
          this.max_id = comments[length -1].id;
          setTimeout( () => {
            if(this.$refs.loadmoreComments)
              this.$refs.loadmoreComments.onBottomLoaded();
          }, 500)
        })
      },
      _initFormatedComments () {
        let comments = this.comments;
        comments.forEach(comment => {
          let user= this.$storeLocal.get(`user_${comment.user_id}`);
          let comment_source = { ...comment.commentable};
          if(comment.reply_user) {
            let replyUser = this.$storeLocal.get(`user_${comment.reply_user}`);
            if(!replyUser) {
              getUserInfo(comment.reply_user).then( user => {
                comment.replyUser = { ...user };
              });
            } else {
              comment.replyUser = { ...replyUser };
            }
          }
          const { name = '' } = user;
          if(comment_source.images.length > 0) {
            comment.cover = buildURL(createAPI(`files/${comment_source.images[0].id}`), {w: 100, h: 100});
          }else if(comment_source.feed_content){
            comment.source_content = comment_source.feed_content;
          }
          comment.name = name;
          comment.avatar = comment.avatar || defaultAvatar;
          comment.time = timers(comment.created_at, 8, false);
          this.formated = lodash.uniq([...this.formated, comment], 'id');
        })
      },
      _loadTopFormatedComments (comments = [], top = true) {
        comments.forEach(comment => {
          // 去重
          if(lodash.findIndex(this.formated, { id: comment.id }) !== -1) return;

          let comment_source = { ...comment.commentable};
          let user = this.$storeLocal.get(`user_${comment.user_id}`);

          if(comment.reply_user) {
            let replyUser = this.$storeLocal.get(`user_${comment.reply_user}`)
            if(!replyUser) {
              getUserInfo(comment.reply_user).then( replyUser => {
                comment.replyUser = replyUser;
              });
            } else {
              comment.replyUser = { ...replyUser };
            }
          }

          const { name = '' } = user;
          if(comment_source.images.length > 0) {
            comment.cover = buildURL(createAPI(`files/${comment_source.images[0].id}`), {w: 100, h: 100});
          }else if(comment_source.feed_content){
            comment.source_content = comment_source.feed_content;
          }

          comment.name = name;
          comment.avatar = comment.avatar || defaultAvatar;
          comment.time = timers(comment.created_at, 8, false);
          if( top ) {
            this.formated = [ comment, ...this.formated ];
          } else {
            this.formated = [ ...this.formated, comment ];
          }
        });
      }
    },
    computed: {
      nothing () {
        return this.comments.length > 0 ? 0 : defaultNoBody;
      },
      commentCount () {
        return this.commentsContent.length > 0;
      }
    },
    created () {
      this.$store.dispatch(CLEANMESSAGE, cb => {
        cb('comments');
      });
      addAccessToken().get(createAPI(`user/comments?limit=15&after=${this.max_id}`),{},
        {
          validateStatus: status => status === 200
        }
      )
      .then(({data = []}) => {

        this.comments = data;

        window.TS_WEB.dataBase.transaction('rw?',
          window.TS_WEB.dataBase.commentslist,
          () => {
            this.comments.forEach( comment => {
              this.ids.push(comment.id);
              window.TS_WEB.dataBase.commentslist.where('[user_id+uid]').equals([window.TS_WEB.currentUserId, comment.user_id]).delete().then( () => {
                window.TS_WEB.dataBase.commentslist.put({
                  user_id: window.TS_WEB.currentUserId,
                  uid: comment.user_id
                })
              })
              .catch( e => {
                console.log(e)
              });
            });
          }
        );
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
        this._initFormatedComments();
      })
    }
  };
  export default Comments;
</script>
<style lang="less" module>
  .comments {
    .comment {
      border-bottom: 1px #ededed solid;
      padding: 8px;
      background-color: #fff;
      display: block;
      &:last-child {
        border-bottom: none;
      }
      .commentContent {
        display: flex;
        align-items: flex-start;
      }
      .commentBox {
        li {
          margin-top: 8px;
        }
        .commentOperations {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .commentOperation {
            margin: 0 8px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
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