<template>
    <div class="loading">
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>
<script>
export default {
    name: "loading-icon",
    data() {
        return({});
    }
}
</script>
<style lang="scss">
.loading {
    >span {
        background-color: #59b6d7;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        margin: 0 10px 0 0;
        animation-fill-mode: both;
        display: inline-block;
        &:nth-child(1) {
            transform: scale(1);
            animation: loading 1.5s 0s infinite ease-out;
        }
        &:nth-child(2) {
            animation: loading 1.5s 0.425s infinite ease-out;
        }
        &:nth-child(3) {
            animation: loading 1.5s 0.925s infinite ease-out;
        }
    }
}

@keyframes loading {
    0% {
        transform: scale(1);
    }
    30% {
        transform: scale(1.45);
    }
    60% {
        transform: scale(1);
    }
}
</style>