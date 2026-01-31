import { body, query, validationResult, param } from "express-validator";

const userIdFieldValidation = body("userId")
  .notEmpty()
  .withMessage("userId is required")
  .isInt({ min: 1 })
  .withMessage("userId must be a positive integer");

const userIdParamFieldValidation = param("userId")
  .notEmpty()
  .withMessage("userId is required")
  .isInt({ min: 1 })
  .withMessage("userId must be a positive integer");

const postIdFieldValidation = body("postId")
  .notEmpty()
  .withMessage("postId is required")
  .isInt({ min: 1 })
  .withMessage("postId must be a positive integer");

const postIdParamFieldValidation = param("postId")
  .notEmpty()
  .withMessage("postId is required")
  .isInt({ min: 1 })
  .withMessage("postId must be a positive integer");

const commentIdFieldValidation = body("commentId")
  .notEmpty()
  .withMessage("commentId is required")
  .isInt({ min: 1 })
  .withMessage("commentId must be a positive integer");

const commentIdParamFieldValidation = param("commentId")
  .notEmpty()
  .withMessage("commentId is required")
  .isInt({ min: 1 })
  .withMessage("commentId must be a positive integer");

const hashtagIdParamFieldValidation = param("hashtagId")
  .notEmpty()
  .withMessage("hashtagId is required")
  .isInt({ min: 1 })
  .withMessage("hashtagId must be a positive integer");

const followingUserIdFieldValidation = body("followingUserId")
  .notEmpty()
  .withMessage("followingUserId is required")
  .isInt({ min: 1 })
  .withMessage("followingUserId must be a positive integer");

const followingUserIdParamFieldValidation = param("followingUserId")
  .notEmpty()
  .withMessage("followingUserId is required")
  .isInt({ min: 1 })
  .withMessage("followingUserId must be a positive integer");

const parentIdFieldValidation = body("parentId")
  .optional({ nullable: true })
  .isInt({ min: 1 })
  .withMessage("parentId must be a positive integer if provided");

const tagListFieldValidation = body("tagList")
  .optional({ nullable: true })
  .isArray()
  .withMessage("tagList must be an array if provided");

const contentFieldValidation = body("content")
  .notEmpty()
  .withMessage("content is required")
  .isString()
  .withMessage("content must be a string")
  .escape();

const hashtagNameParamFieldValidation = param("hashtagName")
  .notEmpty()
  .withMessage("hashtagName is required")
  .isString()
  .withMessage("hashtagName must be a string")
  .escape();

const titleFieldValidation = body("title")
  .notEmpty()
  .withMessage("title is required")
  .isString()
  .withMessage("title must be a string")
  .escape();

const titleImgURLFieldValidation = body("titleImgURL")
  .optional()
  .isString()
  .withMessage("titleImgURL must be a string");

const userMailFieldValidation = body("userMail")
  .notEmpty()
  .withMessage("userMail is required")
  .isString()
  .withMessage("userMail must be a string");

const userNameFieldValidation = body("userName")
  .notEmpty()
  .withMessage("userName is required")
  .isString()
  .withMessage("userName must be a string")
  .escape();
const profileImgUrlFieldValidation = body("profileImgUrl")
  .optional()
  .isString()
  .withMessage("profileImgUrl must be a string");

const userBioFieldValidation = body("userBio")
  .optional()
  .isString()
  .withMessage("userBio must be a string")
  .escape();
const userSkillsFieldValidation = body("userSkills")
  .optional()
  .isString()
  .withMessage("userSkills must be a string")
  .escape();
const userWebsiteURLFieldValidation = body("userWebsiteURL")
  .optional()
  .isString()
  .withMessage("userWebsiteURL must be a string");

const userLocationFieldValidation = body("userLocation")
  .optional()
  .isString()
  .withMessage("userLocation must be a string");

const passwordFieldValidation = body("password")
  .notEmpty()
  .withMessage("password is required")
  .isString()
  .withMessage("password must be a string");

const oldPasswordFieldValidation = body("oldPassword")
  .notEmpty()
  .withMessage("oldPassword is required")
  .isString()
  .withMessage("oldPassword must be a string");

const pageFieldValidation = body("page")
  .optional()
  .isInt({ min: 0 })
  .withMessage("page must be a non-negative integer");

const bookmarkSortQueryFieldValidation = query("sort")
  .optional()
  .isString()
  .withMessage("sort field must be a string")
  .isIn(["asc", "desc"])
  .withMessage('bookmark sort field must be either "asc" or "desc"');

const commentSortQueryFieldValidation = query("sort")
  .optional()
  .isString()
  .withMessage("comment sort field must be a string")
  .isIn(["asc", "desc", "likes"])
  .withMessage('comment sort field must be either "asc","desc","likes" ');

