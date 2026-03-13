export const postId = {
  type: "string",
  example: "716",
};

export const page = {
  type: "number",
  example: 9,
};

export const userId = {
  type: "number",
  example: 2,
};
export const title = {
  type: "string",
  example: "test post title 64",
};
export const titleImgURL = {
  type: "string",
  example: "https://test.com/test.jpg",
};

export const likes = {
  type: "string",
  example: "3",
};
export const totalComments = {
  type: "string",
  example: "45",
};
export const createdAt = {
  type: "string",
  example: "2026-03-05 10:49:13.269+00",
};
export const firstName = {
  type: "string",
  example: "john",
};
export const profileImgURL = {
  type: "string",
  example: "https://test.com/test.jpg",
};
export const hashtags = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: {
        type: "string",
        example: "2",
      },
      name: {
        type: "string",
        example: "Javascript",
      },
      color: {
        type: "string",
        example: "hsl(15, 88%, 35%)",
      },
    },
  },
};

export const isBookmarked = {
  type: "boolean",
  example: true,
};

export const isLikedByUser = {
  type: "boolean",
  example: false,
};

export const archive = {
  type: "number",
  example: 0,
};

export const postAnalytics = {
  type: "object",
  properties: {
    likes,
    comments: totalComments,
  },
};

export const user = {
  type: "object",
  properties: {
    userId,
    firstName,
    profileImgURL,
  },
};
export const content = {
  type: "string",
  example: "content",
};

export const recentComments = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: {
        type: "number",
        example: 2,
      },
      user,
      content,
      createdAt,
    },
  },
};

export const internalServerError = {
  description: "Internal Server Error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Internal Server Error",
          },
        },
      },
    },
  },
};

export const tags = [
  {
    name: "Public",
  },
  {
    name: "Protected",
  },
];

export const fieldValidationError = {
  description: "field validation error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "x must be a positive integer",
          },
        },
      },
    },
  },
};

export const authorizationError = {
  description: "Authorization error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "JWT cookie not present.",
          },
          status: {
            type: "string",
            example: "Fail",
          },
          variables: {
            type: "object",
          },
        },
      },
    },
  },
};

export const postIdParam = {
  name: "postId",
  in: "path",
  description: "post id",
  required: true,
  type: "number",
};

export const hashtagIdParam = {
  name: "hashtagId",
  in: "path",
  description: "hashtag id",
  required: true,
  type: "number",
};

export const offsetQuery = {
  name: "offset",
  in: "query",
  description: "offset for pagination",
  required: false,
  type: "number",
};

export const searchQuery = {
  name: "query",
  in: "query",
  description: "query for search posts",
  required: true,
  type: "string",
};

export const sortQuery = {
  name: "sort",
  in: "query",
  description: "sort for sorting posts",
  required: false,
  type: "string",
};

export const hashtagQuery = {
  name: "hashtag",
  in: "query",
  description: "hashtag id",
  required: false,
  type: "number",
};

export const archiveQuery = {
  name: "archive",
  in: "query",
  description: "archive status",
  required: false,
  type: "number",
};
