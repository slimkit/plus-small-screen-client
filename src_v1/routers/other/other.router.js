import { requestAuth, CanNotGetInWhenLogged } from '../../utils/auth';

// 我
const Diggs = () =>
    import( /* webpackChunkName: "mine" */ '../../views/Diggs');
const Ranking = () =>
    import( /* webpackChunkName: "mine" */ '../../views/Ranking');
const Profile = () =>
    import( /* webpackChunkName: "mine" */ '../../views/Profile');
const Comments = () =>
    import( /* webpackChunkName: "mine" */ '../../views/Comments');
const UserFeeds = () =>
    import( /* webpackChunkName: "mine" */ '../../views/UserFeeds');
const UserSetting = () =>
    import( /* webpackChunkName: "mine" */ '../../views/UserSetting');
const Collections = () =>
    import( /* webpackChunkName: "mine" */ '../../views/Collections');
const Relationship = () =>
    import( /* webpackChunkName: "mine" */ '../../views/Relationship');
const UserCertification = () =>
    import( /* webpackChunkName: "mine" */ '../../views/UserCertification');
const ShowUserCertification = () =>
    import( /* webpackChunkName: "mine" */ '../../views/ShowUserCertification');

// 设置
const AboutUs = () =>
    import( /* webpackChunkName: "setting" */ '../../views/AboutUs');
const FeedBack = () =>
    import( /* webpackChunkName: "setting" */ '../../views/FeedBack');
const SystemSetting = () =>
    import( /* webpackChunkName: "setting" */ '../../views/SystemSetting');
const ChangePassword = () =>
    import( /* webpackChunkName: "setting" */ '../../views/ChangePassword');

// 发现
const Discover = () =>
    import( /* webpackChunkName: "discover" */ '../../views/Discover');

// 频道
const ChannelIndex = () =>
    import( /* webpackChunkName: "channel" */ '../../views/channel/ChannelIndex');
const ChannelFeeds = () =>
    import( /* webpackChunkName: "channel" */ '../../views/channel/ChannelFeeds');

// 资讯
const NewsIndex = () =>
    import( /* webpackChunkName: "news" */ '../../views/news/NewsIndex');
const NewsDetail = () =>
    import( /* webpackChunkName: "news" */ '../../views/news/NewsDetail');
const NewsSearch = () =>
    import( /* webpackChunkName: "news" */ '../../views/news/NewsSearch');

// 消息
const Message = () =>
    import( /* webpackChunkName: 'message' */ '../../views/Message');
const ImMessage = () =>
    import( /* webpackChunkName: 'message' */ '../../views/ImMessage');

// 找人相关
const FindSomeOne = () =>
    import( /*webpackChunkName: 'find-someone'*/ '../../views/findsomeone/FindSomeOne');
const FindContent = () =>
    import( /*webpackChunkName: 'find-someone'*/ '../../views/findsomeone/FindContent');
const FindNear = () =>
    import( /*webpackChunkName: 'find-someone'*/ '../../views/findsomeone/FindNear');

// 钱包相关
const Balance = () =>
    import( /*webpackChunkName: 'balance' */ '../../views/balance/Balance');
const BalanceRecords = () =>
    import( /*webpackChunkName: 'balance' */ '../../views/balance/BalanceRecords');
const BalanceWithdraw = () =>
    import( /*webpackChunkName: 'balance' */ '../../views/balance/BalanceWithdraw');

// 问答相关
const QuestionEntry = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/QuestionEntry');
const Questions = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/Questions');
const TopicsList = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/TopicsList');
const QuestionDetail = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/QuestionDetail');
const QuestionList = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/QuestionListComponent');
const TopicsListComponent = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/TopicsListComponent');
const TopicDetail = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/TopicDetail');
const TopicDetailQuestionsList = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/TopicDetailQuestionsList');
const AnswerDetail = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/AnswerDetail');
const ExpertsList = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/ExpertsList');
const SearchComponent = () =>
    import( /* webpackChunkName: "question" */ '../../views/question/Search');

// 排行榜
// import Rank from '../../views/rank/Rank';
// import RankList from '../../views/rank/RankList';
// import RankShow from '../../views/rank/RankShow';

