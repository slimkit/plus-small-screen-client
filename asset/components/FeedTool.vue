<template>
  <div :class="$style.tool">
    <Row>
      <i-col :span="7">
        <i class="iconfont icon-digg" :class="{ digg: isDigg }" @click.stop="!toolData.is_digg_feed ? sendDigg() : cannelDigg()">
          <span class="count">{{ friendnum(toolData.feed_digg_count) }}</span>
        </i>
      </i-col>
      <i-col :span="7">
        <i class="iconfont icon-comment">
          <span class="count">{{ friendnum(toolData.feed_comment_count) }}</span>
        </i>
      </i-col>
      <i-col :span="7">
        <i class="iconfont icon-view">
          <span class="count">{{ friendnum(toolData.feed_view_count) }}</span>
        </i>
      </i-col>
      <i-col :span="3" style="text-align: right">
        <i class="iconfont icon-more"></i>
      </i-col>
    </Row>
    {{ datas }}
  </div>
</template>

<script>
  import { friendNum } from '../utils/friendNum';
  import { createAPI, addAccessToken } from '../utils/request';

  const FeedTool = {
    props: [
      'toolDatas',
      'feedId'
    ],
    data: () => ({
      toolData: {}
    }),
    methods: {
      friendnum (num) { 
        return friendNum(num);
      },
      sendDigg () {
        let uri = `feeds/${this.feedId}/digg`;
        (addAccessToken().post(createAPI (uri), {}, 
          {
            validateStatus: status => status === 201
          }
        ))
        .then(response => {
          let isDigged = this.toolData.is_digg_feed;
          if (response.data.code === 0 || response.data.status) {
            this.toolData.is_digg_feed = true;
            this.toolData.feed_digg_count += 1;
          }
        })
        .catch(({ response: { data = {} } = {} } ) => {
          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          // this.isLoading = false;
          // this.errors = Object.assign({}, this.errors, { code: errorCodes[code] });
        });
      },
      cannelDigg () {
        let uri = `feeds/${this.feedId}/digg`;
        addAccessToken().delete(createAPI (uri), 
          {
            validateStatus: status => status === 204
          }
        )
        .then(response => {
          this.toolData.is_digg_feed = false;
            this.toolData.feed_digg_count -= 1;
        })
        .catch(error => {
          console.log(error)
        })
      }
    },
    computed: {
      isDigg () {
        return this.toolData.is_digg_feed;
      }
    },
    beforeMount () {
      this.toolData = Object.assign({}, this.toolData, this.toolDatas);
    }
  }

  export default FeedTool;
</script>

<style lang="scss" module>
  .tool {
    position: relative;
    z-index: 2;
  }
</style>
