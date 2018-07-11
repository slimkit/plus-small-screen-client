<template>
  <div class="p-profile">
    <header class="m-box m-aln-center m-justify-center m-main m-pos-f m-bb1 m-head-top">我</header>
    <main
      class="m-box-model"
      style="padding-top: .9rem">
      <div class="m-box-model m-main m-pr-info">
        <router-link
          tag="section"
          class="m-box m-aln-center"
          to="/info">
          <avatar
            :user="user"
            size="big" />
          <div class="m-text-box m-flex-grow1 m-flex-shrink1 m-flex-base0 m-pr-user-info">
            <h4 class="m-pr-username">{{ user.name }}</h4>
            <p class="m-pr-bio m-text-cut-2">{{ user.bio || "这家伙很懒,什么也没有留下" }}</p>
          </div>
          <svg class="m-style-svg m-svg-def m-entry-append">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#base-arrow-r"/>
          </svg>
        </router-link>
        <div class="m-box m-aln-center m-justify-aro m-bt1 m-pr-extra-box">
          <router-link
            :to="`/users/${user.id}/followers`"
            tag="div"
            class="m-box-model m-aln-center m-justify-center m-flex-grow1 m-pr-extra">
            <v-badge :count="new_followers">
              <a>{{ ~~(extra.followers_count) | formatNum }}</a>
            </v-badge>
            <p>粉丝</p>
          </router-link>
          <router-link
            :to="`/users/${user.id}/followings`"
            tag="div"
            class="m-box-model m-aln-center m-justify-center m-flex-grow1 m-pr-extra">
            <v-badge count="0">
              <a>{{ ~~(extra.followings_count) | formatNum }}</a>
            </v-badge>
            <p>关注</p>
          </router-link>
        </div>
      </div>
      <div class="m-box-model m-pr-entrys">
        <ul class="m-box-model m-entry-group">
          <router-link
            :to="`/users/${user.id}`"
            tag="li"
            class="m-entry">
            <svg class="m-style-svg m-svg-def m-entry-prepend">
              <use xlink:href="#profile-home"/>
            </svg>
            <span class="m-text-box m-flex-grow1">个人主页</span>
            <svg class="m-style-svg m-svg-def m-entry-append">
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#base-arrow-r"/>
            </svg>
          </router-link>
          <router-link
            to="/profile/news/released"
            tag="li"
            class="m-entry">
            <svg class="m-style-svg m-svg-def m-entry-prepend">
              <use xlink:href="#profile-plane"/>
            </svg>
            <span class="m-text-box m-flex-grow1">我的投稿</span>
            <svg class="m-style-svg m-svg-def m-entry-append">
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#base-arrow-r"/>
            </svg>
          </router-link>
          <!--           <router-link to="/upgrade" tag="li" class="m-entry">
            <svg class='m-style-svg m-svg-def m-entry-prepend'>
              <use xlink:href="#profile-question"></use>
            </svg>
            <span class="m-text-box m-flex-grow1">我的问答</span>
            <svg class="m-style-svg m-svg-def m-entry-append">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
            </svg>
          </router-link> -->
          <!--           <router-link to="/own/groups" tag="li" class="m-entry">
            <svg class='m-style-svg m-svg-def m-entry-prepend'>
              <use xlink:href="#profile-group"></use>
            </svg>
            <span class="m-text-box m-flex-grow1">我的圈子</span>
            <svg class="m-style-svg m-svg-def m-entry-append">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
            </svg>
          </router-link> -->
        </ul>
        <ul class="m-box-model m-entry-group">
          <!-- to="/wallet" tag="li" -->
          <li class="m-entry">
            <svg class="m-style-svg m-svg-def m-entry-prepend">
              <use xlink:href="#profile-wallet"/>
            </svg>
            <span class="m-text-box m-flex-grow1">钱包</span>
            <span class="m-entry-extra">{{ new_balance }}</span>
            <!--             <svg class="m-style-svg m-svg-def m-entry-append">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
            </svg> -->
          </li>
          <!-- to="/upgrade" tag="li" -->
          <li class="m-entry">
            <svg class="m-style-svg m-svg-def m-entry-prepend">
              <use xlink:href="#profile-integral"/>
            </svg>
            <span class="m-text-box m-flex-grow1">{{ currency_name }}</span>
            <span class="m-entry-extra">{{ sum }}</span>
            <!--             <svg class="m-style-svg m-svg-def m-entry-append">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
            </svg> -->
          </li>
          <router-link
            to="/profile/collection/feeds"
            tag="li"
            class="m-entry">
            <svg class="m-style-svg m-svg-def m-entry-prepend">
              <use xlink:href="#profile-collect"/>
            </svg>
            <span class="m-text-box m-flex-grow1">收藏</span>
            <svg class="m-style-svg m-svg-def m-entry-append">
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#base-arrow-r"/>
            </svg>
          </router-link>
        </ul>
        <ul class="m-box-model m-entry-group">
          <!-- to="/upgrade" tag="li" -->
          <li
            class="m-entry"
            @click="selectCertType">
            <svg class="m-style-svg m-svg-def m-entry-prepend">
              <use xlink:href="#profile-approve"/>
            </svg>
            <span class="m-text-box m-flex-grow1">认证</span>
            <span class="m-entry-extra">{{ verifiedText }}</span>
            <svg class="m-style-svg m-svg-def m-entry-append">
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#base-arrow-r"/>
            </svg>
          </li>
          <router-link
            to="/setting"
            tag="li"
            class="m-entry">
            <svg class="m-style-svg m-svg-def m-entry-prepend">
              <use xlink:href="#profile-setting"/>
            </svg>
            <span class="m-text-box m-flex-grow1">设置</span>
            <svg class="m-style-svg m-svg-def m-entry-append">
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#base-arrow-r"/>
            </svg>
          </router-link>
        </ul>
      </div>
    </main>
    <foot-guide/>
  </div>
