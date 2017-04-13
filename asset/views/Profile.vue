<template>
  <div :class="$style.profile">
    <div :class="$style.header">
      我
    </div>
    <!-- 头像+昵称+简介-->
    <div :class="$style.simpleInfo" @click="changeUrl('/users/setting')">
      <Row :gutter="16" :class="$style.rowCenter">
        <!-- 头像 -->
        <Col span="6" :class="$style.colCenter">
          <img v-lazy="avatar" :class="$style.avatar" alt="name">
        </Col>
        <!--昵称+简介-->
        <Col span="16">
          <h4>{{ name }}</h4>
          <p>{{ intro }}</p>
        </Col>
        <Col span="2" :class="$style.rightIcon">
          <Icon type="ios-arrow-right"></Icon>
        </Col>
      </Row>
    </div>
    <!-- 粉丝+关注 -->
    <div :class="$style.follows">
      <Row :gutter="16">
        <div :class="$style.followsContent">
          <Col span="12" style="border-right: 1px #e2e3e3 solid">
            <p :class="$style.contentCenter" class="followsNum">{{followed}}</p>
            <p :class="$style.contentCenter">粉丝</p>
          </Col>
          <Col span="12">
            <p :class="$style.contentCenter" class="followsNum">{{following}}</p>
            <p :class="$style.contentCenter">关注</p>
          </Col>
        </div>
      </Row>
    </div>
    <!-- 入口菜单 -->
    <div :class="$style.entry">
      <Row :gutter="16" :class="$style.entryMenu">
        <Col span="3">
          <Icon type="model-s"></Icon>
        </Col>
        <Col span="19" :class="$style.menuText">
          个人主页
        </Col>
        <Col span="2" :class="$style.rightIcon">
          <Icon type="ios-arrow-right"></Icon>
        </Col>
      </Row>
      <Row :gutter="16" :class="$style.entryMenu">
        <Col span="3">
          <Icon type="ios-flower"></Icon>
        </Col>
        <Col span="19" :class="$style.menuText">
          排行榜
        </Col>
        <Col span="2"  :class="$style.rightIcon">
          <Icon type="ios-arrow-right"></Icon>
        </Col>
      </Row>
      <Row :gutter="16" :class="$style.entryMenu">
        <Col span="3">
          <Icon type="ios-shuffle"></Icon>
        </Col>
        <Col span="19" :class="$style.menuText">
          收藏
        </Col>
        <Col span="2"  :class="$style.rightIcon">
          <Icon type="ios-arrow-right"></Icon>
        </Col>
      </Row>
    </div>
    <div :class="$style.entry">
      <Row :gutter="16" :class="$style.entryMenu">
        <Col span="3">
          <Icon type="compose"></Icon>
        </Col>
        <Col span="19" :class="$style.menuText">
          意见反馈
        </Col>
        <Col span="2"  :class="$style.rightIcon">
          <Icon type="ios-arrow-right"></Icon>
        </Col>
      </Row>
      <Row :gutter="16" :class="$style.entryMenu">
        <Col span="3">
          <Icon type="ios-basketball-outline"></Icon>
        </Col>
        <Col span="19" :class="$style.menuText">
          Q&A
        </Col>
        <Col span="2" :class="$style.rightIcon">
          <Icon type="ios-arrow-right"></Icon>
        </Col>
      </Row>
      <Row :gutter="16" :class="$style.entryMenu">
        <div style="width: 100%;" @click="changeUrl('/users/systemSetting')">
          <Col span="3">
            <Icon type="ios-star-outline"></Icon>
          </Col>
          <Col span="19" :class="$style.menuText">
            设置
          </Col>
          <Col span="2" :class="$style.rightIcon">
            <Icon type="ios-arrow-right"></Icon>
          </Col>
        </div>
      </Row>
    </div>
    <ToolBar/>
  </div>
</template>

<script>
  import localEvent from '../stores/localStorage';
  import ToolBar from '../components/ToolBar';
  import { changeUrl } from '../utils/changeUrl';

  const currentUser = localEvent.getLocalItem('UserLoginInfo');
  const profile = {
    components: {
      ToolBar
    },
    data: () => ({
      currentUser: currentUser.user_id, // 当前登录用户id
      userInfo: {} // 当前登录用户信息
    }),
    methods: {
      // 跳转方法，减少使用 router-link
      changeUrl
    },
    computed: {
      avatar () {
        const { avatar: { 20: avatar = '' } = {} } = this.userInfo;
        return avatar;
      },
      name () {
        const { name = '' } = this.userInfo;
        return name;
      },
      intro () {
        const { datas: { intro: { value: intro = '大哥,你还没有填写简介哦' } } = {} } = this.userInfo;
        return intro;
      },
      following () {
        const { counts: { following_count = 0 } = {} } = this.userInfo;
        return following_count;
      },
      followed () {
        const { counts: { followed_count = 0 } = {} } = this.userInfo;
        return followed_count;
      }
    },
    beforeMount () {
      let user = localEvent.getLocalItem(`user_${currentUser.user_id}`);
      this.userInfo = { ...this.userInfo, ...user };
    }
  };
  export default profile;
</script>

<style lang="scss" module>
  .profile {
    padding-bottom: 60px;
    .header {
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: 400;
      background-color: #fff;
      border-bottom: 1px solid #e2e3e3;
    }
    .avatar {
      width: 100%;
    }
    .simpleInfo {
      padding-top: 16px;
      padding-bottom: 16px;
      background-color: #fff;
      border-bottom: 1px solid #e2e3e3;
      .rowCenter {
        display: flex;
        align-items: center;
        .colCenter {
          display: flex;
          align-items: center;
        }
      }
    }
    .entry {
      margin-top: 12px;
      background-color: #fff;
      padding: 0 8px;
      .entryMenu {
        height: 50px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e2e3e3;
        &:last-child {
          border-bottom: none;
        }
        .menuText {
          padding-left: 0!important;
        }
      }
    }
    .followsContent {
      background: #fff;
      display: flex;
      padding: 16px 0;
      font-size: 16px;
      font-weight: 400;
      .contentCenter {
        text-align: center;
      }
    }
    
    .rightIcon {
      display: flex!important;
      justify-content: flex-end!important;
    }
  }
</style>
<style scope>
  .followsNum {
    color: #59b6d7;
  }
</style>
