<template>
  <div class="discover">
    <header class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5">
          
        </Col>
        <Col span="14" class="title-col">
          发现
        </Col>
      </Row>
    </header>
    <section class="nothingDefault" v-if="nothing"> 
      <img :src="nothing" />
    </section>
    <!--组件列表-->

    <section v-else>
      <ul class="component-lists">
        <li class="component-list" @click="changeUrl(`/news`)">
          <i class="component-icon">
            <NewsIcon height="21" width="21" />
          </i>
          <section class="component-title">
            资讯
          </section>
          <i class="component-entry">
            <RightArrowIcon height="18" width="18" color="#999" />
          </i>
        </li>
        <li class="component-list" @click="changeUrl(`/channel`)">
          <i class="component-icon">
            <ChannelIcon height="21" width="21" />
          </i>
          <section class="component-title">
            频道
          </section>
          <i class="component-entry">
            <RightArrowIcon height="18" width="18" color="#999" />
          </i>
        </li>
      </ul>
    </section>
    <!--组件列表结束-->
    <ToolBar/>
  </div>
</template>
<script>
  import { goTo, changeUrl } from '../utils/changeUrl';
  import ToolBar from '../components/ToolBar';
  import BackIcon from '../icons/Back';
  import NewsIcon from '../icons/News';
  import ChannelIcon from '../icons/Channel';
  import RightArrowIcon from '../icons/RightArrow';
  import { resolveImage } from '../utils/resource';
  const defaultNothing = resolveImage(require('../statics/images/defaultNothingx2.png'));

  const Discover = {
    data: () => ({
      isWeiXin: TS_WEB.isWeiXin
    }),
    components: {
      BackIcon,
      ToolBar,
      RightArrowIcon,
      NewsIcon,
      ChannelIcon
    },
    computed: {
      nothing () {
        return false;
        return defaultNothing;
      }
    },
    methods: {
      goTo,
      changeUrl
    }
  }

  export default Discover;
</script>

<style lang="less" scoped>
  .component-list {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 12px;
    background: #fff;
    border-bottom: 1px #e2e3e3 solid;
    .component-icon {
      display: inherit;
      width: 10vw;
      justify-content: flex-start;
    }
    .component-title {
      display: inherit;
      width: 82vw;
      justify-content: flex-start;
    }
    .component-entry {
      display: inherit;
      width: 8vw;
      justify-content: flex-end;
    }
  }
</style>