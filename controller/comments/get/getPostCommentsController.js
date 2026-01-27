import { getPostAnalytics } from "../../../model/PostAnalytics/quires.js";
import { getAllPostComments } from "../../../model/PostComments/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { COMMENT_OFFSET } from "../../../utils/constants.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getPostCommentsController = catchAsync(async (req, res, next) => {
  const { postId, currentUserId } = req.params;
  const { offset, sortby } = req.query;
  const formattedOffset = parseInt(offset);

  const sortOptionList = {
    asc: "asc",
    desc: "desc",
    likes: "likes",
  };

  const sortOption = sortOptionList[sortby];

  if (!isPositiveInteger(formattedOffset)) {
    return next(new AppError(`offset needs to be number`, 400));
  }

  if (!sortOption) {
    return next(
      new AppError(
        `please provide correct sort option. desc, asc, likes.`,
        400,
      ),
    );
  }
  if (!postId) {
    return next(new AppError(`please send required field. postId`));
  }

  const comments = await getAllPostComments({
    postId,
    offset,
    currentUserId,
    sort: sortby,
  });

  // console.log("comments ==> ", comments);
  const commentsMap = new Map();

  comments.forEach((comment) => {
    commentsMap.set(`@${comment.commentId}`, {
      ...comment,
      isCmtUpdated:true,
      replies: [],
      page: parseInt(offset) / COMMENT_OFFSET,
    });
  });

  comments.forEach((comment) => {
    if (comment.parentId) {
      const parent = commentsMap.get(`@${comment.parentId}`);
      if (parent) {
        parent.replies.push(`@${comment.commentId}`);
      }
    }
  });
  //  console.log("commentsMap ==> ", commentsMap);
  const commentsMapObj = Object.fromEntries(commentsMap);
  // console.log("commentsMapObj ==> ", commentsMapObj);
  const commentsIds = Object.keys(commentsMapObj);
  // console.log("commentsIds ==> ", commentsIds);

  // console.log("commentsResultMapped ==> ",commentsResultMapped)
  const postAnalytics = await getPostAnalytics({ postId });
  const totalComments = postAnalytics?.comments;

  return res.status(200).send({
    message: `comments fetched.`,
    comments: commentsMapObj,
    commentsIds,
    totalComments: parseInt(totalComments),
    offset: Number(offset) + COMMENT_OFFSET,
  });
});
