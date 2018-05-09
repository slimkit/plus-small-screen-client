<template>
  <div class="card">
    <div class="card-wrap">
      <div class="card-main">
        <div class="m-box">
          <avatar :user="user" />
          <div class="m-box-dir m-box-col card-txt-body">
            <div class="m-box m-box-c">
              <router-link tag='h4' :to='`/users/${user.id}`'>{{ user.name }}</router-link>
              <div class="m-box m-box-c">
                <i class="pinned-icon" v-if='pinned'></i>
                <span class="time">{{ time | time2tips }}</span>
              </div>
            </div>
            <div class="m-text-box">
              <span v-if='reply'>回复<router-link :to='`/users/${reply.id}`'>{{ reply.name }}</router-link>:</span>
              {{ body }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "comment-card",
  props: {
    comment: {},
    pinned: {
      type: Boolean,
      default: !1
    }
  },
  data() {
    return {};
  },
  computed: {
    user() {
      return this.comment.user || {};
    },
    reply() {
      return this.comment.reply;
    },
    body() {
      return this.comment.body || "";
    },
    time() {
      return this.comment.created_at || "";
    }
  },
  methods: {}
};
</script>

<style lang="less">
.card {
  background-color: #fff;
  border-top: 1px solid #ededed; /*no*/
  .m-avatar-box {
    margin-right: 30px;
  }
  &-wrap {
    margin-left: 20px;
    margin-right: 20px;
  }
  &-main {
    padding-top: 40px;
    padding-bottom: 40px;
  }
  &-txt-body {
    margin-top: 5px;
  }
  h4 {
    flex: 1;
    margin: 0;
    font-size: 26px;
    line-height: 36px;
    font-weight: normal;
  }
  .time {
    color: #ccc;
    font-size: 24px;
    line-height: normal;
  }
  .pinned-icon {
    margin-right: 10px;
    padding: 5px 10px;
    font-style: normal;
    display: inline-block;
    font-size: 20px;
    color: #4bb893;
    border: 1px solid currentColor;
    -webkit-transform-origin-x: 0;
    -webkit-transform: scale(0.95);
    -ms-transform: scale(0.95);
    -o-transform: scale(0.95);
    transform: scale(0.95);
    &:after {
      content: "置顶";
    }
  }
}

.m-box {
  display: flex;
  &-dir {
    display: flex;
    flex-direction: column;
  }
  &-c {
    align-items: center;
  }
  &-col {
    flex: 1;
  }
}
.m-text-box {
  color: #999;
  font-size: 26px;
  line-height: 40px;
  a {
    color: #000;
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>
