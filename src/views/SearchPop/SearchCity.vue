<template>
    <div class="SearchCity">
        <!-- 热门城市 -->
        <div v-if="showHotList" class="hotCity">
            <Row :gutter="12" class="curLocation">
                <Col :span="5" style="padding-left:0">
                <label>当前定位</label>
                </Col>
                <Col :span="15">
                <span :class="{c_b2b2b2: location.city === '未定位'}">{{location.city}}</span>
                </Col>
                <Col :span="4" style="display: flex; text-align:center; align-items: center; justify-content: center;">
                <LoadingBlack v-if="locationing" height="21" width="21" color="#999" />
                <Location2 v-else height="21" width="21" color="#999" @click.native="getLocation()" />
                </Col>
            </Row>
            <p class="labelForHot">热门城市</p>
            <Row :gutter="12" class="hotCityList">
                <ul>
                    <li v-for="(item, index) in hotCityList" key="key" @click="selectCity(item)">{{ item }}</li>
                </ul>
            </Row>
        </div>
        <!-- /热门城市 -->
        <!-- 搜索列表 -->
        <div v-else class="cityList">
            <ul>
                <li v-for="(name, index) in formatList" :key="index" @click="selectCity(name)">{{ name }}</li>
            </ul>
        </div>
        <!-- /搜索列表 -->
    </div>
</template>
<script>
import Location2 from '../../icons/Location2';
import LoadingBlack from '../../icons/LoadingBlack';

import getCurLocation from '../../utils/getLocation';
import { NOTICE } from '../../stores/types';

import request, { createAPI, addAccessToken } from '../../utils/request';

export default {
    name: "SearchCity",
    props: {
        keyword: String,
    },
    components: {
        Location2,
        LoadingBlack,
    },
    data() {
        return ({
            key: "",
            locationing: true,
            location: {
                city: "",
                lat: null,
                lng: null,
            },
            hotCityList: [],
            cityList: []
        });
    },
    computed: {
        showHotList() {
            return !(this.cityList.length > 0);
        },
        formatList() {
            return this.cityList.map((item, index) => {
                return item.tree.name;
            });
        }
    },
    watch: {
        keyword(val) {
            this.key = val;
        },
        key(val) {
            if (val) {
                this.doSearch();
            }
        }
    },
    methods: {
        doSearch() {
            let params = {
                name: this.key,
                limit: 10
            }
            request.get(createAPI(`locations/search`), { params })
                .then(({ data = [] }) => {
                    this.cityList = data
                })
        },

        getLocation() {
            this.locationing = true;
            getCurLocation({
                success: this.locationSuccess,
                error: this.locationError
            });
        },
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
        },
        selectCity(city) {
            if (city !== this.city) {
                request.get(createAPI(`around-amap/geo?address=${city.replace(" ","")}`))
                .then(res => {
                    const { data: { geocodes: [{ location = "0,0" } = {}] = [] } = {} } = res;
                    const [lng, lat] = location.split(",");
                    this.location = {
                        city,
                        lng,
                        lat,
                    };

                    this.key = '';
                    this.$emit("input", city);
                })
            }
        }
    },
    created() {

        const { lat, lng, city } = this.$storeLocal.get("LocationObj") || {};

        if (!isNaN(lat + lng) && typeof city === "string") {
            this.location = { lat, lng, city };
            this.locationing = false;
        } else {
            // 延迟 .5s 定位
            setTimeout(() => {
                this.getLocation();
            }, 500);
        }

        if (this.showHotList) {
            request.get(createAPI(`locations/hots`))
                .then(({ data = [] }) => {
                    this.hotCityList = [...data];
                })
        }
    },
}
</script>
<style lang="scss" module>
</style>