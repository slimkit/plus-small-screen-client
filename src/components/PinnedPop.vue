<template>
    <div class="pinned-pop">
        <Modal title="申请置顶" v-model="popConfig.show" class-name="vertical-center-modal">
            <div class="pinne-block">
                <label>选择置顶天数</label>
                <div class="choose-days">
                    <Button v-for='(days, index) in defaultDays' :type="`${ days===day ? 'primary' : 'ghost'}`" :key='index' @click='day = days'>{{ days }}d</Button>
                </div>
            </div>
            <div class="pinne-block">
                <label>自定义{{goldName}}数量</label>
                <Row :gutter="24" type="flex" justify="space-around">
                    <Col span="24" class-name="text-align-right">
                    <input type="number" style="width: 100%;" autocomplete="off" dir="rtl" :placeholder="`自定义${goldName}数量`" v-model.number="customAmount" />
                    </Col>
                </Row>
            </div>
            <div class="pinne-block">
                <label>总{{goldName}}数量</label>
                <Row :gutter="24" type="flex" justify="space-around">
                    <Col span="24" class-name="text-align-right">
                    <input type="number" style="width: 100%;" autocomplete="off" dir="rtl" v-model.number="amount" />
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click='handelRequest'>确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { SHOWPINNEDMODAL, CLOSEPINNEDMODAL } from '../stores/types';
export default {
    name: 'pinned-pop',
    data() {
        return {
            day: 1,
            customAmount: '',
            goldName: window.TS_WEB.goldName,
            defaultDays: [1, 5, 10]
        }
    },
    computed: {
        popConfig() {
            return this.$store.getters[SHOWPINNEDMODAL]
        },
        ID() {
            return this.popConfig.ID || null;
        },
        pinnedFeed() {
            return this.popConfig.pinnedFeed || FUNC
        },
        amount() {
            return +(this.day * Math.abs(+(this.customAmount)));
        }
    },
    methods: {
        handelClosePop() {
            this.day = 1;
            this.customAmount = '';
            this.$store.dispatch(CLOSEPINNEDMODAL);
        },
        handelRequest() {
            const id = this.popConfig.ID;
            this.popConfig.pinned({
                id,
                day: this.day,
                amount: this.amount,
                callback: this.handelClosePop
            });
        }
    }
}
</script>
<style lang="less">
.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
        top: 0;
    }
}

.pinne-block {
    +.pinne-block {
        border-top: 1px solid #ededed;
    }
    padding: 10px 0;
    label {
        width: 100%;
    }
}

.choose-days {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
    &> {
        flex: 1 1 auto;
    }
}
</style>