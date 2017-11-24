<template>
    <svg :width='width' :height='height' :fill='color'>
        <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#${type}`"></use>
    </svg>
</template>
<script>
export default {
    name: 'vIcon',
    props: {
        type: {
            type: [String],
            required: true
        },
        height: {
            type: [String, Number],
            default: 24
        },
        width: {
            type: [String, Number],
            default: 24
        },
        color: {
            type: String,
            default: '#000'
        }
    },
    computed: {}
}
</script>