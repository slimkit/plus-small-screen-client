<template>
  <div :class="$style.detail" id="feed-{ feed.id }">
    <el-row>
      <el-col :span="3" offset="1">
        <div class="grid-content bg-purple">
          <img src="../statics/images/avatar.jpg" alt="" style="width:100%; border-radius:50%">
        </div>
      </el-col>
      <el-col :span="18" offset="1">
        <div class="grid-content bg-purple">
          <el-row :class="$style.usernameLine">
            <el-col :span="19">
              <router-link :class="$style.username" :to="{ path: '/users/profile' }">{{ user.name }}</router-link>
            </el-col>
            <el-col :span="5" :class="$style.timer">
              <timeago :since="timer"></timeago>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <router-link v-if="feedInfo.feed_title" :to="{ path: `/feeds/detail/${feed_id}` }" class="feedTitle">{{ feedInfo.feed_title }}</router-link>
              <div :class="$style.content">
                {{ feedInfo.feed_content }}
              </div>
              <div v-if="feedInfo.storages.length" v-for="storage in feedInfo.storages">
                <img :src="getImg(storage.storage_id)" />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { createRequestURI, createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import { getUserInfo } from '../utils/user';

  const feedinfo = {
    props: [
      'feed'
    ],
    data: () => ({
      feedInfo: {},
      toolInfo: {},
      commentInfo: {},
      timer: 0,
      feed_id: 0,
      user: {}
    }),
    methods: {
      getImg (id, process = 50) {
        return createRequestURI(`api/v1/storages/${id}/${process}`);
      }
    },
    mounted () {
      this.timer = new Date(this.feed.feed.created_at.replace(/-/g, "/"));
      this.feed_id = this.feed.feed.feed_id;
      this.user = localEvent.getLocalItem('user_' + this.feed.user_id);
      if(this.user.length == 0) {
        getUserInfo(this.feed.user_id, user => {
          this.user = user;
        });
      }
      this.feedInfo = Object.assign({}, this.feedInfo, this.feed.feed);
    },
    beforeUpdate () {
      console.log(111);
    },
    updated () {
      console.log(222);
    }
  }

  export default feedinfo;
</script>

<style lang="scss" module>
  .detail {
    background-color: #fff;
    margin-bottom: 4px;
    padding: 10px 0;
    border-bottom: 1px #dedede solid;
  }
  .usernameLine {
    margin-bottom: 6px;
  }
  .username {
    color: #333;
    font-size: 16px;
  }
  .content {
    font-size: 14px;
    color: #666;
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;  
    display: -webkit-box;  
    -webkit-line-clamp: 3;  
    -webkit-box-orient: vertical;
  }
  .timer {
    text-align: right;
    color: #ccc;
    font-size: 12px;
  }
</style>