import { NEWFEEDS, HOTFEEDS, FOLFEEDS } from './index';

export default {
    getFeeds: ({ feeds, feedType }) => () => {
        return feeds[feedType]['feed'] || [];
    },
    getPinnedFeeds: ({ feeds, feedType }) => () => {
        return feeds[feedType]['pinned'] || [];
    },
    commentInputId({ commentInputId }) {
        return commentInputId;
    }
};