# Register and Login 
    
 `POST /api/auth/register`     
  ----- in body must have  {
                        "username":"demo",
                        "password":"secret",
                        "email":"demo@gmail.com",
                        "name":"Bhupendra Gogi"
                        }

 `POST /api/auth/login`
 ------ in body must have  {
                        "username":"demo",
                        "password":"secret"
                        }

 `logout can handle by Frontend`

# Posts create

 `POST /api/upload`
 --- in body go to form field name = "file" and select img than in response you get img name copy image name simply 

 `POST /api/post`
 --- in headers set Authorization = Bearer "YOUR TOKEN THAT YOU GET WHILE LOGIN"
 --- in body {
  "desc":"your post description",
  "img":"image name that you copy from `POST /api/upload` "
}
 `GEt /api/posts?userId=1`
 --- in headers set Authorization = Bearer "YOUR TOKEN THAT YOU GET WHILE LOGIN"
 --- userId=1 is a query parameter
 `DELETE /api/post/"your post id"`--> eg. /api/post/8

 --- in headers set Authorization = Bearer "YOUR TOKEN THAT YOU GET WHILE LOGIN"

# User Details

**Get singleUser**
 `POST /api/users/find/:id`--- just make request with URl
 
 **Search user by Username**
 `POST /api/users/find`
 --- in body {
    "username":"starting word of username"
 }

 `DELETE /api/users`
 --- in headers set Authorization = Bearer "YOUR TOKEN THAT YOU GET WHILE LOGIN"
---All the things related to user will be deleted


# comment like and follow unfollow working good try yourself , how to dump data 