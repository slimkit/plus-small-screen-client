<template>
  <div :class="`${prefixCls}`">
    <head-top :go-back='true' title='发布动态' :append='true'>
      <button slot='prepend' :class="`${prefixCls}-btn`" @click='goBack'>取消</button>
      <button slot='append' :class="`${prefixCls}-btn`" :disabled="disabled" @click='submit'>发布</button>
    </head-top>
    <div></div>
    <div :class="`${prefixCls}-content`">
      <div :class="`${prefixCls}-body`">
        <textarea maxlength="254" v-txtautosize v-model='feed_content' placeholder="输入要说的话" />
      </div>
      <div :class="`${prefixCls}-extra`">
        <div :class="`${prefixCls}-switch`">
          <vSwitch type="checkbox" v-model="pinned" id="postfeed">
            <slot>是否收费</slot>
          </vSwitch>
        </div>
        <section v-if="pinned">
          <div :class="`${prefixCls}-options`">
            <p class="tips">设置文字收费金额</p>
            <div :class="`${prefixCls}-options-items`">
              <button
                v-for="item in items"
                :key="item"
                @click="chooseItem(item)"
                :class="{'selected': parseInt(item) == itemChoose}"
              >
                {{ item }}
              </button>
            </div>
          </div>
          <div :class="`${prefixCls}-switch`">
            <div class="form-group">
              <div class="form-row">
                <label for="inputAmount">自定义金额</label>
                <input class="input" name="inputAmount" dir="rtl" type="number" v-model.number="inputAmount" maxlength="20" placeholder="输入金额" />
                <label for="inputAmount">金币</label>
              </div>
            </div>
          </div>
          <div :class="`${prefixCls}-options`">
            <p class="tips">{{ tips }}</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 发布文字动态
 */
const prefixCls = "postTextFeed";
export default {
  name: "postTextFeed",
  data: () => ({
    feed_content: "",
    amount: 0,
    inputAmount: "",
    pinned: false,
    prefixCls,
    itemChoose: 0
  }),
  watch: {
    inputAmount: {
      handler: function(val) {
        if (val !== "") {
          this.amount = parseInt(val);
          this.itemChoose = 0;
        }
      },
      deep: true,
      immediate: true
    },
    itemChoose: {
      handler: function(val) {
        if (val !== 0) {
          this.amount = parseInt(val);
          this.inputAmount = "";
        }
      },
      deep: true,
      immediate: true
    },
    pinned: {
      handler: function(val) {
        if (val === false) {
          this.amount = 0;
          this.inputAmount = "";
          this.itemChoose = 0;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * 选择后台配置的数值
     * @Author   Wayne
     * @DateTime 2018-03-09
     * @Email    qiaobin@zhiyicx.com
     * @param    {[type]}            value [description]
     * @return   {[type]}                  [description]
     */
    chooseItem(value) {
      this.itemChoose = parseInt(value);
      this.amount = parseInt(value);
    },
    /**
     * 发送
     * @Author   Wayne
     * @DateTime 2018-03-08
     * @Email    qiaobin@zhiyicx.com
     * @return   {[type]}            [description]
     */
    submit() {
      const { feed_content, amount, pinned } = this;
      if (pinned && amount === 0) {
        this.$Message.error(`请设置收费金额`);
        return false;
      }
      if (
        pinned &&
        feed_content.length <= this.$store.state.CONFIG.feed.limit
      ) {
        this.$Message.error(`内容太短,无法收费`);
        return false;
      }
      this.$http
        .post(
          "feeds",
          {
            feed_content,
            feed_from: 2,
            feed_mark:
              new Date().valueOf() + "" + this.$store.state.CURRENTUSER.id
          },
          {
            validateStatus: s => s === 201
          }
        )
        .then(({ data }) => {
          this.$Message.success(data);
          setTimeout(() => {
            this.feed_content = "";
            this.amount = 0;
            this.pinned = false;
            this.goBack();
          }, 3000);
        })
        .catch(error => {
          console.log(error);
        });
    },

    goBack() {
      this.$router.go(-1);
    }
  },

  computed: {
    disabled() {
      return !(this.feed_content.length > 0);
    },
    tips() {
      return `注: 超过${this.$store.state.CONFIG.feed.limit ||
        50}字部分内容收费`;
    },
    items() {
      return this.$store.state.CONFIG.feed.items || [];
    }
  },

  created() {}
};
</script>
<style lang="less">
@post-text-feed: postTextFeed;
.@{post-text-feed} {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  &-btn {
    font-size: 32px;
    background-color: #fff;
    color: #59b6d7;
    &:focus {
      border: none;
      box-shadow: none;
    }
    &[disabled] {
      color: #ccc;
    }
  }
  &-content {
    height: calc(~"100vh -" 90px);
    background-color: #fff;
    font-size: 30px;
  }

  &-body {
    max-height: calc(~"100% -" 100px);
    overflow-y: scroll;
    padding: 0 30px;
    textarea {
      font-size: 30px;
      padding: 20px;
      width: 100%;
      min-height: 400px;
      max-height: 100%;
      resize: none;
    }
  }
  &-switch {
    padding: 0 20px;
    border-top: 1px solid #ededed;
    border-bottom: 1px solid #ededed;
    line-height: 98px;
    .form-row {
      display: flex;
      flex: 1 1 auto;
      justify-content: space-between;
      padding: 0 20px;
      align-items: center;
      .input {
        width: 65%;
      }
    }
  }
  &-options {
    padding: 0 40px;
    .tips {
      color: #999;
      font-size: 26px;
      padding-left: 0;
      padding: 1em 0;
      margin: 0;
    }
    &-items {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.3rem;
      button {
        padding: 0.2rem 0.7rem;
        border-radius: 0.06rem;
        background: none;
        border: 1px solid #dedede;
        &.selected {
          color: #59b6d7;
          border-color: #59b6d7;
        }
      }
    }
  }
}
</style>
