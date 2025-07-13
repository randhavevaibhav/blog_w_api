# blog_w_api

## for connecting to supabase DB using connection string follow below steps ==>

1. In connection string tab find ORM section and then select "Direct connection to the database" link.
   ![Image](https://github.com/user-attachments/assets/a974a0ee-9e1a-4d99-914e-a7491489251d)

## RefreshToken Route

refresh token route is used to issue new access token. we do this by validating the refresh token present in users browser cookie.

## authMiddleware

auth middleware is used to protect routes by checking auth token in the request headers.

## Routes

### 1. Auth

No authentication required for any route.

##### POST - (no authentication required)

/signup
/signin
/terminate
/logout

#### 2. Bookmark

Authentication required for all routes.

##### POST -

/bookmarks

##### GET -

/bookmarks/:userId
Required field - userId.

##### DELETE -

/bookmarks/:userId/:postId  
Required fields - userId, postId reuired.

#### 3. Comment likes

Authentication required for all routes.

##### POST -

/comment/like
/comment/dislike

#### 4. Comments

##### POST -

/comment - Required authentication.

##### DELETE -

/comment/delete/:commentId/:postId/:userId/:hasReplies - Required authentication Required fields - commentId, postId, userId, hasReplies.

##### PATCH -

/comment/update - Required authentication and authorization.

##### GET -

/comments/:currentUserId?/:postId - Authentication not required.  
Optional fields - currentUserId
Reuired field - postId

### 5. Follower

##### GET -

/followers/:userId - Authentication not required.
Required fields - userId

/followings/:userId - Authentication not required.
Required fields - userId

##### POST -

/follower - Required authentication.

##### DELETE -

/follower/:userId/:followingUserId - Required authentication.
Required fields - userId, followingUserId

### 6. PostLikes

##### POST -

/post/like - Require authentication.
/post/dislike - Require authentication.

### 7. Posts -

##### GET -

/user/posts/:userId - Require authentication.
Required fields - userId

/following/posts/:userId - Require authentication.
Required fields - userId

/post/:currentUserId?/:userId/:postId - Authentication not required.
Required fields - userId,postId
Optional field - currentUserId

/posts/all/:userId? - Authentication not required.
Optional field - userId

/posts/search - Authentication not required.

##### POST -

/post - Require authentication.

##### DELETE -

/post/delete/:userId/:postId - Require authentication.
Required fields - userId,postId

##### PATCH -

/post/edit - Require authentication and authorization.

#### 8. Refresh token

##### GET -

/refresh - Authentication not required.

#### 9. User

##### PATCH -

/update/user - Require authentication

##### GET -

/user/info/:currentUserId?/:userId - Authentication not required.
Required fields - userId
Optional field - currentUserId

/user/stat/:userId - Authentication not required.
Required fields - userId
