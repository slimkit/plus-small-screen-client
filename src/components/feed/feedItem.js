import feedMixin from "./mixins/feed.mixin";
import groupFeedMixin from "./mixins/groupFeed.mixin";
import Item from "./Item";
import "./feedItem.less";

/**
 * FeedItem
 * @type {Object}
 */
export const FeedItem = {
  extends: Item,
  name: "FeedItem",
  mixins: [feedMixin]
};

/**
 * GroupFeedItem component
 * @type {Object}
 */
export const GroupFeedItem = {
  extends: Item,
  name: "GroupFeedItem",
  mixins: [groupFeedMixin]
};
