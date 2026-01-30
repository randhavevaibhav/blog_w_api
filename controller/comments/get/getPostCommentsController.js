import { getPostAnalytics } from "../../../model/PostAnalytics/quires.js";
import {
  getAllAuthUserPostComments,
  getAllPostComments,
} from "../../../model/PostComments/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { COMMENT_OFFSET } from "../../../utils/constants.js";


export const getPostCommentsController = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { offset, sortby } = req.query;
  let comments = [];
  
  if (req.user) {
    const {userId} = req.user;
    comments = await getAllAuthUserPostComments({
      postId,
      offset,
      currentUserId:userId,
      sort: sortby,
    });
  } else {
    comments = await getAllPostComments({
      postId,
      offset,
      sort: sortby,
    });
  }

  // console.log("comments ==> ", comments);
  const commentsMap = new Map();

  comments.forEach((comment) => {
    commentsMap.set(`@${comment.commentId}`, {
      ...comment,
      isCmtUpdated: true,
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
