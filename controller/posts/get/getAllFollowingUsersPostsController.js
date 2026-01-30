import { getRecentComments } from "../../../model/PostComments/quires.js";
import { getAllFollowingUsersPosts } from "../../../model/Posts/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";


const getTagList = ({ colors, names, ids }) => {
  let tagList = [];

  if (colors && names && ids) {
    let colorList = colors.split("),").map((val, i, arr) => {
      if (i < arr.length - 1) {
        return val + ")";
      }
      return val;
    });
    let nameList = names.split(",");
    tagList = ids.split(",").map((id, i) => {
      return {
        id:parseInt(id),
        color: colorList[i],
        name: nameList[i].trim(),
      };
    });
  }

  return tagList;
};

export const getAllFollowingUsersPostsController = catchAsync(
  async (req, res, next) => {
    const { userId } = req.user;
    const { offset } = req.query;

    const result = await getAllFollowingUsersPosts({ userId, offset });
    // result.map((posts) => {
    //   console.log("posts ==> ", posts.id);
    // });
    if (result.length <= 0) {
      return res.status(200).send({
        message: "No following user posts found",
        posts: [],
        total_posts_count: 0,
      });
    }

    const formattedPosts = result.map((post) => {
      return {
        postId: post.id,
        firstName: post["users.first_name"],
        profileImgURL: post["users.profile_img_url"],
        titleImgURL: post.title_img_url,
        title: post.title,
        createdAt: post.created_at,
        likes: post["post_analytics.likes"],
        userId: post["users.id"],
        totalComments: post["post_analytics.comments"],
        tagList: getTagList({
          colors: post["post_hashtags.hashtags.color"],
          names: post["post_hashtags.hashtags.name"],
          ids: post["post_hashtags.hashtags.id"],
        }),
        isBookmarked: post["bookmarks.id"] ? true : false,
      };
    });

    let responseData = null;

    // console.log("formattedPosts ===> ",formattedPosts[9])

    responseData = formattedPosts.map(async (post) => {
      return {
        ...post,
        recentComments: await getRecentComments({
          postId: post.postId,
        }),
      };
    });

    await Promise.all(responseData)
      .then((result) => {
        responseData = result.reduce((acc, rec) => {
          const formattedRecentComments = rec.recentComments.reduce(
            (acc, comment) => {
              acc.push({
                content: comment.content,
                postId: comment.post_id,
                userId: comment.user_id,
                createdAt: comment.created_at,
                firstName: comment.users.first_name,
                profileImgURL: comment.users.profile_img_url,
              });

              return acc;
            },
            []
          );

          acc.push({
            ...rec,
            recentComments: formattedRecentComments,
            page: parseInt(offset) / POST_OFFSET,
          });
          return acc;
        }, []);

        return res.status(200).send({
          message: "found following users posts",
          posts: responseData,
          total_posts_count: responseData.length,
          offset: Number(offset) + POST_OFFSET,
        });
      })
      .catch((err) => {
        return next(new AppError(`Internal server error ===> ${err}`, 500));
      });
  }
);
