const Feeds = () =>
    import(/* webpackChunkName: "feed" */ '../../views/feed/Feeds');
const FeedDetail = () =>
    import(/* webpackChunkName: "feed" */ '../../views/FeedDetail.vue');
    // import(/* webpackChunkName: "feed" */ '../../views/feed/FeedDetail');

export default [{
    name: 'feed',
    path: '/feed/:type',
    component: Feeds,
    meta: {
        title: '动态'
    }
}, {
    name: 'feed-detail',
    path: '/feed-detail/:feedID',
    component: FeedDetail
}];