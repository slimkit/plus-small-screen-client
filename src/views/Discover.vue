<template>
  <div class="discover">
    <div class="commonHeader">
      <Row :gutter="16">
        <Col span="4">
          
        </Col>
        <Col span="16" class="title-col">
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
  const defaultNothing = resolveImage('../statics/images/defaultNothingx2.png');

  const Discover = {
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