const userPostsSortQueryFieldValidation = query("sort")
  .optional()
  .isString()
  .withMessage("user posts sort field must be a string")
  .isIn(["asc", "desc", "name"])
  .withMessage('user posts sort field must be either "asc","desc","name" ');

const searchedPostSortQueryFieldValidation = query("sort")
  .optional()
  .isString()
  .withMessage("searched post sort field must be a string")
  .isIn(["asc", "desc"])
  .withMessage('searched post sort field must be either "asc","desc" ');

const searchPostQueryFieldValidation = query("query")
  .notEmpty()
  .withMessage("search query is required")
  .isString()
  .withMessage("search query must be a string");

const offsetQueryFieldValidation = query("offset")
  .optional()
  .isInt({ min: 0 })
  .withMessage("offset must be a positive integer");

const hasRepliesParamFieldValidation = param("hasReplies")
  .toInt()
  .isInt()
  .withMessage("hasReplies must be an integer")
  .custom((value) => [0, 1].includes(value))
  .withMessage("Value must be 0 or 1");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), message: errors.array()[0].msg });
  }
  next();
};

export const validateLikeDisLikePost = [
  postIdFieldValidation,
  validationMiddleware,
];

export const validateUpdateUser = [
  userIdFieldValidation,
  userMailFieldValidation,
  userNameFieldValidation,
  userBioFieldValidation,
  userLocationFieldValidation,
  userSkillsFieldValidation,
  profileImgUrlFieldValidation,
  userWebsiteURLFieldValidation,
  passwordFieldValidation,
  oldPasswordFieldValidation,
  validationMiddleware,
];

//create/delete/get/update Comment validators
export const validateCreateComment = [
  postIdFieldValidation,
  parentIdFieldValidation,
  contentFieldValidation,
  pageFieldValidation,
  validationMiddleware,
];

export const validateDeleteComment = [
  commentIdParamFieldValidation,
  postIdParamFieldValidation,
  hasRepliesParamFieldValidation,
  validationMiddleware,
];

export const validateGetComment = [
  postIdParamFieldValidation,
  offsetQueryFieldValidation,
  commentSortQueryFieldValidation,
  validationMiddleware,
];

export const validateUpdateComment = [
  commentIdFieldValidation,
  contentFieldValidation,
  validationMiddleware,
];

// Like Dislike Comment validators
export const validateLikeDislikeComment = [
  commentIdFieldValidation,
  validationMiddleware,
];

// Bookmark validators
export const validateGetUserBookmark = [
  bookmarkSortQueryFieldValidation,
  validationMiddleware,
];

export const validateCreateBookmark = [
  postIdFieldValidation,
  validationMiddleware,
];

export const validateDeleteBookmark = [
  postIdParamFieldValidation,
  validationMiddleware,
];

//followers/following user validators

export const validateGetFollowersFollowings = [
  offsetQueryFieldValidation,
  validationMiddleware,
];

export const validateCreateFollower = [
  followingUserIdFieldValidation,
  validationMiddleware,
];

export const validateRemoveFollower = [
  followingUserIdParamFieldValidation,
  validationMiddleware,
];

//create/delete/get/update post validators

export const validateCreatePost = [
  userIdFieldValidation,
  titleFieldValidation,
  contentFieldValidation,
  tagListFieldValidation,
  validationMiddleware,
];

export const validateDeletePost = [
  postIdParamFieldValidation,
  validationMiddleware,
];

export const validateGetAllFollowingUserPosts = [
  offsetQueryFieldValidation,
  validationMiddleware,
];

export const validateGetAllPosts = [
  offsetQueryFieldValidation,
  validationMiddleware,
];

export const validateGetAllTaggedPosts = [
  offsetQueryFieldValidation,
  hashtagIdParamFieldValidation,
  hashtagNameParamFieldValidation,
  validationMiddleware,
];

export const validateGetAllUserPosts = [
  offsetQueryFieldValidation,
  userPostsSortQueryFieldValidation,
  validationMiddleware,
];

export const validateGetIndividualPost = [
  postIdParamFieldValidation,
  validationMiddleware,
];

export const validateGetPostAnalytics = [
  postIdParamFieldValidation,
  validationMiddleware,
];

export const validateGetSearchedPosts = [
  searchPostQueryFieldValidation,
  offsetQueryFieldValidation,
  searchedPostSortQueryFieldValidation,
  validationMiddleware,
];

export const validateUpdatePost = [
  postIdFieldValidation,
  titleFieldValidation,
  contentFieldValidation,
  titleImgURLFieldValidation,
  tagListFieldValidation,
  validationMiddleware,
];

export const validateGetUserInfo = [
  userIdParamFieldValidation,
  validationMiddleware,
];
