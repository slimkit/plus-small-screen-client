<template>
    <div>
        <head-top title='我' />
        <foot-guide></foot-guide>
    </div>
</template>
<script>
import HeadTop from '../../components/HeadTop';
import FootGuide from '../../components/FootGuide';
export default {
    name: 'profileIndex',
    components: {
        HeadTop,
        FootGuide
    }
}
</script>
<style lang="less">
@import '../../style/mixin';
</style>