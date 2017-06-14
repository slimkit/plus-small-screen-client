import Dexie from 'dexie'; 

const dataBase = {
  _init ( db ) {
    db
    .version(1)
    .stores({
      // 用户
      userbase: "++, &user_id, name, updated_at, email, created_at, following_count, followed_count, feeds_count, diggs_count, intro, avatar, cover",

      // 动态
      feedbase: "++, user_id, storages, &feed_id, feed_content, feed_from, created_at, feed_comment_count, feed_digg_count, feed_view_count",

      // 评论
      commentsbase: "++, comment_content, created_at, &id, reply_to_user_id, user_id, source_id",

      // ImMessage
      messagebase: "++, content, cid, uid, hash, mid",

      // Area
      // areaBase: "",

      // systemConfig
      // systemConfig: ""
    });
    return db;
  }
}

export default dataBase;