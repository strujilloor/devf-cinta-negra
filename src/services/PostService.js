const Posts = require('../models/Posts');

const getAllPosts = () => Posts
    .find({is_active: true})
    .populate([{ // note que como tenemos dos referencias hacemos esto :D
        path: 'liked_by', // atributo que contiene la referencia
        model: 'authors' // es el nombre que le pusimos al modelo
    }, 
    {
        path: 'author',
        model: 'authors'
    }]);


const getOnePost = (id) => Posts.findById({ 
    _id: id, is_active: true
}).populate([
    {path: 'liked_by', model: 'authors'},
    {path: 'author', model: 'authors'}
]);

const createOnePost = (data) => Posts.create(data);

const updateOnePost = (id, data) => Posts
    .findByIdAndUpdate({ 
        _id: id, is_active: true
    },{...data}, {new: true})
    .populate([
        { path: 'liked_by', model: 'authors' },
        { path: 'author', model: 'authors' }
    ]);

const deleteOnePost = (id) => Posts
    .findByIdAndUpdate({ 
        _id: id, is_active: true
    },{ is_active: true })
    .populate([
        { path: 'liked_by', model: 'authors' },
        { path: 'author', model: 'authors' }
    ]); // será necesario hacer el popoulate aquí? 

module.exports = {
    getAllPosts,
    getOnePost,
    createOnePost,
    updateOnePost,
    deleteOnePost
};
