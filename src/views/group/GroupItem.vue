<template>
    <Row class="group-item">
        <Col class="group-avatar" :span="4">
        <img :src="avatar" :alt="group.title">
        </Col>
        <Col class="group-info" :span="16">
        </Col>
        <Col class="group-action" :span="4">
        </Col>
    </Row>
</template>
<script>
export default {
    name: 'group-item',
    props: {
        group: {
            type: Object,
            required: true
        },
    },
    data: () => ({}),
    computed: {
        avatar() {
            const { avatar } = this.group;
            return avatar ? `/api/v2/files/${avatar.id}` : null;
        }
    },
    created() {}
}
</script>
<style lang="scss">
.group {
    .group-item {
        padding: 15px 10px;
        height: 80px;
        background-color: #fff;
        border-bottom: 1px solid #dedede;
        .group-avatar {
            width: 60px;
            height: 60px;
            line-height: 60px;
            background-color: #ededed;
            text-align: center;
            >img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .group-info {}
        .group-action {}
    }
}
</style>