<template>
  <div :class='prefixCls'>
    <head-top :go-back='true' title='发帖' :append='true'>
      <button slot='prepend' :class="`${prefixCls}-btn`" @click='goBack'>取消</button>
      <button slot='append' :class="`${prefixCls}-btn`" :disabled="disabled" @click='postFeed'>发布</button>
    </head-top>
    <div></div>
    <div :class="`${prefixCls}-content`">
      <template v-if='!!groupID'>
        <div :class="`${prefixCls}-group`">

        </div>
      </template>
      <div :class="`${prefixCls}-title`">
        <input type="text" v-model='title' placeholder='输入标题, 20字以内' maxlength="20">
      </div>
      <div :class="`${prefixCls}-body`">
        <textarea placeholder="输入要说的话, 图文结合更精彩哦" v-model='body' ref='body'></textarea>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import calcTextareaHeight from '@/util/calcTextareaHeight'
import HeadTop from '@/components/HeadTop'
const prefixCls = 'post--group-feed'
export default {
  name: 'postGroupFeed',
  components: {
    HeadTop
  },
  data() {
    return {
      groupID: this.$route.params.groupID,
      prefixCls,
      title: '',
      body: ''
    }
  },
  watch: {
    body(val) {
      this.$nextTick(() => {
        this.resizeTextarea(this.$refs.body)
      })
    }
  },
  computed: {
    disabled() {
      return !(this.title.length > 0 && this.body.length > 0)
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    resizeTextarea(el) {
      el.style.height = calcTextareaHeight(el).height
    },
    postFeed() {
      const params = {
        title: this.title,
        body: this.body
      }
      // /groups/:group/posts
      this.$http.post(`/plus-group/groups/${this.$router}`, {
        params
      }).then(({ data = [] }) => {
        console.log(data)
      })
    }
  }
}

</script>
<style lang='less'>
@post-group-feed-prefix: post--group-feed;
.@{post-group-feed-prefix} {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  &-btn {
    font-size: 32px;
    background-color: #fff;
    color: #59b6d7;
    &[disabled] {
      color: #ccc
    }
  }
  &-content {
    padding: 0 30px;
    height: calc(~'100vh -' 90px);
    background-color: #fff;
  }

  &-title {
    display: flex;
    align-items: conter;
    height: 100px;
    border-bottom: 1px solid #dedede;
    /*no*/
    input {
      font-size: 30px;
      padding: 0 20px;
      height: 100%;
      width: 100%;
    }
  }

  &-body {
    max-height: calc(~'100% -' 100px);
    overflow-y: scroll;
    textarea {
      font-size: 30px;
      padding: 20px;
      width: 100%;
      min-height: 400px;
      max-height: 100%;
      resize: none;
    }
  }
}

</style>
