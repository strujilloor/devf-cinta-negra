const { getAllAuthors, getOneAuthorById, getAllDeletedAuthors } = require('../../services/AuthorService');

const getAuthors = async () => {
    const authors = await getAllAuthors();
    return authors;
};

const getDeletedAuthors = async () => {
    const authors = await getAllDeletedAuthors();
    return authors;
}

const getAuthorById = async (_, { id }) => {
    const author = await getOneAuthorById( id );
    return author; 
}

module.exports = {
    getAuthors,
    getDeletedAuthors,
    getAuthorById,
};
