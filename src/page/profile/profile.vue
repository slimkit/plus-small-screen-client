<template>
  <div :class="prefixCls">
    <head-top title='我'></head-top>
    <div></div>
    <div :class="`${prefixCls}--head`">
      <div :class="`${prefixCls}--head-inner`">
        <v-avatar size='large' :sex='user.sex' :src='user.avatar'></v-avatar>
        <div :class="`${prefixCls}--base-info`">
          <h2 :class="`${prefixCls}--name`">{{ user.name }}</h2>
          <p :class="`${prefixCls}--bio`">{{ user.bio|| '这家伙很懒, 什么也没留下'}}</p>
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
          </svg>
        </div>
      </div>
      <div :class="`${prefixCls}--head-inner`">
        <router-link
        :to="{
          path: `user/${this.user.id}/fans`,
          query: {
            type: 'followers'
          }
        }"
        :class="`${prefixCls}--count`"
        >
          <v-badge count='0'>
            <div class="num">{{ extra.followers_count || 0 | formatNum }}</div>
          </v-badge>
          <p>粉丝</p>
        </router-link>
        <router-link
        :to="{
          path: `user/${this.user.id}/fans`,
          query: {
            type: 'followings'
          }
        }"
        :class="`${prefixCls}--count`"
        >
          <v-badge count='0'>
            <div class="num">{{ extra.followings_count || 0 | formatNum }}</div>
          </v-badge>
          <p>关注</p>
        </router-link>
        <router-link
        v-if='verified'
        :to="{
          path: `user/${this.user.id}/fans`,
          query: {
            type: 'students'
          }
        }"
        :class="`${prefixCls}--count`"
        >
          <v-badge count='0'>
            <div class="num">{{ extra.students_count || 0 | formatNum }}</div>
          </v-badge>
          <p>学员</p>
        </router-link>
      </div>
    </div>
    <!-- 入口配置 -->
    <ul class="entry__group padding">
      <router-link tag='li' class="entry__item" :to='`/user/${user.id}`'>
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile-home"></use>
        </svg>
        <span>个人主页</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
      <router-link tag='li' class="entry__item" :to='`/user/${user.id}/news?type=0`'>
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile-plane"></use>
        </svg>
        <span>{{ verified ? '我' : '看过' }}的头条</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
      <router-link tag='li' class="entry__item" :to='`/user/${user.id}/product?type=0`'>
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile-product"></use>
        </svg>
        <span>{{ verified ? '我' : '看过' }}的产品</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
      <router-link
      tag='li'
      class="entry__item"
      :to='`/user/${user.id}/course`'>
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile-course"></use>
        </svg>
        <span>{{ verified ? '我' : '看过' }}的课程</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
    </ul>
    <ul class="entry__group padding">
      <router-link tag='li' class="entry__item" :to='`/user/${user.id}/questions`'>
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile-question"></use>
        </svg>
        <span>我的问答</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
      <router-link
      tag='li'
      class="entry__item"
      to='/wallet'>
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile-wallet"></use>
        </svg>
        <span>钱包</span>
        <span>{{ balance }}</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
      <router-link
      tag='li'
      class="entry__item"
      to='/collect'>
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile-collect"></use>
        </svg>
        <span>收藏</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
    </ul>
    <ul class="entry__group padding">
      <li
      class="entry__item"
      >
      <!-- tag='li' -->
      <!-- to='/verification' -->
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile-approve"></use>
        </svg>
        <span>认证</span>
        <span>{{ verified ? '已认证' : '未认证' }}</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </li>
      <router-link
      tag='li'
      class="entry__item"
      to='/setting'>
        <svg class='entry__item--prepend'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile-setting"></use>
        </svg>
        <span>设置</span>
        <svg class='entry__item--append'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </router-link>
    </ul>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
const prefixCls = 'profile';
export default {
  name: 'profile',
  data() {
    return {
      prefixCls,
      has_fans: true
    };
  },
  computed: {
    user() {
      return this.$store.state.CURRENTUSER;
    },
    balance() {
      const {
        site: { gold_name: { name = '金币' } = {} } = {}
      } = this.$store.state.CONFIG;
      return (+this.wallet.balance || 0).toFixed(2) + name;
    },
    wallet() {
      return this.user.wallet || {};
    },
    extra() {
      return this.user.extra || {};
    },
    verified() {
      return this.user.verified;
    },
    students() {
      return this.user.students;
    }
  },
  methods: {
    initData() {
      console.log('refreshUser');
    }
  },
  mounted() {
    this.initData();
  }
};
</script>
<style lang='less' src='./style/profile.less'>

</style>
