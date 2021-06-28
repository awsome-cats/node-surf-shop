
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUD_SECRET
});

/** UPDATE LECTURE DIFFERENCE */
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'surf-shop',
  params: async (req, file) => {
    let buf = crypto.randomBytes(16)
    buf = buf.toString('hex')
    let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
    uniqFileName+=buf;
    // console.log(uniqFileName)
    return {
      folder: 'surf-shop',
      format:'jpeg',
      filename:uniqFileName
    }
  }

});


module.exports = {
    cloudinary,
    storage
}

/**
 * 書式
 * const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'some-folder-name',
      format: async (req, file) => 'png', // supports promises as well
      public_id: (req, file) => 'computed-filename-using-request',
    },
  });
 */

/**
 * req.file
 *  {
      fieldname: 'images',
      originalname: 'nick-fewings-CytfkzbRhDM-unsplash.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      path: 'https://res.cloudinary.com/kknbs/image/upload/v1617527519/surf-shop/zitjvv6vgs7gkb4flqeu.jpg',
      size: 31593,
      filename: 'surf-shop/zitjvv6vgs7gkb4flqeu'
  }
 */



/*
NOTE: cloudinaryの画像がlocalのuploadsにたまるのを解消したい
npm i multer-storage-cloudinary
NOTE:crypto 暗号をしようする/ 画像を保存するときに画像が完全になるように一位の文字列を取得する必要がある
crypto.randomBytesメソッド
toString()文字列に変換と基数変換をおこなう hex: hexadecimal 16進数

*/