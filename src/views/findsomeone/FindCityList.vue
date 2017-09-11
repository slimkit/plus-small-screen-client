<template>
    <div class="findCityList">
        <div v-if="showList" class="cityList">
            
        </div>
        <div v-else class="hotCity">
            <Row :gutter="12" class="curLocation">
                <Col :span="5" style="padding-left:0"><label>当前定位</label></Col>
                <Col :span="15"><span :class="{c_b2b2b2: location.curLocation === '未定位'}">{{location.curLocation}}</span></Col>
                <Col :span="4" style="display: flex; text-align:center; align-items: center; justify-content: center;">
                    <LoadingBlack v-if="location.locationing" height="21" width="21" color="#999" />
                    <Location2 v-else height="21" width="21" color="#999" />
                </Col>
            </Row>
            <Row :gutter="12">
                
            </Row> 
        </div>
    </div>
</template>

<script>

import Location2 from '../../icons/Location2';
import LoadingBlack from '../../icons/LoadingBlack';
// import Feedback from '../../icons/Feedback';
import getCurLocation from '../../utils/getLocation';

    const FindCityList = {
        name: 'FindCityList',
        props: ["dataList"],
        components:{
            Location2,
            // Feedback,
            LoadingBlack,
        },
        data: ()=>({
            location: {
                curLocation: "未定位",
                locationing: true
            },
            showList: false
        }),
        watch:{
            dataList(val){
                this.showList = !(typeof [...val][0] === "string");
            }
        },
        created(){

            if(!this.showList){

            }
        }
    }

    export default FindCityList;
</script>

<style lang='scss'>
.t_c {
    text-align: center;
}

.c_b2b2b2 {
    color: #b2b2b2;
}

.hotCity {
    height: 100%;
    background-color: #f4f5f5;
    .curLocation {
        margin-top: 20px;
        padding: 0 10px;
        height: 45px;
        line-height: 45px;
        background-color: #fff;
        label {
            color: #333;
        }
    }
}
</style>