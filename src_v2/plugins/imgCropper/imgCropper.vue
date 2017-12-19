<template>
    <div id="cropperImg" :class='{ round }'>
        <img ref='cropperImg' :src="url">
    </div>
</template>
<script>
import Cropper from 'cropperjs';

export default {
    props: {
        url: [String],
        aspectRatio: {
            type: [Number, String],
            default: 1 / 1
        },
        round: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            cropper: null,
            imgVNode: null,
        }
    },
    watch: {
        url(val) {
            if(val && this.cropper) {
                this.cropper.replace(val);
            }
        }
    },
    methods: {
        crop() { console.log(this.cropper); },
    },
    created() {},
    mounted() {
        this.imgVNode = this.$refs.cropperImg;
        this.cropper = new Cropper(this.imgVNode, {
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: this.aspectRatio,
            autoCropArea: 0.65,
            restore: false,
            guides: true,
            center: true,
            highlight: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
        });
    },
}
</script>
<style lang='less'>
.round {
    .cropper-view-box,
    .cropper-face {
        border-radius: 50%;
    }
}
</style>
<style lang="less" src='./imgCropper.less'></style>