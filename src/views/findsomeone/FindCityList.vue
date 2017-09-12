<template>
    <div class="findCityList">
        <div v-if="showList" class="cityList">
            <ul>
                <li v-for="(name, index) in formatList" key="key">{{ name }}</li>
            </ul>
        </div>
        <div v-else class="hotCity">
            <Row :gutter="12" class="curLocation">
                <Col :span="5" style="padding-left:0">
                <label>当前定位</label>
                </Col>
                <Col :span="15">
                <span :class="{c_b2b2b2: location.city === '未定位'}">{{location.city}}</span>
                </Col>
                <Col :span="4" style="display: flex; text-align:center; align-items: center; justify-content: center;">
                <LoadingBlack v-if="locationing" height="21" width="21" color="#999" />
                <Location2 v-else height="21" width="21" color="#999" />
                </Col>
            </Row>
            <p class="labelForHot">热门城市</p>
            <Row :gutter="12" class="hotCityList">
                <ul>
                    <li v-for="(item, index) in dataList" key="key">{{ item }}</li>
                </ul>
            </Row>
        </div>
    </div>
</template>
<script>
import Location2 from '../../icons/Location2';
import LoadingBlack from '../../icons/LoadingBlack';
// import Feedback from '../../icons/Feedback';
import getCurLocation from '../../utils/getLocation';

import { NOTICE } from '../../stores/types';

const FindCityList = {
    name: 'FindCityList',
    props: ["dataList"],
    components: {
        Location2,
        // Feedback,
        LoadingBlack,
    },
    data: () => ({
        locationing: true,
        location: {
            lat: "",
            lng: "",
            city: '未定位'
        },
        formatList: [],
        showList: false
    }),
    created() {

        this.showList = !(typeof [...this.dataList][0] === "string");

        const { lat, lng, city } = this.$storeLocal.get("LocationObj") || {};

        if (!this.showList) {
            if (!isNaN(lat + lng) && typeof city === "string") {
                this.location = { lat, lng, city };
                this.locationing = false;
            } else {
                // 延迟 .5s 定位
                setTimeout(() => {
                    getCurLocation({ success: this.locationSuccess, error: this.locationError });
                }, 500);
            }
        } else {
            this.formatList = this.dataList.map((item, index)=>{
                return item.tree.name;
            });
        }
    },
    methods: {
        locationSuccess(data) {

            this.locationing = false;
            const {
                addressComponent: {
                    city = ""
                } = {},
                position: {
                    lat = "",
                    lng = ""
                } = {}
            } = data;

            this.location = {
                lat,
                lng,
                city
            };

            this.$storeLocal.set("LocationObj", this.location);
        },
        locationError(error) {
            this.locationing = false;
            this.$store.dispatch(NOTICE, cb => {
                cb({
                    show: true,
                    time: 2000,
                    status: false,
                    text: error
                });
            });
        }
    }
}

export default FindCityList;
</script>
<style lang='scss'>
.t_c {
    text-align: center;
}

.findCityList {
    height: 100vh;
    background-color: #fff;
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
    .hotCityList {
        padding: 10px;
        width: 100%;
        font-size: 0;
        background-color: #fff;
        ul {
            margin-left: -15px;
            margin-top: 15px;
            li {
                overflow: hidden;
                display: inline-block;
                margin-left: 15px;
                margin-bottom: 15px;
                padding: 5px;
                border-radius: 4px;
                width: 75px;
                height: 30px;
                font-size: 14px;
                text-align: center;
                text-overflow: ellipsis;
                background-color: #f4f5f5;
                white-space: nowrap;
            }
        }
    }
    .labelForHot {
        padding: 8px 10px;
        font-size: 14px;
    }
}

.cityList {
    background-color: #fff;
    ul {
        margin: 0;
        padding: 0 10px;
        li {
            width: 100%;
            border-bottom: 1px solid #ededed;
            height: 50px;
            line-height: 49px;
        }
    }
}
</style>