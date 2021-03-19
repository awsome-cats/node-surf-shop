const crypto = require('crypto');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUD_SECRET
});


const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'surf-shop',
  allowedFormats: ['jpeg', 'jpg', 'png'],
  filename: function (req, file, cb) {
  	let buf = crypto.randomBytes(16);
  	buf = buf.toString('hex');
  	let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
  	uniqFileName += buf;
    cb(undefined, uniqFileName );
  }
});

module.exports = {
    cloudinay,
    storage
}



/*
NOTE: cloudinaryの画像がlocalのuploadsにたまるのを解消したい
npm i multer-storage-cloudinary
NOTE:crypto 暗号をしようする/ 画像を保存するときに画像が完全になるように一位の文字列を取得する必要がある
crypto.randomBytesメソッド
toString()文字列に変換と基数変換をおこなう hex: hexadecimal 16進数

*/