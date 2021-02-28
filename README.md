# Restrict One Review Per User, Per Post


- populate reviews on post in reviewCreate method (in reviews contorller)
- Filter post.reviews by author to see if logged in user has already reviewed the post
- Assign hasReviewed to filtered arrays's length
- Otherwise, create review, add to post.reviews, save  post, flash success and redirect
