import { isPostLikedByUser } from "../../../model/PostLikes/quries.js";
import { getPost } from "../../../model/Posts/quries.js";
import { getAllPostComments } from "../../../model/PostComments/quiries.js";

import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { checkIfAlreadyBookmarked } from "../../../model/Bookmark/quries.js";

export const getIndiviualPostController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  const currentUserId = req.params.currentUserId;
  let likedByUser = false;
  let bookmarked = false;
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

  const postResult = await getPost({postId});
  // console.log("postResult from getIndiviualPostController ==>  ",postResult)
  const commentsResult = await getAllPostComments({postId});
  // console.log("commentsResult ==>  ", commentsResult);
  const isLikedByUser = await isPostLikedByUser({userId:currentUserId, postId});

  if (commentsResult.length) {
    commentsArr = commentsResult.reduce((acc, rec) => {
      // console.log("rec from getAllPostComments ==>  ", rec);
      acc.push({
        id: rec.dataValues.id,
        content: rec.dataValues.content,
        created_at: rec.dataValues.created_at,
        likes: rec.dataValues.likes,
        userName: rec.dataValues.users.dataValues.first_name,
        userProfileImg:rec.dataValues.users.dataValues.profile_img_url,
        userId: rec.dataValues.users.dataValues.id,
      });
      return acc;
    }, []);
  }
  // console.log("commentsArr ==>  ", commentsArr);
  if (postResult) {
    const postData = {
      userName: postResult.first_name,
      userProfileImg:postResult.profile_img_url,
      title: postResult.title,
      content: postResult.content,
      title_img_url: postResult.title_img_url,
      totalLikes: postResult.likes,
      created_at: postResult.created_at,
      totalComments: postResult.comments,
      comments: commentsArr,
    };
    // console.log("postData  postResult ===> ", postData);

    if (isLikedByUser) {
      likedByUser = true;
    }

    const isBookmarked = await checkIfAlreadyBookmarked({
      userId:currentUserId,
      postId
    })

    if(isBookmarked)
    {
      bookmarked=true
    }

    return res.status(200).send({
      message: `post fetched.`,
      postData: { ...postData, likedByUser ,bookmarked},
      
    });
  } else {
    return next(new AppError(`No post found.`));
  }
});
