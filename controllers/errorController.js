const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack
    })
}

/**
 * グローバルエラー Class appErrorがうけもつ
 */
const sendErrorPro = (err, res) => {
    // operational trusted  send message to client
    if(err.isOperational) {
        res.status(err.statusCode).json({
        status: err.status,
        message: err.message
        })
       // programing or other unknown error don't leak error detail
    } else {
        console.error('error', err)
        res.status(500).json({
            status: 'error',
            message: 'サーバーエラーです'
        })
    }

}


module.exports = (err, req, res, next) => {
    /**
     * TEST: errハンドリングだが、コメントアウト部分がjsonなのでmessageとして使用できるようになったらよい
     * グローバルのエラーハンドリング
     *
     */
    if(process.env.NODE_ENV === 'development') {
        // err.statusCode = err.statusCode || 500;
        // err.status = err.status || 'error'
        // sendErrorDev(err, res)
        req.session.error = err.message;
        res.redirect('back');

    } else if(process.env.NODE_ENV === 'production') {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error'
        sendErrorPro(err, res)
    }

}