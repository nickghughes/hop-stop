# Hop Stop

https://hopstop.grumdog.com

A brewery search and social application.

Find the written report for this project in `report.md`.

### Attribution

- Profile photo logic in `server/lib/hop_stop/profile_photos.ex` was
  mostly retrieved from the lecture notes at
  https://github.com/NatTuck/scratch-2021-01/blob/19057127559577ba3a0bb50b5f72d12c43194b73/4550/0323/photo-blog-spa/server/lib/photo_blog/photos.ex.
  
- The `guardian` authorization pipeline used to authenticate JWTs was
  inspired by a related blog post at
  https://www.mitchellhanberg.com/post/2017/11/28/implementing-api-authentication-with-guardian/.
  
- Much of the session logic was inspired by lecture notes at
  https://github.com/NatTuck/scratch-2021-01/blob/19057127559577ba3a0bb50b5f72d12c43194b73/4550/0323/photo-blog-spa/server/lib/photo_blog_web/controllers/session_controller.ex,
  although it was tailored to support JWTs rather than Phoenix tokens.

- On the dedicated brewery page
  (`web-ui/src/components/BreweryShow.js`), phone numbers are
  formatted using regex found from a stack overflow post at
  https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript.
  
- Hop Stop's logo (seen on the site) was generated using the website www.freelogodesign.org.