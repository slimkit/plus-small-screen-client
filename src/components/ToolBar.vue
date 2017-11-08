<template>
    <Row class-name="footer toolBar menu">
        <Col :span="5" class-name="menu-item">
        <router-link class="router-link" to="/feeds">
            <HomeIcon height="26" width="26" color="#999" />
            <i>首页</i>
        </router-link>
        </Col>
        <Col :span="5" class-name="menu-item">
        <router-link class="router-link" to="/discover">
            <DiscoverIcon height="26" width="26" color="#999" />
            <i>发现</i>
        </router-link>
        </Col>
        <Col :span="4" class-name="menu-item plus-parent">
        <PlusIcon @click.native="showPrePost" height="34" width="34" color="#fff" />
        </Col>
        <Col :span="5" class-name="menu-item">
        <router-link class="router-link" to="/users/message">
            <Badge dot v-if="hasNewMessage">
                <MessageIcon height="26" width="26" color="#999" />
                <i>消息</i>
            </Badge>
            <template v-else>
                <MessageIcon height="26" width="26" color="#999" />
                <i>消息</i>
            </template>
        </router-link>
        </Col>
        <Col :span="5" class-name="menu-item">
        <router-link class="router-link" to="/users/profile">
            <Badge dot v-if="messageCount.fans">
                <MeIcon height="26" width="26" color="#999" />
                <i>我</i>
            </Badge>
            <template v-else>
                <MeIcon height="26" width="26" color="#999" />
                <i>我</i>
            </template>
        </router-link>
        </Col>
    </Row>
</template>
<script>
import { SHOWPREPOST, TOTALMESSAGELISTS, MESSAGENOTICE } from '../stores/types';
import HomeIcon from '../icons/Home';
import DiscoverIcon from '../icons/Discover';
import MessageIcon from '../icons/Message';
import MeIcon from '../icons/Me';
import PlusIcon from '../icons/Plus';
import { mapState } from 'vuex';

export default {
    components: {
        HomeIcon,
        DiscoverIcon,
        MessageIcon,
        MeIcon,
        PlusIcon
    },
    methods: {
        showPrePost() {
            this.$store.dispatch(SHOWPREPOST, cb => {
                cb(true)
            });
        }
    },
    computed: {
        ...mapState({
            messageCount: state => state.messageCount.messageCount
        }),
        hasNewMessage() {
            let messageList = this.$store.getters[TOTALMESSAGELISTS];
            let count = 0;
            for(let index in messageList) {
                count += messageList[index].count;
            }
            return(count + this.messageCount.comments.count + this.messageCount.diggs.count) > 0;
        }
    }
}
</script>
<style lang="scss">
.toolBar {
    position: absolute!important;
    bottom: 0;
    padding: 0;
    width: 100%;
    background-color: #363844;
    z-index: 4;
    .menu-item {
        height: 54px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #707c81;
        flex-wrap: wrap;
        padding: 0;
        &.plus-parent {
            background-color: #59b6d7;
            padding: 0;
        }
        i {
            font-style: normal;
            font-size: 12px;
            margin-top: 3px;
        }
        .router-link {
            display: flex;
            width: 100%;
            height: 100%;
            line-height: 1;
            color: #999;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            svg {
                margin: 0 auto;
            }
        }

        .router-link-active {
            border-bottom: none;
            color: #59b6d7;
            svg {
                fill: #59b6d7;
                &:before {
                    color: #59b6d7;
                }
            }
        }
    }
}
</style>