import {
  content,
  createdAt,
  fieldValidationError,
  firstName,
  hashtagIdParam,
  hashtagQuery,
  hashtags,
  internalServerError,
  isBookmarked,
  isLikedByUser,
  likes,
  offsetQuery,
  page,
  postId,
  postIdParam,
  profileImgURL,
  searchQuery,
  recentComments,
  sortQuery,
  title,
  titleImgURL,
  totalComments,
  userId,
  archiveQuery,
  postAnalytics,
  archive,
  authorizationError,
} from "./common.js";

const postsFoundObjectSchema = {
  type: "object",
  properties: {
    posts: {
      type: "object",
      properties: {
        "@postId": {
          type: "object",
          properties: {
            postId,
            page,
            userId,
            title,
            titleImgURL,
            likes,
            totalComments,
            createdAt,
            firstName,
            profileImgURL,
            hashtags,
            isBookmarked,
            recentComments,
          },
        },
      },
    },
    message: {
      type: "string",
      example: "found posts.",
    },
    offset: {
      type: "number",
      example: 10,
    },
  },
};

const NoPostsFoundSchema = {
  type: "object",
  properties: {
    post: {
      type: "array",
      items: {},
    },
    message: {
      type: "string",
      example: "No posts found",
    },
  },
};

// Public

export const getAllPostsDoc = {
  tags: ["Public"],
  description: "Get all posts",
  operationId: "getAllPosts",
  parameters: [offsetQuery],
  responses: {
    200: {
      description: "get all posts",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              postsFoundObjectSchema,
              {
                ...NoPostsFoundSchema,
                total_posts_count: {
                  type: "number",
                  example: 0,
                },
              },
            ],
          },
        },
      },
    },
    400: fieldValidationError,
    500: internalServerError,
  },
};

export const getIndividualPostDoc = {
  tags: ["Public"],
  description: "Get individual post",
  operationId: "getIndividualPost",
  security: [
    {
      bearerAuth: [],
    },
    {},
  ],
  parameters: [postIdParam],
  responses: {
    200: {
      description: "get all posts",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "post fetched.",
              },
              postData: {
                type: "object",
                properties: {
                  postId,
                  userId,
                  title,
                  titleImgURL,
                  content,
                  likes,
                  totalComments,
                  createdAt,
                  firstName,
                  profileImgURL,
                  isBookmarked,
                  isLikedByUser,
                  hashtags,
                },
              },
            },
          },
        },
      },
    },
    404: {
      description: "post not found.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Post not found !!",
              },
            },
          },
        },
      },
    },
    400: fieldValidationError,
    500: internalServerError,
  },
};

export const getAllTaggedPostsDoc = {
  tags: ["Public"],
  description: "Get All tagged posts",
  operationId: "getAllTaggedPosts",
  parameters: [offsetQuery, hashtagIdParam],
  responses: {
    200: {
      description: "get all tagged posts",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Found tagged posts",
                  },
                  posts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        postId,
                        page,
                        userId,
                        title,
                        titleImgURL,
                        likes,
                        totalComments,
                        createdAt,
                        firstName,
                        profileImgURL,
                        hashtags,
                      },
                    },
                  },
                },
              },
              NoPostsFoundSchema,
            ],
          },
        },
      },
    },

    400: fieldValidationError,
    500: internalServerError,
  },
};

export const getSearchedPostsDoc = {
  tags: ["Public"],
  description: "Get searched posts",
  operationId: "getSearchedPosts",
  parameters: [offsetQuery, searchQuery, hashtagQuery, sortQuery],
  responses: {
    200: {
      description: "get all search posts",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Found posts",
                  },
                  posts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        postId,
                        userId,
                        title,
                        titleImgURL,
                        likes,
                        totalComments,
                        createdAt,
                        firstName,
                        profileImgURL,
                        hashtags,
                      },
                    },
                  },
                },
              },
              NoPostsFoundSchema,
            ],
          },
        },
      },
    },
    400: fieldValidationError,
    500: internalServerError,
  },
};

export const getTopRatedPostsDoc = {
  tags: ["Public"],
  description: "Get top rated posts",
  operationId: "getTopRatedPosts",
  responses: {
    200: {
      description: "get top rated posts",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Found posts",
                  },

                  topLikedPosts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        postId,
                        userId,
                        title,
                        titleImgURL,
                        likes,
                        totalComments,
                        createdAt,
                        firstName,
                        profileImgURL,
                        hashtags,
                      },
                    },
                  },
                  topCommentedPosts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        postId,
                        userId,
                        title,
                        titleImgURL,
                        likes,
                        totalComments,
                        createdAt,
                        firstName,
                        profileImgURL,
                        hashtags,
                      },
                    },
                  },
                },
              },
              NoPostsFoundSchema,
            ],
          },
        },
      },
    },
    500: internalServerError,
  },
};

// Protected
export const createPostDoc = {
  tags: ["Protected"],
  description: "create post",
  operationId: "createPost",
  security: [
    {
      bearerAuth: [],
      cookieAuth: [],
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            title,
            titleImgURL,
            content,
            tagList: { ...hashtags },
          },
          required: ["title", "content"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "create a new post",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "successfully created new post.",
              },
              postId,
            },
          },
        },
      },
    },
    401: authorizationError,
    400: fieldValidationError,
    500: internalServerError,
  },
};

export const getAllUserPostsDoc = {
  tags: ["Protected"],
  description: "Get all user posts",
  operationId: "getAllUserPosts",
  security: [
    {
      bearerAuth: [],
      cookieAuth: [],
    },
  ],
  parameters: [offsetQuery, archiveQuery, sortQuery],
  responses: {
    200: {
      description: "get all user posts",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              {
                type: "object",
                properties: {
                  posts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        postId,
                        archive,
                        imgURL: titleImgURL,
                        post_analytics: postAnalytics,
                        title,
                        createdAt,
                      },
                    },
                  },
                  message: {
                    type: "string",
                    example: "found user posts.",
                  },
                  unarchivePostsCount: {
                    type: "string",
                    example: "12",
                  },
                  archivePostsCount: {
                    type: "string",
                    example: "10",
                  },
                  offset: {
                    type: "number",
                    example: 10,
                  },
                },
              },
              NoPostsFoundSchema,
            ],
          },
        },
      },
    },
    401: authorizationError,
    400: fieldValidationError,
    500: internalServerError,
  },
};

export const getAllFollowingUsersPostsDoc = {
  tags: ["Protected"],
  description: "Get all following users posts",
  operationId: "getAllFollowingUsers",
  security: [
    {
      bearerAuth: [],
      cookieAuth: [],
    },
  ],
  parameters: [offsetQuery],
  responses: {
    200: {
      description: "get all following users posts",
      content: {
        "application/json": {
          schema: {
            oneOf: [postsFoundObjectSchema, NoPostsFoundSchema],
          },
        },
      },
    },
    401: authorizationError,
    400: fieldValidationError,
    500: internalServerError,
  },
};