</template>

<script>
import bus from "@/bus";
import _ from "lodash";
import { mapState } from "vuex";
import { resetUserCount } from "@/api/message.js";
import { refreshCurrentUserInfo } from "@/api/user.js";

export default {
  name: "Profile",
  data() {
    return {
      verifiedText: ""
    };
  },
  computed: {
    ...mapState({
      new_followers: state => state.MESSAGE.NEW_UNREAD_COUNT.following || 0,
      new_mutual: state => state.MESSAGE.NEW_UNREAD_COUNT.mutual || 0,
      CONFIG: state =>
        state.CONFIG || { site: { currency_name: { name: "积分" } } },
      user: state => state.CURRENTUSER,
      verified: state => state.USER_VERIFY
    }),
    currency_name() {
      return this.CONFIG.site.currency_name.name;
    },
    extra() {
      return this.user.extra || {};
    },
    new_wallet() {
      return this.user.new_wallet || { balance: 0 };
    },
    new_balance() {
      return (this.new_wallet.balance / 100).toFixed(2);
    },
    currency() {
      return this.user.currency || { sum: 0 };
    },
    sum() {
      return this.currency.sum;
    }
  },
  watch: {
    verified(to) {
      if (to && to.status === 0) {
        this.verifiedText = "待审核";
      } else if (to && to.status === 1) {
        this.verifiedText = "通过审核";
      } else if (to && to.status === 2) {
        this.verifiedText = "被驳回";
      } else {
        this.verifiedText = "未认证";
      }
    }
  },
  mounted() {
    refreshCurrentUserInfo();
    this.$store.dispatch("FETCH_USER_VERIFY");
    this.$store.dispatch("GET_NEW_UNREAD_COUNT");
  },
  beforeRouteLeave(to, from, next) {
    const {
      params: { type }
    } = to;
    const resetType =
      type === "followers" ? "following" : type === "mutual" ? "mutual" : "";
    resetType && resetUserCount(resetType);
    next();
  },
  methods: {
    selectCertType() {
      if (_.isEmpty(this.verified) || this.verified.status === 2) {
        const actions = [
          { text: "个人认证", method: () => this.certificate("user") },
          { text: "企业认证", method: () => this.certificate("org") }
        ];
        bus.$emit("actionSheet", actions, "取消");
      } else {
        this.$router.push({ path: "/profile/certification" });
      }
    },
    /**
     * 认证
     * @param {string} type 认证类型 (user|org)
     */
    certificate(type) {
      this.$router.push({ path: "/profile/certificate", query: { type } });
    }
  }
};
</script>

<style lang="less" scoped>
.m-pr-info {
  padding: 30px;
}
.m-pr-extra {
  font-size: 28px;
  p {
    margin-top: 15px;
  }
  & + & {
    border-left: 1px solid @border-color; /*no*/
  }
  &-box {
    margin-top: 30px;
    padding-top: 30px;
  }
}
.m-pr-user-info {
  margin-left: 30px;
  margin-right: 30px;
  line-height: 40px;
  .m-pr-username {
    font-size: 32px;
    color: @text-color1;
  }
  .m-pr-bio {
    overflow: hidden;
    max-height: 40 * 2px;
    font-size: 28px;
    color: @text-color3;
    text-overflow: ellipsis;
  }
}
.m-pr-entrys {
  margin-top: 30px;
  margin-bottom: 30px;
  .m-entry-group {
    padding: 0 30px;
  }

  .m-entry-extra {
    margin: 0;

    + .m-entry-append {
      margin-left: 10px;
    }
  }
}
</style>
