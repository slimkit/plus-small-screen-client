/**
 * 我的问答 [路由]
 */
const MyQuestionAnswerMain = () =>
    import( /* webpackChunkName: 'my-questions' */ '../../views/my/questionAnswer/Main');
const MyQuestionAnswerQuestion = () =>
    import( /* webpackChunkName: 'my-questions' */ '../../views/my/questionAnswer/Question');
const MyQuestionAnswerQuestionList = () =>
    import( /* webpackChunkName: 'my-questions' */ '../../views/my/questionAnswer/QuestionList');
const MyQuestionAnswerAnswer = () =>
    import( /* webpackChunkName: 'my-questions' */ '../../views/my/questionAnswer/Answer');
const MyQuestionAnswerAnswerList = () =>
    import( /* webpackChunkName: 'my-questions' */ '../../views/my/questionAnswer/AnswerList');
const MyQuestionAnswerFollow = () =>
    import( /* webpackChunkName: 'my-questions' */ '../../views/my/questionAnswer/Follow');
const MyQuestionAnswerFollowList = () =>
    import( /* webpackChunkName: 'my-questions' */ '../../views/my/questionAnswer/FollowList');

export default [{
    path: '/users/question-answer',
    component: MyQuestionAnswerMain,
    name: 'myQuestionAnswer',
    meta: {
        title: '我的问答',
        requiresAuth: true
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
}];