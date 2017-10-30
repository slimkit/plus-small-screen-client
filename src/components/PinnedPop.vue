<template>
    <div class="pinned-pop">
        <Modal title="申请置顶" v-model="popConfig.show" class-name="vertical-center-modal">
            <div class="pinne-block">
                <p>选择置顶天数</p>
            </div>
            <div class="pinne-block">
                <Row :gutter="24" type="flex" justify="space-around" style="padding-top: 8px; font-size: 14px;">
                    <Col span="12" class-name="text-align-left">
                    <label for="account">自定义{{ goldName }}数量</label>
                    </Col>
                    <Col span="12" class-name="text-align-right">
                    <input type="number" style="width: 100%;" autocomplete="off" dir="rtl" :placeholder="`输入${goldName}数量`" v-model.number="customAmount" />
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
            amount: 3,
            customAmount: '',
            goldName: window.TS_WEB.goldName,
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
        }
    },
    methods: {
        handelClosePop() {
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
<style lang="scss">
.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
        top: 0;
    }
}
</style>