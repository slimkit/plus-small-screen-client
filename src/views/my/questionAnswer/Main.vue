<template>
    <section class="QuestionEntryRoot">
        <header class="commonHeader">
            <Row :gutter="24">
                <Col span="4">
                  <BackIcon @click.native="$router.push('/users/profile')" height="21" width="21" color="#999" />
                </Col>
                <Col span="16" class="title">
                  <router-link to="/users/question-answer/questions">提问</router-link>
                  <router-link to="/users/question-answer/answers">回答</router-link>
                  <router-link to="/users/question-answer/follows">关注</router-link>
                </Col>
            </Row>
        </header>
        <div class="QuestionViews">
            <router-view></router-view>
        </div>
    </section>
</template>
<script>
import BackIcon from '../../../icons/Back';
import SearchIcon from '../../../icons/Search';

export default {
    name: 'my-question-entry',
    components: {
        BackIcon,
        SearchIcon,
    }
};

</script>
<style lang="less" scoped>
.QuestionEntryRoot {
    .title {
        display: flex;
    }
    a {
        flex: 1 1 auto;
        border: 1px solid #59b6d7;
        padding: 5px 0;
        text-align: center;
        color: #59b6d7;
        +a {
            border-left: 0;
        }
        &:first-child {
            border-left: 1px solid #59b6d7;
            border-radius: 3px 0 0 3px;
        }
        &:last-child {
            border-radius: 0 3px 3px 0;
        }
        &.router-link-active {
            background-color: #59b6d7;
            color: #fff;
        }
    }
}

.QuestionViews {
    width: 100%;
    height: calc(100% - 46px);
}
</style>