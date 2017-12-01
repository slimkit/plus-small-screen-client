<template>
    <div :class='classes'>
        <template v-if='(imgs.length != 5 && imgs.length != 7)'>
            <div :class="[`${prefixCls}-img-w`, `img-${index + 1}`]" v-for='(img, index) in imgs' v-if='img.file' @click.stop='viewPic(img.file)'>
                <img v-lazyload="`/api/v2/files/${img.file}`">
            </div>
        </template>
        <!-- 五张图 -->
        <template v-if='imgs.length === 5'>
            <div :class="[`${prefixCls}-img-w`, `img-1`]" @click.stop='viewPic(imgs[0].file)'>
                <img v-lazyload="`/api/v2/files/${imgs[0].file}`">
            </div>
            <div :class="[`img-2_3`]">
                <div :class="[`${prefixCls}-img-w`, `img-2`]" @click.stop='viewPic(imgs[1].file)'>
                    <img v-lazyload="`/api/v2/files/${imgs[1].file}`">
                </div>
                <div :class="[`${prefixCls}-img-w`, `img-3`]" @click.stop='viewPic(imgs[2].file)'>
                    <img v-lazyload="`/api/v2/files/${imgs[2].file}`">
                </div>
            </div>
            <div :class="[`${prefixCls}-img-w`, `img-4`]" @click.stop='viewPic(imgs[3].file)'>
                <img v-lazyload="`/api/v2/files/${imgs[3].file}`">
            </div>
            <div :class="[`${prefixCls}-img-w`, `img-5`]" @click.stop='viewPic(imgs[4].file)'>
                <img v-lazyload="`/api/v2/files/${imgs[4].file}`">
            </div>
        </template>
        <!-- 七张图 -->
        <template v-if='imgs.length === 7'>
            <div class="img-1_4">
                <div :class="[`${prefixCls}-img-w`, `img-1`]" @click.stop='viewPic(imgs[0].file)'>
                    <img v-lazyload="`/api/v2/files/${imgs[0].file}`">
                </div>
                <div :class="[`${prefixCls}-img-w`, `img-4`]" @click.stop='viewPic(imgs[3].file)'>
                    <img v-lazyload="`/api/v2/files/${imgs[3].file}`">
                </div>
            </div>
            <div class="img-2__7">
                <div class="img-2_3">
                    <div :class="[`${prefixCls}-img-w`, `img-2`]" @click.stop='viewPic(imgs[1].file)'>
                        <img v-lazyload="`/api/v2/files/${imgs[1].file}`">
                    </div>
                    <div :class="[`${prefixCls}-img-w`, `img-3`]" @click.stop='viewPic(imgs[2].file)'>
                        <img v-lazyload="`/api/v2/files/${imgs[2].file}`">
                    </div>
                </div>
                <div :class="[`${prefixCls}-img-w`, `img-5`]" @click.stop='viewPic(imgs[4].file)'>
                    <img v-lazyload="`/api/v2/files/${imgs[4].file}`">
                </div>
                <div class="img-6_7">
                    <div :class="[`${prefixCls}-img-w`, `img-6`]" @click.stop='viewPic(imgs[5].file)'>
                        <img v-lazyload="`/api/v2/files/${imgs[5].file}`">
                    </div>
                    <div :class="[`${prefixCls}-img-w`, `img-7`]" @click.stop='viewPic(imgs[6].file)'>
                        <img v-lazyload="`/api/v2/files/${imgs[6].file}`">
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
const prefixCls = 'feed_img';
export default {
    name: 'feedImages',
    props: {
        imgs: Array
    },
    data() {
        return {
            prefixCls
        }
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                `${prefixCls}-i${this.imgs.length}`,
            ]
        }
    },
    methods: {
        viewPic(id) {
            this.$emit('viewPic', id);
        }
    }
}
</script>
<style lang='less'>
@feed_img-prefix: feed_img;
.@{feed_img-prefix} {
    width: 520px;
    overflow-x: hidden;
    display: flex;
    flex-wrap: wrap;
    img {
        overflow: hidden;
        height: 100%;
        width: 100%;
        object-fit: cover;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        /*background-color: rgba(135, 135, 135, .4);*/
    }
    .feed_img-img-w {
        height: auto;
        flex: 0 0 auto;
        overflow: hidden;
        margin: 0 4px 4px 0;
        position: relative;
        &:after {
            content: '';
            display: block;
            padding-top: 100%;
        }
        &.long:before {
            content: '长图';
            display: block;
            position: absolute;
            bottom: 1px;/*no*/
            right: 1px;/*no*/
            padding: 0 5px;
            height: 30px;
            border-radius: 1px; /*no*/
            line-height: 30px;
            font-size: 20px;
            z-index: 1;
            color: #fff;
            opacity: .9;
            background: linear-gradient(135deg, #E8D1B3 0%, #E8D1B3 38%, #C8A06C 42%, #C8A06C 100%)
        }
    }
    &-i1 {
        .feed_img-img-w {
            width: 100%;
            background: none;
            &:after {
                display: none;
            }
            img {
                margin: initial;
                display: block;
                width: initial;
                height: initial;
                max-width: 100%;
                position: initial;
                background-color: rgba(135, 135, 135, .4);
            }
        }
    }
    &-i2,
    &-i4 {
        .feed_img-img-w {
            width: calc(~'50% - 4px');
        }
    }
    &-i5 {
        .feed_img-img-w {
            &:first-child {
                width: calc(~'(2/3)*100% - 4px');
            }
            &:nth-child(3),
            &:nth-child(4) {
                width: calc(~'(1/2)*100% - 4px');
            }
        }
        .img-2_3 {
            width: calc(~'(1/3)*100% - 4px');
            background-color: initial;
            .feed_img-img-w {
                width: 100% !important;
            }
        }
    }
    &-i7 {
        .img-1_4, .img-2__7 {
            width: calc(~'50% - 4px');
        }
        .img-2_3, .img-6_7 {
            display: flex;
            .feed_img-img-w {
                width: calc(~'50% - 4px');
            }
        }
    }
    &-i3,
    &-i6,
    &-i8,
    &-i9 {
        .feed_img-img-w {
            width: calc(~'33.333% - 4px');
        }
    }
    &-i8 {
        .feed_img-img-w:nth-child(3),
        .feed_img-img-w:nth-child(4) {
            width: calc(~'50% - 4px');
        }
    }
}





































/*.puzzle {
        width: 100%;
        height: 100%;
        div {
            float: left;
            overflow: hidden;
            position: relative;
        }
        .vertical {
            background-repeat: no-repeat;
            background-size: 100% auto;
            background-position: center center;
        }
        .horizontal {
            background-repeat: no-repeat;
            background-size: auto 100%;
            background-position: center center;
        }
    }
    .puzzle-size (@height, @width) {
        height: @height;
        width: @width;
    }
    .puzzle-5 {
        .puzzle();
        .box:nth-child(1) {
            .puzzle-size(66.5%, 66.7%);
        }
        .box:nth-child(2), .box:nth-child(3) {
            .puzzle-size(50%, 33.3%);
        }
        .box:nth-child(3) {
            float: right;
        }
        .box:nth-child(4), .box:nth-child(5) {
            .puzzle-size(33.3%, 33.3%);
        }
    }*/
</style>