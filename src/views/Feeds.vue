<template>
    <div class="feeds-container">
        <FeedNavBar/>
        <div class="feeds-main-content">
            <router-view></router-view>
        </div>
        <ToolBar/>
    </div>
</template>
<script>
import FeedNavBar from '../components/feedNavBar';
import ToolBar from '../components/ToolBar';

export default {
    name: 'feeds',
    components: {
        FeedNavBar,
        ToolBar
    }
}
</script>
<style lang="less">
.feeds-container{
  position: relative;
  height: 100%;
  overflow: hidden;
}
.feeds-main-content {
  overflow: auto;
  padding: 46px 0 54px 0;
  height: 100%;
}
</style>