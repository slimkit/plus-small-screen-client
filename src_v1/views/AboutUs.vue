<template>
    <div class="aboutUs">
        <div class="commonHeader" v-if="!isWeiXin">
            <Row :gutter="24">
                <Col span="5" style="display: flex; justify-content: flex-start" @click.native="goTo(-1)">
                <BackIcon height="21" width="21" color="#999" />
                </Col>
                <Col span="14" class="title-col">关于我们</Col>
            </Row>
        </div>
        <div v-show="!loading" class="aboutContent" v-html="content"></div>
    </div>
</template>
<script>
import BackIcon from '../icons/Back';
import { goTo } from '../utils/changeUrl';
import { createAPI, addAccessToken } from '../utils/request';

const aboutUs = {
    name: "AboutUs",
    components: {
        BackIcon
    },
    data: () => ({
        isWeiXin: TS_WEB.isWeiXin,
        loading: true,
        content: ""
    }),
    methods: {
        goTo,
    },
    beforeCreate(){
        addAccessToken().get(createAPI("aboutus"))
        .then(({data})=>{
            this.content = data;
            this.loading = false;
        });
    }

}
export default aboutUs;
</script>
<style>
.aboutContent{
    margin-top: -20px;
    padding-bottom: 1rem;
    text-align: left;
    background-color: #fff;
}
</style>