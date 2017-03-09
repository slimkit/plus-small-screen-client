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
            <el-col :span="19" :class="$style.username">
              你的名字
            </el-col>
            <el-col :span="5" :class="$style.timer">
              29天前
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <router-link v-if="feed.title" to="/feeds/{feed.id}/detail/" class="feedTitle">{{ feedInfo.title }}</router-link>
              <div :class="$style.content">
                {{ feedInfo.content }}
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  const feedinfo = {
    props: [
      'feed'
    ],
    data: () => ({
      feedInfo: {},
      feedIndex: 0
    }),
    created () {
      this.feedInfo = Object.assign({}, this.feedInfo, this.$props.feed);
    }
  }

  export default feedinfo;
</script>

<style lang="scss" module>
  .detail {
    background-color: #fff;
    margin-bottom: 3px;
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