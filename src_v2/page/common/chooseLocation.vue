<template>
    <div class="full-page">
        <head-top :go-back='true' :title='$route.meta.title'>选择地理位置</head-top>
    </div>
</template>
<script>
import HeadTop from '@/components/HeadTop'

export default {
    name: 'chooseLocation',
    components: {
        HeadTop
    }
}
</script>
<style lang='less'></style>