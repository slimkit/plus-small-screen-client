<template>
    <Avatar :icon='icon' :size='size' :src='src' />
</template>
<script>
export default {
    name: 'user-avatar',
    props: {
        sex: {
            type: [Number, String],
            default: 0
        },
        size: {
            type: [Number, String],
            default: 'large'
        },
        src: {
            type: [Number, String]
        }
    },
    computed: {
        icon() {
            switch(+this.sex) {
                case 0:
                    return 'avatar-secret';
                case 1:
                    return 'avatar-man';
                case 2:
                    return 'avatar-woman';
                default:
                    return 'person';
            }
        }
    }
}
</script>