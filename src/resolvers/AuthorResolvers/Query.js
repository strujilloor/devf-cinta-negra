const { getAllAuthors, getOneAuthorById } = require('../../services/AuthorService');

const getAuthors = async () => {
    const authors = await getAllAuthors();
    return authors;
};

const getAuthorById = async (_, { id }) => {
    const author = await getOneAuthorById( id );
    return author; 
}

module.exports = {
    getAuthors,
    getAuthorById,
};
