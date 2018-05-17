<template>
  <section class="m-box m-aln-center m-justify-bet m-main group-item" @click="beforeViewDetail">
    <div class="m-flex-grow0 m-flex-shrink0 group-item-avatar">
      <img :src="avatar">
    </div>
    <div class="m-flex-grow1 m-flex-shrink1 group-item-info">
      <div class="m-box m-aln-center m-text-cut">
        <h2>{{ name }}</h2>
        <svg class="m-style-svg m-svg-def" v-if="mode === 'paid'">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#id"></use>
        </svg>
      </div>
      <p>
        <span>帖子<em>{{ feedCount | formatNum }}</em></span>
        <span>成员<em>{{ memberCount | formatNum }}</em></span>
      </p>
    </div>
    <div class="m-box m-aln-center m-flex-grow0 m-flex-shink0 group-item-role" v-if="showRole && role">
      <span>{{ role }}</span>
    </div>
    <div class="m-box m-aln-center m-flex-grow0 m-flex-shink0 group-item-action" v-if="showAction">
      <button 
        class="m-text-cut"
        v-if="!joined || joined.audit === 0"
        :disabled="loading || joined.audit === 0"
        @click.stop="beforeJoined">
        <svg 
        v-if="!(joined.audit ===0)"
        class="m-style-svg m-svg-def"
        :style="loading ? {} : {width: '0.2rem', height:'0.2rem'}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#${loading?'base-loading':'foot-plus'}`"></use>
        </svg>
        <span>{{ joined.audit === 0 ? "审核中" : "加入" }}</span>
      </button>
    </div>
  </section>
</template>

<script>
import bus from "@/bus.js";
import { joinGroup } from "@/api/group.js";
export default {
  name: "group-item",
  props: {
    group: {
      type: Object,
      requirted: true
    },
    showAction: {
      type: Boolean,
      default: true
    },
    showRole: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    avatar() {
      return this.group.avatar;
    },
    name() {
      return this.group.name;
    },
    feedCount() {
      return this.group.posts_count || 0;
    },
    memberCount() {
      return this.group.users_count || 0;
    },
    mode() {
      return this.group.mode;
    },
    money() {
      return this.group.money || 0;
    },
    joined() {
      return this.group.joined || false;
    },
    role() {
      return typeof this.group.joined === "object" ? this.joined.role : false;
    }
  },
  methods: {
    beforeJoined() {
      if (this.joined || this.loading) return;
      this.loading = true;
      this.mode === "paid" && this.money > 0
        ? bus.$emit("payfor", {
            title: "申请加入圈子",
            confirmText: "支付并加入",
            amount: this.money,
            content: `你只需支付${this.money}积分来加入圈子`,
            onOk: () => {
              joinGroup(this.group.id).then(
                ({ data: { message = "加圈成功" } }) => {
                  this.$Message.success(message);
                  this.loading = false;
                  this.group.joined = true;
                }
              );
            },
            onCancel: () => {
              this.loading = false;
            }
          })
        : joinGroup(this.group.id).then(() => {
            this.loading = false;
            this.group.joined = true;
          });
    },
    beforeViewDetail() {
      this.joined
        ? this.joined.audit === 1
          ? this.$router.push(`/groups/${this.group.id}`)
          : this.$Message.error("审核通过后，才能查看圈子信息哦~")
        : this.mode === "paid"
          ? this.$Message.error("需要先加入圈子，才能查看圈子信息哦~")
          : this.$router.push(`/groups/${this.group.id}`);
    }
  }
};
</script>

<style lang="less">
.group-item {
  padding: 30px 20px;
  &-info {
    margin-left: 20px;
    margin-right: 20px;

    h2 {
      font-size: 32px;
      line-height: normal;
      margin: 15px 0;
    }

    span {
      color: @text-color3;
      + span {
        margin-left: 25px;
      }
    }

    em {
      color: @primary;
      margin: 0 5px;
    }
  }
  &-avatar {
    overflow: hidden;

    width: 120px;
    height: 120px;
    background-color: @gray-bg;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.group-item-action {
  button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 126px;
    height: 50px;

    border: 1px solid currentColor; /*no*/
    border-radius: 8px;
    background-color: #fff;

    font-size: 24px;
    color: @primary;
    transition: all 0.3s ease;
    span {
      transition: all 0.3s ease;
      margin-left: 5px;
    }
    &[disabled] {
      color: @border-color;
      cursor: not-allowed;
      span {
        color: @text-color3;
      }
      svg {
        opacity: 0.5;
      }
    }
  }
}
</style>
