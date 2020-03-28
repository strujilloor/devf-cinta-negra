const Authors = require('../models/Authors');

const getAllAuthors = () => Authors.find({is_active: true});

const getDeletedAuthors = () => Authors.find({is_active: false});

const getOneAuthorById = ( id ) => Authors.findById( id );

const createOneAuthor = ( data ) => Authors.create( data );

const updateById = ( id, data ) => Authors.findOneAndUpdate( {
    _id: id, is_active: true 
}, { ...data }, { new: true} );

const deleteById = (id) => Authors.findByIdAndUpdate( {
    _id: id, is_active: true 
}, { is_active: false }, { new: true } );

module.exports = {
    getAllAuthors,
    getDeletedAuthors,
    getOneAuthorById,
    createOneAuthor,
    updateById,
    deleteById,
};