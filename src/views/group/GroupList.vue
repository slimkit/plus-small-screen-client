<template>
<div class="group-list">
  <mt-loadmore :auto-fill="false"
               :bottomPullText="`上拉加载更多`"
               :bottomDropText="`释放加载更多`"
               :top-method="loadTop"
               :bottom-method="loadBottom"
               ref="loadmore">
    
    <div slot="top"
         class="mint-loadmore-top">
      <loading-icon></loading-icon>
    </div>
  </mt-loadmore>
</div>

</template>

<script>
import loadingIcon from '../../icons/Loading';
import { addAccessToken } from '../../utils/request';
export default {
  name: 'group-list',
  components: {
    loadingIcon
  },
  data() {
    return ({
        type: 'mine',
        groupList: []
    })
  },
  watch:{
    '$route': ({params: { type }})=>{
        this.type = type || 'mine';
    }
  },
  methods: {
    loadTop() {},
    loadBottom() {},
    loadData(){
        addAccessToken().get('/groups').then((res)=>{
            console.log(res);
        })
    },
    onTopLoaded() {
      this.$refs.loadmore.onTopLoaded()
    },
    onBottomLoaded() {
      this.$refs.loadmore.onBottomLoaded()
    }
  },
  created(){
    this.loadData();
  }
}

</script>
