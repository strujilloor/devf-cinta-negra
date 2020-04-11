const { createOneAuthor, updateById, deleteById } = require('../../services/AuthorService');
const authenticate = require('../../utils/authenticate');

// (root, params, context, info) // data es por que en el schema.graphql lo nombramos así
const createAuthor = async (_, { data }) => {
    const author = await createOneAuthor(data); // servicio de la BD
    return author;
};

// context: userAuth
const updateAuthor = async (_, { data }, { userAuth }) => {
    const author = await updateById(userAuth._id, data);
    return author;
};

const deleteAuthor = async (_, __, { userAuth } ) => {
    const author = await deleteById( userAuth._id );
    if ( !author ) return 'Author not exits';
    return 'Author deleted';
};

const login = async (_, params ) => {
    const token = authenticate(params)
        .catch( e => { throw e; });
    
    return {
        token: token,
        message: 'Login Success'
    }
}


module.exports = {
    createAuthor,
    updateAuthor,
    deleteAuthor,
    login,
};