<template>
  <div :class="$style.tool">
    <div :class="$style.toolItem">
      <DiggIcon v-show="isDigg" width="21" @click.native="cannelDigg" height="21" color="#f4504d" />
      <UnDiggIcon  v-show="!isDigg" @click.native="sendDigg" width="21" height="21" color="#999" />
      <span :class="$style.count">{{ friendnum(feed.tool.feed_digg_count) }}</span>
    </div>
    <div :class="$style.toolItem" @click="commentFeed">
      <CommentIcon width="21" height="21" color="#999" />
      <span :class="$style.count">{{ friendnum(feed.tool.feed_comment_count) }}</span>
    </div>
    <div :class="$style.toolItem" @click="router(`/feed/${feed.feed.feed_id}`)">
      <ViewIcon width="21" height="21" color="#999" />
      <span :class="$style.count">{{ friendnum(feed.tool.feed_view_count) }}</span>
    </div>
    <div :class="$style.toolItem">
      <MoreIcon width="21" height="21" color="#999" />
    </div>
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
    display: flex;
    align-items: center;
    .toolItem {
      width: 30vw;
      display: flex; 
      align-items: center;
      .count {
        padding-left: 4px;
        color: #999;
        font-style: normal
      }
      &:last-child {
        width: 10vw;
        justify-content: flex-end;
      }
    }
  }
</style>
