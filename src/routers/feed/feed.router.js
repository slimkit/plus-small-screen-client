import Feeds from '../../views/feed/Feeds';
// import FeedDetail from '../../views/feed/FeedDetail';
import FeedDetail from '../../views/FeedDetail.vue';

export default [{
    name: 'feed',
    path: '/feed/:type',
    component: Feeds,
    meta:{
        title: '动态'
    }
}, {
    name: 'feed-detail',
    path: '/feed-detail/:feedID',
    component: FeedDetail
}];