
import { Posts } from './Posts/Posts.js';
import { PostComments } from './PostComments/PostComments.js';
import { Users } from './Users/Users.js';
import { PostAnalytics } from './PostAnalytics/PostAnalytics.js';
import { Bookmarks } from './Bookmark/Bookmark.js';
import { PostHashtags } from './PostHashtags/PostHashtags.js';
import { Followers } from './Followers/Followers.js';
import { CommentAnalytics } from './CommentAnalytics/CommentAnalytics.js';
import { Hashtags } from './Hashtags/Hashtags.js';
import { FollowerAnalytics } from './FollowerAnalytics/FollowerAnalytics.js';


PostComments.belongsTo(Users, { foreignKey: "user_id" });
PostComments.belongsTo(CommentAnalytics,{foreignKey:"id",targetKey:"comment_id"});  
PostComments.belongsTo(Posts, { foreignKey: "post_id" });

Posts.belongsTo(Users, { foreignKey: "user_id" });
Posts.hasOne(PostAnalytics, { foreignKey: "post_id" });
Posts.hasMany(Bookmarks, { foreignKey: "post_id" });
Posts.hasMany(PostHashtags, { foreignKey: "post_id" });
Posts.hasMany(PostComments, { foreignKey: "post_id" });
PostHashtags.belongsTo(Hashtags,{foreignKey:"hashtag_id"})
Users.hasMany(Followers, {
  foreignKey: "user_id",
});
Users.hasMany(Posts, {
  foreignKey: "user_id",
  as:"user_posts"
});
Users.hasMany(PostComments, {
  foreignKey: "user_id",
});
Users.hasOne(FollowerAnalytics,{foreignKey:"user_id", as: "analytics"})
FollowerAnalytics.belongsTo(Users,{foreignKey:"user_id"})

export { Posts, PostComments ,PostHashtags,Users};