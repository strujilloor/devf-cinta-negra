const { createOneAuthor, updateById, deleteById } = require('../../services/AuthorService');

// (root, params, context, info) // data es por que en el schema.graphql lo nombramos así
const createAuthor = async (_, { data }) => {
    const author = await createOneAuthor(data); // servicio de la BD
    return author;
};

const updateAuthor = async (_, { id,  data }) => {
    const author = await updateById(id, data);
    return author;
};

const deleteAuthor = async (_, { id }) => {
    const author = await deleteById( id );
    if ( !author ) return 'Author not exits';
    return 'Author deleted';
};


module.exports = {
    createAuthor,
    updateAuthor,
    deleteAuthor,
};