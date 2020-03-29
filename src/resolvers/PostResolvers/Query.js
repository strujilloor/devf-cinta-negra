const { getAllPosts, getOnePost } = require('../../services/PostService');

const getPosts = async () => {
    const posts = await getAllPosts();
    console.log(posts);
    return posts;
};

const getPostById = async (_, {id}) => {
    const post = await getOnePost(id);
    return post;
};

module.exports = {
    getPosts,
    getPostById,
};