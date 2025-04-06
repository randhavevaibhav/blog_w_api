import { isPostLikedByUser } from "../../../model/PostLikes/quries.js";
import { getPost } from "../../../model/Posts/quries.js";
import { getAllPostComments } from "../../../model/PostComments/quiries.js";

import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const getIndiviualPostController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  const currentUserId = req.params.currentUserId;
  let likedByUser = false;
  let commentsArr = [];
  // console.log("userId getIndiviualPostController ====> ",userId)
  // console.log("postId getIndiviualPostController ====> ",postId)

  if (!userId || !postId || !currentUserId) {
    return next(
      new AppError(
        `Please send all required fields. userId,currentUserId,postId`
      )
    );
  }

  const result = await getPost(postId);
  // console.log("result from getIndiviualPostController ==>  ",result)
  const commentsResult = await getAllPostComments(postId);
  // console.log("commentsResult ==>  ", commentsResult);
  const isLikedByUser = await isPostLikedByUser(currentUserId, postId);

  if (commentsResult.length) {
    commentsArr = commentsResult.reduce((acc, rec) => {
      // console.log("rec from getAllPostComments ==>  ", rec);
      acc.push({
        id: rec.dataValues.id,
        content: rec.dataValues.content,
        created_at: rec.dataValues.created_at,
        likes: rec.dataValues.likes,
        userName: rec.dataValues.users.dataValues.first_name,
        userId: rec.dataValues.users.dataValues.id,
      });
      return acc;
    }, []);
  }
  // console.log("commentsArr ==>  ", commentsArr);
  if (result) {
    const postData = {
      userName: result.first_name,
      title: result.title,
      content: result.content,
      title_img_url: result.title_img_url,
      totalLikes: result.likes,
      created_at: result.created_at,
      totalComments: result.comments,
      comments: commentsArr,
    };
    // console.log("postData  result ===> ", postData);

    if (isLikedByUser) {
      likedByUser = true;
    }

    return res.status(200).send({
      message: `post fetched.`,
      postData: { ...postData, likedByUser },
    });
  } else {
    return next(new AppError(`No post found.`));
  }
});
