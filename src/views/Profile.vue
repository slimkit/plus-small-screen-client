<template>
  <div :class="$style.profile">
    <div :class="$style.header" v-if="!isWeiXin">
      我
    </div>
    <!-- 头像+昵称+简介-->
    <div :class="$style.simpleInfo" @click="changeUrl('/users/setting')">
      <Row :gutter="24" :class="$style.rowCenter">
        <!-- 头像 -->
        <Col span="6" :class="$style.colCenter">
          <img v-lazy="avatar" :class="$style.avatar" alt="name">
        </Col>
        <!--昵称+简介-->
        <Col span="15">
          <h4>{{ name }}</h4>
          <p style="word-break: break-all">{{ intro }}</p>
        </Col>
        <Col span="3" :class="$style.rightIcon">
          <RightArrowIcon height="18" width="18" color="#999" />
        </Col>
      </Row>
    </div>
    <!-- 粉丝+关注 -->
    <div :class="$style.follows">
      <Row :gutter="24">
        <div :class="$style.followsContent">
          <Col span="12" style="border-right: 1px #ededed solid" @click.native="changeUrlFans(`/users/relationship/${currentUser}/followers`)">
            <p  v-if="!messageCount.fans" :class="$style.contentCenter" class="followsNum">{{followed}}</p>
            <p v-if="messageCount.fans" :class="$style.contentCenterHalf" class="followsNum">{{followed}}</p>
            <p v-if="messageCount.fans" :class="$style.newFollowsHalf">{{messageCount.fans}}</p>
            <p :class="$style.contentCenter">粉丝</p>
          </Col>
          <Col span="12" @click.native="changeUrl(`/users/relationship/${currentUser}/followings`)">
            <p :class="$style.contentCenter" class="followsNum">{{following}}</p>
            <p :class="$style.contentCenter">关注</p>
          </Col>
        </div>
      </Row>
    </div>
    <!-- 入口菜单 -->
    <div :class="$style.entry">
      <Row :gutter="24" :class="$style.entryMenu" @click.native="changeUrl(`/users/feeds/${currentUser}`)">
        <Col span="3">
          <SapceIcon :height="21" :width="21" color="#59b6d7" />
        </Col>
        <Col span="16" :class="$style.menuText">
          个人主页
        </Col>
        <Col span="5" :class="$style.rightIcon">
          <RightArrowIcon height="18" width="18" color="#999" />
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.entryMenu"  @click.native="changeUrl('/users/ranking')">
        <Col span="3">
          <RankingIcon :height="21" :width="21" color="#59b6d7" />
        </Col>
        <Col span="16" :class="$style.menuText">
          排行榜
        </Col>
        <Col span="5"  :class="$style.rightIcon">
          <RightArrowIcon height="18" width="18" color="#999" />
        </Col>
      </Row>
      <Row :gutter="24" :class="$style.entryMenu" @click.native="changeUrl('/users/collections')">
        <Col span="3">
          <ConnectionIcon :height="21" :width="21" color="#59b6d7" />
        </Col>
        <Col span="16" :class="$style.menuText">
          收藏
        </Col>
        <Col span="5"  :class="$style.rightIcon">
          <RightArrowIcon height="18" width="18" color="#999" />
        </Col>
      </Row>
    </div>
    <div :class="$style.entry">
      <!-- <Row :gutter="16" :class="$style.entryMenu">
        <Col span="3">
          <FeedbackIcon :height="21" :width="21" color="#59b6d7" />
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
          <QuestionIcon :height="21" :width="21" color="#59b6d7" />
        </Col>
        <Col span="19" :class="$style.menuText">
          Q&A
        </Col>
        <Col span="2" :class="$style.rightIcon">
          <Icon type="ios-arrow-right"></Icon>
        </Col>
      </Row> -->
      <Row :gutter="24" :class="$style.entryMenu" @click.native="changeUrl('/users/systemSetting')">
        <Col span="3">
          <SystemSettingIcon height="21" width="21" color="#59b6d7" />
        </Col>
        <Col span="16" :class="$style.menuText">
          设置
        </Col>
        <Col span="5" :class="$style.rightIcon">
          <RightArrowIcon height="18" width="18" color="#999" />
        </Col>
      </Row>
    </div>
    <ToolBar/>
  </div>
