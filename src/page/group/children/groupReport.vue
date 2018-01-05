<template>
  <div class="group-report">
    <head-top :go-back='true' title='举报'></head-top>
    <div></div>
    <div class="group-report-info">
      <p>举报
        <span class="group-report-user">{{ user.name }}</span>的{{ type }}:
      </p>
      <div class="group-report-item"></div>
      <div class="group-report-content">
        <textarea v-model='content' placeholder="填写举报原因"></textarea>
      </div>
    </div>
  </div>
</template>
<script>
import HeadTop from '@/components/HeadTop'
export default {
  name: 'groupReport',
  components: {
    HeadTop
  },
  props: {
    type: {
      type: String
    }
  },
  data() {
    return {
      content: ''
    }
  }
}

</script>
<style lang='less'>
@group-report-prefix: group-report;
.@{group-report-prefix} {
  &-item{
    height: 100px;
    padding: 10px;
    background-color: #f4f5f5;
  }
  &-content {
    height: 270px;
    background-color: #f4f5f5;
    border: 1px solid #dedede;
    /*no*/
    padding: 20px;
    textarea {
      height: 100%;
      overflow-y: auto;
      font-size: 30px;
    }
    span {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 20px;
      color: #999
    }
  }
}

</style>