export default [{
        path: '/users/feeds/:user_id',
        component: UserFeeds,
        name: 'userSpace',
        meta: {
            title: '个人主页'
        }
    }, {
        path: '/discover',
        component: Discover,
        meta: {
            title: '发现'
        }
    }, {
        path: '/news',
        component: NewsIndex,
        name: 'newsIndex',
        meta: {
            title: '资讯'
        }
    }, {
        path: '/news/:news_id/detail',
        component: NewsDetail,
        name: 'newsDetail',
        meta: {
            title: '资讯详情'
        }
    }, {
        path: '/news/search',
        component: NewsSearch,
        name: 'newsSearch',
        meta: {
            title: '资讯搜索'
        }
    }, {
        path: '/channel',
        component: ChannelIndex,
        name: 'channelIndex',
        meta: {
            title: '频道'
        }
    }, {
        path: '/channel/:id',
        component: ChannelFeeds,
        name: 'channelDetail',
        meta: {
            title: '频道列表'
        }
    }, {
        path: '/users/message',
        component: Message,
        name: 'myMessage',
        meta: {
            title: '消息'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next)
        }
    }, {
        path: '/users/message/:user_id/:cid',
        component: ImMessage,
        name: 'imMessage',
        meta: {
            title: 'Chat'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next)
        }
    }, {
        path: '/users/diggs',
        component: Diggs,
        name: 'myDiggs',
        meta: {
            title: '赞'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next)
        }
    }, {
        path: '/users/ranking',
        component: Ranking,
        name: 'diggRanking',
        meta: {
            title: '排行榜'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next)
        }
    }, {
        path: '/users/relationship/:user_id/:status',
        component: Relationship,
        name: 'relationship',
        meta: {
            title: '粉丝/关注'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next)
        }
    }, {
        path: '/users/mycomments',
        component: Comments,
        name: 'myComments',
        meta: {
            title: '评论'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next)
        }
    }, {
        path: '/users/collections',
        component: Collections,
        name: 'myCollections',
        meta: {
            title: '收藏'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next)
        }
    }, {
        path: '/users/profile',
        component: Profile,
        name: 'myProfile',
        meta: {
            title: '我'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next)
        }
    }, {
        path: '/users/systemSetting',
        component: SystemSetting,
        name: 'systemSetting',
        meta: {
            title: '设置'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next)
        }
    }, {
        path: '/users/password',
        component: ChangePassword,
        name: 'changePassword',
        meta: {
            title: '修改密码'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next);
        }
    }, {
        path: '/users/setting',
        component: UserSetting,
        name: 'mySetting',
        meta: {
            title: '个人资料',
            keywords: '个人资料'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next);
        }
    }, {
        path: '/users/feedback',
        component: FeedBack,
        name: 'feedBack',
        meta: {
            title: '意见反馈',
            keywords: '意见反馈'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next);
        }
    }, {
        path: '/users/certification',
        component: UserCertification,
        name: 'certification',
        meta: {
            title: '认证',
            keywords: '认证'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next);
        }
    }, {
        path: '/users/certification/show',
        component: ShowUserCertification,
        meta: {
            title: '认证',
            keywords: '认证'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next);
        }
    }, {
        path: '/about',
        component: AboutUs,
        name: 'aboutUs',
        meta: {
            title: '关于我们',
            keywords: '关于我们'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next);
        }
    }, {
        path: '/findsomeone',
        component: FindSomeOne,
        meta: {
            title: '找人'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next);
        },
        redirect: '/findsomeone/list/populars',
        children: [{
            path: 'list/:type',
            component: FindContent,
            meta: {
                title: '找人'
            }
        }, {
            name: "near",
            path: 'near',
            component: FindNear,
            meta: {
                title: '找人'
            }
        }]
    },
    /*{
    path: '/rank',
    component: Rank,
    meta: {
        title: '排行榜'
    },
    redirect: '/rank/list/user',
    children: [{
        path: 'list/:type',
        component: RankList,
        meta: {
            title: '排行榜'
        }
    }, {
        path: 'show',
        component: RankShow,
        meta: {
            title: '排行榜详情'
        }
    }]
},*/
    {
        path: '/balance',
        component: Balance,
        meta: {
            title: '钱包'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next);
        }
    }, {
        path: '/balance/records',
        component: BalanceRecords,
        meta: {
            title: '钱包细明'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next);
        }
    }, {
        path: '/balance/withdraws',
        component: BalanceWithdraw,
        meta: {
            title: '提现记录'
        },
        beforeEnter: (to, from, next) => {
            requestAuth(to, from, next);
        }
    }, {
        path: '/questions',
        component: QuestionEntry,
        name: 'questionEntry',
        meta: {
            title: '问答'
        },
        redirect: '/questions/questions',
        children: [{
            path: '/questions/questions',
            component: Questions,
            meta: {
                title: '问答'
            },
            name: 'questions',
            redirect: '/questions/questions/hot',
            children: [{
                path: '/questions/questions/:type',
                component: QuestionList,
                name: 'QuestionList',
                meta: {
                    title: '问题列表'
                }
            }]
        }, {
            path: '/questions/topics',
            component: TopicsList,
            name: 'topicsList',
            meta: {
                title: '问答话题'
            },
            redirect: '/questions/topics/all',
            children: [{
                path: '/questions/topics/:type',
                component: TopicsListComponent,
                name: 'topicslistcomponent',
                meta: {
                    title: '问答话题'
                }
            }]
        }],
    }, {
        path: '/questions/topics/:topic_id',
        component: TopicDetail,
        name: 'topicDetail',
        redirect: '/questions/topics/:topic_id/hot',
        children: [{
            path: '/questions/topics/:topic_id/:type',
            component: TopicDetailQuestionsList,
            name: 'TopicDetailQuestionsList',
            meta: {
                title: '话题详情'
            }
        }]
    }, {
        path: '/questions/answers/:answer_id',
        component: AnswerDetail,
        name: 'AnswerDetail',
        meta: {
            title: '答案详情'
        }
    }, {
        path: '/questions/:question_id/detail',
        component: QuestionDetail,
        name: 'questionDetail',
        meta: {
            title: '问题详情'
        }
    }, {
        path: '/questions/topics/experts/:topic_id/all',
        component: ExpertsList,
        name: 'expertlist',
        meta: {
            title: '话题专家列表'
        }
    }, {
        path: '/questions/search',
        component: SearchComponent,
        name: 'questionSearch',
        meta: {
            title: '搜索'
        }
    },
]