</template>

<script>
  import localEvent from '../stores/localStorage';
  import ToolBar from '../components/ToolBar';
  import { changeUrl, goTo } from '../utils/changeUrl';
  import FeedbackIcon from '../icons/Feedback';
  import ConnectionIcon from '../icons/Connection';
  import RankingIcon from '../icons/Ranking';
  import QuestionIcon from '../icons/Question';
  import SystemSettingIcon from '../icons/SystemSetting';
  import SapceIcon from '../icons/Space';
  import RightArrowIcon from '../icons/RightArrow';
  import { resolveImage } from '../utils/resource';
  import lodash from 'lodash';
  import { getUserInfo, getLoggedUserInfo } from '../utils/user';
  import { mapState } from 'vuex';
  import { CLEANMESSAGE } from '../stores/types';

  const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));

  const profile = {
    components: {
      ToolBar,
      FeedbackIcon,
      ConnectionIcon,
      RankingIcon,
      QuestionIcon,
      SystemSettingIcon,
      SapceIcon,
      RightArrowIcon
    },
    data: () => ({
      currentUser: 0, // 当前登录用户id
      userInfo: {}, // 当前登录用户信息
      isWeiXin: TS_WEB.isWeiXin
    }),
    methods: {
      // 跳转方法，减少使用 router-link
      changeUrl,
      changeUrlFans (url) {
        this.$store.dispatch(CLEANMESSAGE, cb => {
          cb('fans');
        });
        changeUrl(url);
      }
    },
    computed: {
      ...mapState({
        messageCount: state => state.messageCount.messageCount
      }),
      avatar () {
        const { avatar = defaultAvatar } = this.userInfo;
        return avatar;
      },
      name () {
        const { name = '' } = this.userInfo;
        return name;
      },
      intro () {
        const { bio = '还没有简介呢' } = this.userInfo;
        return bio;
      },
      following () {
        const { extra: { followings_count = 0 } = {} } = this.userInfo;
        return followings_count;
      },
      followed () {
        const { extra: { followers_count = 0 } = {} } = this.userInfo;
        return followers_count;
      }
    },
    created () {
      this.currentUser = TS_WEB.currentUserId;
      getLoggedUserInfo().then( user => {
        this.userInfo = { ...this.userInfo, ...user };
      });
    }
  };
  export default profile;
</script>

<style lang="scss" module>
  .profile {
    padding-bottom: 60px;
    .header {
      height: 46px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: 400;
      background-color: #fff;
      border-bottom: 1px solid #ededed;
    }
    .avatar {
      width: 100%;
      border-radius: 50%;
    }
    .simpleInfo {
      padding-top: 16px;
      padding-bottom: 16px;
      background-color: #fff;
      border-bottom: 1px solid #ededed;
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
        border-bottom: 1px solid #ededed;
        &:last-child {
          border-bottom: none;
        }
        .menuText {
          padding-left: 0!important;
        }
      }
    }
    .followsContent {
      width: 100%;
      background: #fff;
      display: flex;
      padding: 16px 0;
      font-size: 16px;
      font-weight: 400;
      .contentCenter {
        text-align: center;
      }
      .contentCenterHalf {
        width: 50%;
        display: flex;
        justify-content: flex-end;
        float: left;
      }
      .newFollowsHalf {
        display: inline-block;
        border-radius: 100px;
        color: #fff;
        background: #f00;
        min-width: 16px;
        height: 16px;
        padding: 2px 4px;
        margin-left: 8px;
        text-align: center;
        vertical-align: inherit;
        font-size: 13px;
        line-height: 1;
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
