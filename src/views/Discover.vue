<template>
  <div class="discover">
    <div class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5">
          
        </Col>
        <Col span="14" class="title-col">
          发现
        </Col>
      </Row>
    </div>
    <div class="nothingDefault"> 
      <img v-if="nothing" :src="nothing" />
    </div>
    <ToolBar/>
  </div>
</template>
<script>
  import { goTo, changeUrl } from '../utils/changeUrl';
  import ToolBar from '../components/ToolBar';
  import BackIcon from '../icons/Back';
  import { resolveImage } from '../utils/resource';
  const defaultNothing = resolveImage(require('../statics/images/defaultNothingx2.png'));

  const Discover = {
    data: () => ({
      isWeiXin: TS_WEB.isWeiXin
    }),
    components: {
      BackIcon,
      ToolBar
    },
    computed: {
      nothing () {
        return defaultNothing;
      }
    },
    methods: {
      goTo
    }
  }

  export default Discover;
</script>