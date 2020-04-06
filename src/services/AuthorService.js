const Authors = require('../models/Authors');

const getAllAuthors = () => Authors
    .find( { is_active: true } )
    .populate({
        path: 'posts',
        model: 'posts'
    });

const getAllDeletedAuthors = () => Authors.find({is_active: false});

const getOneAuthorById = ( id ) => Authors
    .findById({ 
        _id: id, 
        is_active: true
    })
    .populate({
        path: 'posts',
        model: 'posts'
    });

const getOneAuthorByEmail = ( email ) => Authors
    .findOne({ 
        email, 
        is_active: true
    })
    .populate({
        path: 'posts',
        model: 'posts'
    });

const createOneAuthor = ( data ) => Authors.create( data );

const updateById = ( id, data ) => Authors.findOneAndUpdate(
    { _id: id, is_active: true },
    { ...data },
    { new: true }
);

const deleteById = (id) => Authors.findByIdAndUpdate( 
    { _id: id, is_active: true }, 
    { is_active: false }, 
    { new: true }
);

module.exports = {
    getAllAuthors,
    getAllDeletedAuthors,
    getOneAuthorById,
    getOneAuthorByEmail,
    createOneAuthor,
    updateById,
    deleteById,
};