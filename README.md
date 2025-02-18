# blog_w_api
## for connecting to supabase DB using connection string follow below steps ==>

1. In connection string tab find ORM section and then select "Direct connection to the database" link.
![Image](https://github.com/user-attachments/assets/a974a0ee-9e1a-4d99-914e-a7491489251d)

## RefreshToken Route
refresh token route is used to issue new access token. we do this by validating the refresh token present in users browser cookie.

## authMiddleware
auth middleware is used to protect routes by checking auth token in the request headers.