/**
 * 我的问答 [路由]
 */

import { requestAuth } from '../../utils/auth';

import MyQuestionAnswerMain from '../../views/my/questionAnswer/Main';
import MyQuestionAnswerQuestion from '../../views/my/questionAnswer/Question';
import MyQuestionAnswerQuestionList from '../../views/my/questionAnswer/QuestionList.vue';

import MyQuestionAnswerAnswer from '../../views/my/questionAnswer/Answer';
import MyQuestionAnswerAnswerList from '../../views/my/questionAnswer/AnswerList';

import MyQuestionAnswerFollow from '../../views/my/questionAnswer/Follow';
import MyQuestionAnswerFollowList from '../../views/my/questionAnswer/FollowList';

export default [{
    path: '/users/question-answer',
    component: MyQuestionAnswerMain,
    name: 'myQuestionAnswer',
    meta: {
        title: '我的问答'
    },
    redirect: '/users/question-answer/questions',
    children: [{
        path: '/users/question-answer/questions',
        component: MyQuestionAnswerQuestion,
        name: 'myQuestionAnswerQuestion',
        meta: {
            title: '我的提问'
        },
        redirect: '/users/question-answer/questions/all',
        children: [{
            path: '/users/question-answer/questions/:type',
            component: MyQuestionAnswerQuestionList,
            name: 'myQuestionAnswerQuestionList',
            meta: {
                title: '我的提问'
            },
        }, ]
    }, {
        path: '/users/question-answer/answers',
        component: MyQuestionAnswerAnswer,
        name: 'myQuestionAnswerAnswer',
        meta: {
            title: '我的回答'
        },
        redirect: '/users/question-answer/answers/all',
        children: [{
            path: '/users/question-answer/answers/:type',
            component: MyQuestionAnswerAnswerList,
            name: 'myQuestionAnswerAnswerList',
            meta: {
                title: '我的回答'
            },
        }, ]
    }, {
        path: '/users/question-answer/follows',
        component: MyQuestionAnswerFollow,
        name: 'myQuestionAnswerFollow',
        meta: {
            title: '我的关注'
        },
        redirect: '/users/question-answer/follows/questions',
        children: [{
            path: '/users/question-answer/follows/:type',
            component: MyQuestionAnswerFollowList,
            name: 'myQuestionAnswerFollowList',
            meta: {
                title: '我的关注'
            },
        }, ]
    }, ],
    beforeEnter: (to, from, next) => {
        requestAuth(to, from, next);
    }
}];