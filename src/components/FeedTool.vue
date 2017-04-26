<template>
  <div :class="$style.tool">
    <Row>
      <Col span="7" :class="$style.parentCount">
        <DiggIcon v-show="isDigg" width="21" @click.native="cannelDigg" height="21" color="#f4504d" />
        <UnDiggIcon  v-show="!isDigg" @click.native="sendDigg" width="21" height="21" color="#999" />
        <i :class="$style.count">{{ friendnum(feed.tool.feed_digg_count) }}</i>
      </Col>
      <Col span="7"  @click.native="commentFeed" :class="$style.parentCount">
        <CommentIcon width="21" height="21" color="#999" />
        <i :class="$style.count">{{ friendnum(feed.tool.feed_comment_count) }}</i>
      </Col>
      <Col span="7" @click.native="router(`/feed/${feed.feed.feed_id}`)" :class="$style.parentCount">
        <ViewIcon width="21" height="21" color="#999" />
        <i :class="$style.count">{{ friendnum(feed.tool.feed_view_count) }}</i>
      </Col>
      <Col span="3" :class="$style.parentCount">
        <div>
          <MoreIcon width="21" height="21" color="#999" />
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { friendNum } from '../utils/friendNum';
  import { createAPI, addAccessToken } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import { NOTICE, COMMENTINPUT, UPDATEFEED } from '../stores/types';
  import router from '../routers/index';
  import ViewIcon from '../icons/View';
  import CommentIcon from '../icons/Comment';
  import DiggIcon from '../icons/Digg';
  import UnDiggIcon from '../icons/UnDigg';
  import MoreIcon from '../icons/More';

  const localUser = localEvent.getLocalItem('UserLoginInfo');
  const FeedTool = {
    components: {
      CommentIcon,
      ViewIcon,
      DiggIcon,
      UnDiggIcon,
      MoreIcon
    },
    props: [
      'feed',
      'user'
    ],
    data: () => ({
      comment: ''
    }),
    methods: {
      router (link) {
        router.push(link);
      },
      // 评论动态输入框
      commentFeed () {
        let to_user_name = this.user.name; // 回复谁 用户名
        let show = true; // 展示输入框
        let feed = this.feed;
        let reply_to_user_id = 0;
        this.$store.dispatch(COMMENTINPUT, cb => {
          cb({
            data: {
              show,
              reply_to_user_id,
              to_user_name,
              feed
            }
          });
        })
      },
      friendnum (num) { 
        return friendNum(num);
      },
      sendDigg () {
        let uri = `feeds/${this.feed.feed.feed_id}/digg`;
        let feed = this.feed;
        (addAccessToken().post(createAPI (uri), {}, 
          {
            validateStatus: status => status === 201
          }
        ))
        .then(response => {
          if (response.data.code === 0 || response.data.status) {
            feed.tool.is_digg_feed = 1;
            feed.tool.feed_digg_count += 1;
            this.$store.dispatch(UPDATEFEED, cb => {
              cb(feed);
            })
          }
        })
      },
      cannelDigg () {
        let feed = this.feed;
        let uri = `feeds/${this.feed.feed.feed_id}/digg`;
        addAccessToken().delete(createAPI (uri), 
          {
            validateStatus: status => status === 204
          }
        )
        .then(response => {
          feed.tool.is_digg_feed = 0;
          feed.tool.feed_digg_count -= 1;
          this.$store.dispatch(UPDATEFEED, cb => {
            cb(feed);
          })
        })
      }
    },
    computed: {
      isDigg () {
        return this.feed.tool.is_digg_feed;
      },
      currentUser () {
        return localEvent.getLocalItem('UserLoginInfo');
      }
    }
  }

  export default FeedTool;
</script>

<style lang="scss" module>
  .tool {
    .commentInput{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 6;
      background-color: #fff;
      border-bottom: 1px #59b6d7 solid;
      border: none;
      padding: 10px 0;
      textarea {
        min-height: 34px!important;
      }
    }
    .wrapper{
      background-color: rgba(0, 0, 0, .3);
      z-index: 5;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      position: fixed;
      overflow: auto;
      margin: 0;
    }
    .sendComment {
      font-size: 14px;
      padding: 3px!important;
      background-color: #59b6d7;
      &[disabled] {
        background-color: #ccc!important;
        color: #fff!important;
      }
    }
    .userName {
      font-size: 13px;
      color: #333;
    }
    .commentContent{
      font-size: 14px;
      color: #999;
    }
    .parentCount {
      display: flex;
      align-items: center;
      .count {
        padding-left: 4px;
        color: #999;
        font-style: normal
      }
      &:last-child {
        justify-content: flex-end;
      }
    }
  }
</style>

<style lang="css">
  .commentInput {
    border: none;
  }
  .ivu-icon {
    font-size: 20px!important;
  }
</style>
