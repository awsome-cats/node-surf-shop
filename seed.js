const faker = require('faker');

const Post = require('./models/post')

async function seedPosts() {
    await Post.remove({});
    for(const i of new Array(40)) {
        const post = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
            author: {
                "_id" : "603a7bebf521214a1805f276",
                "username" : "kenny2"
            }
        }
        await Post.create(post)
    }
    console.log('40 new posts created')


}

module.exports = seedPosts