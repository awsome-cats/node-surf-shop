const User = require('../models/user')
const Post = require('../models/post')
const mapBoxToken = process.env.MAP_BOX_TOKEN
const util = require('util');
const { cloudinary } = require('../cloudinary');

const { deleteProfileImage } = require('../middleware')

const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

// error Handlerを使用
    //Get /
module.exports = {
    async landingPage (req,res, next) {
        const posts = await Post.find({})
        res.render('index', { posts, mapBoxToken, title:'Search By Map - Home' })
    },

    //GET /register
    async getRegister (req, res,next) {
        if(req.isAuthenticated()) return res.redirect('/')
        res.render('register', {title: 'Register', username: '', email: ''})
    },
    /*NOTE:POST /register
      usernameとemailがすでにDBにある場合、登録は不可
      emailのみでも同じものがある場合も登]
      
      録不可
      emailをチェックするためにつかったコード
       // eval(require('locus'))
      画像を投稿しないときはcloudinaryからdefaultの画像を取得
       NOTE:登録した後loginさせない方法として.req.loginを使わない方法
       const user = await User.register(new User(req.body),  req.body.password)
            req.session.success = `登録されました, ${user.username}`
            res.redirect('/login')
    */
    async postRegister (req, res, next) {
        // const newUser = new User({
        //     username: req.body.username,
        //     email: req.body.email,
        //     image: req.body.image
        // });

        try {
            // 画像が存在するかチェック
            if(req.file) {
                console.log('postRegister-req.file', req.file)
                const { secure_url, public_id } = req.file
                req.body.image = { secure_url, public_id };
            }

            const user = await User.register(new User(req.body),  req.body.password)
            req.login(user, function(err) {
                if (err) {
                    console.log('req.login-err', err.message)
                    return next(err)
                }
                req.session.success = `Welcome to Map Search, ${user.username}`
                res.redirect('/')
            })
        }catch(err) {
            deleteProfileImage(req)
            const { username, email } = req.body
            let error = err.message;
            if(error.includes('duplicate') && error.includes('index: email_1 dup key')) {
                error =  'このEメールはすでに使用されています。'
            }
            res.render('register', {title: 'Register', username, email, error})
        }
    },
    // Get Login
    async getLogin(req, res,next) {
        if(req.isAuthenticated()) return res.redirect('/')
        /**
         * NOTE: ログインしていないuserが特定の投稿ページからレビューを作成しよう
         * としたときログインをもとめられるが、<a href="/login?returnTo=true">レビューを作成する</a>
         * このアンカータグからログインページに遷移した後,ログインすれば元の投稿ページに戻れる
         */
        if(req.query.returnTo) req.session.redirectTo = req.headers.referer;
        res.render('login', {title: 'login'})
    },
    /*NOTE:Post Login
    高階関数()(username, password)の部分がムズイ
    */
    async postLogin (req, res, next) {
        // console.log('req.body', req.body)
       const { username, password } = req.body
       const { user, error } = await User.authenticate()(username, password)
    //    console.log('user', user)
       if (!user && error) return next(error)
       req.login(user, function(err) {
           if(err) return next(err);
           req.session.success = `Welcome back ${username}`
           const redirectUrl = req.session.redirectTo || '/';
           delete req.session.redirectTo;
           res.redirect(redirectUrl)
       })
    },
    // GET Logout
    async getLogout(req, res, next) {
        req.logout()
        res.redirect('/')
    },
    async getProfile (req,res, next) {
        const posts = await Post.find().where('author').equals(req.user._id).limit(10).exec();
        res.render('profile', {posts})
    },
/**TEST: masterからもってきた */
    async updateProfile(req, res, next) {
		const {
			username,
			email
		} = req.body;
		const { user } = res.locals;
		if (username) user.username = username;
		if (email) user.email = email;
		if (req.file) {
			if (user.image.public_id) await cloudinary.uploader.destroy(user.image.public_id);
			const { secure_url, public_id } = req.file;
			user.image = { secure_url, public_id };
		}
		await user.save();
		const login = util.promisify(req.login.bind(req));
		await login(user);
		req.session.success = 'Profile successfully updated!';
		res.redirect('/profile');
	},
    // async updateProfile (req, res, next) {
    //     const {
    //         username,
    //         email
    //     } = req.ody;
    //     const { user } = res.locals;
    //     if (usernambe) user.username = username;
    //     if (email) user.email = email;
    //     if(req.file) {
    //         if(user.image.public_id) {
    //             await cloudinary.uploader.destroy(user.image.public_id);
    //         }
    //         const { secure_url, public_id } = req.file;

    //         user.image = { secure_url, public_id }

    //     }

    //     await user.save();
    //     /**
    //      * NOTE:util.promisify()引数にわたされた関数を簡単にプロミスオブジェクトにできる
    //      */
    //     const login = util.promisify(req.login.bind(req))
    //     await login(user);
    //     req.session.success = 'プロフィールが更新されました'
    //     res.redirect('/profile');
    // },
    getForgotPw(req, res, next) {
        res.render('users/forgot');
    },
    async putForgotPw(req, res, next) {
        const token = await crypto.randomBytes(20).toString('hex');//16進数
        console.log('putForgotPw-token', token)
        const { email } = req.body;
        const user = await User.findOne({email: req.body.email })
        console.log('putForgotPw', user)
        if(!user) {
            req.session.error = 'そのメールのアカウントはありません。';
            return res.redirect('/forgot-password');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 7200000;// 1時間追加
        await user.save()

        console.log('headers.host', req.headers.host)

        const msg = {
            to: user.email,
            from: 'Surf Shop Admin <cattwin82@gmail.com>',
            subject: 'Surf Shop - Forgot Password / Reset',
            text: `「あなた（または他の誰か）があなたのアカウントのパスワードのリセットを要求したので、あなたはこれを受け取っています。
            次のリンクをクリックするか、コピーしてブラウザに貼り付けてプロセスを完了してください:
                    http://${req.headers.host}/reset/${token}
                    これをリクエストしなかった場合は、このメールを無視してください。パスワードは変更されません。`.replace(/				/g, ''),
        };
          //ES6
          await sgMail.send(msg)
          req.session.success = `詳細な手順が記載されたメールが${email}に送信されました。`
          res.redirect('/forgot-password')

    },
    async getReset(req, res, next) {
        const { token } = req.params;
        console.log('getReset-token', token)
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now()}
        });
        console.log('getReset-user', user)
        if (!user) {
            req.session.error = 'パスワードリセットトークンが無効であるか、有効期限が切れています'
            return res.redirect('/forgot-password');
        }

        res.render('users/reset', { token });

    },
    async putReset(req, res, next) {
        const { token } = req.params;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
         req.session.error = 'パスワードリセットトークンが無効であるか、有効期限が切れています';
         return res.redirect(`/reset/${ token }`);
        }

        if(req.body.password === req.body.confirm) {
            await user.setPassword(req.body.password);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            const login = util.promisify(req.login.bind(req));
            await login(user);
        } else {
            req.session.error = 'パスワードが一致してません';
            return res.redirect(`/reset/${ token }`);
        }

      const msg = {
        to: user.email,
        from: 'Surf Shop 管理者 <cattwin82@gmail.com>',
        subject: 'Surf Shop - パスワードの変更',
        text: `こんにちは、
        このメールは、アカウントのパスワードが変更されたことを確認するためのものです。
        この変更を行わなかった場合は、返信を押してすぐに通知してください`.replace(/		  	/g, '')
      };

      await sgMail.send(msg);

      req.session.success = 'パスワードの更新に成功しました!';
      res.redirect('/');
    }
    // async putReset(req, res, next) {
    //     const { token } = req.params;
    //     console.log('putReset-token', token)
    //     const user = await User.findOne({
    //         resetPasswordToken: token,
    //         resetPasswordExpires: { $gt: Date.now()}
    //     });
    //     console.log('putReset-user', user)
    //     console.log('date', Date.now())

    //     if (!user) {
    //         req.session.error = 'password reset token is invalid or has expired'
    //         return res.redirect('/forgot-password');
    //     }

    //     if (req.body.password === req.body.confirm) {
    //         await user.setPassword(req.body.password)
    //         user.resetPasswordToken = null;
    //         user.resetPasswordExpires = null;
    //         await user.save();
    //         const login = util.promisify(req.login.bind(req));
    //         await login(user);
    //     }else {
    //         req.session.error = 'password do not match.'
    //         return res.redirect(`/reset/${token}`);
    //     }

    //     const msg = {
    //         to: user.email,
    //         from: 'cattwin82@gmail.com',
    //         subject:'Surf Shop - password changed',
    //         text:`Hello,
    //         this email is to confirm that password for your account has just been changed.`.replace(/	 /g, ''),
    //     }
    //     await sgMail.send(msg)
    //       res.session.success = `Password success`
    //       res.redirect('/')
    // }
}

// second test

// module.exports = {
//     async postRegister(req, res, next) {
//         const newUser = new User({
//             username: req.body.username,
//             email: req.body.email,
//             image: req.body.image
//         });
//        try {
//         await User.register(newUser,  req.body.password)
//        }catch(err) {
//            console.log('err',err)
//            return next(err)
//        }
//        res.redirect('/')
//     }
// }

// first test(not model)

// module.exports = {
//     postRegister(req, res, next) {
//         console.log('Post Register Test')
//         res.send('POST /register & Test')
//     }
// }