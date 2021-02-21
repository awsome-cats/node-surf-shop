# Adding Flash Messages

- Update pre-route middleware to check for error or success on the session(エラーかそうでないかをチェック)
- Update post-route error handling middleware to console.log() the full err, then set err.message on req.session.error and redirect ('back')
- Create a partial for flash message and include it in out layouts(パーシャルでフラッシュを作成)
- Write some success messages and throw some errors to test it out(-成功メッセージをいくつか書き、エラーをスローしてテストします)
