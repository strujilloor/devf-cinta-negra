const { GraphQLServer} = require('graphql-yoga');

const typeDefs = `
    type Query{
        hello(name: String!): String!
        getUsers:[User]!
        getUser(id: ID!): User!
    }

    type Mutation{
        createUser(name:String!, age:Int!): User!
        updateUser(id: ID!, name:String!, age:Int!): String!
        deleteUser(id: ID!): String!
    }

    type User{
        id:Int!
        name:String!
        age:Int!
    }
`;


let users = [];

const resolvers = {
    Query:{
        hello:(root, params, context, info) => `Hola ${params.name}`,
        getUsers: (root, params, context, info) => users,
        getUser: (root, {id}, context, info) => users.find(u => u.id == id),
    },
    Mutation:{
        createUser: (root, { name,  age }, context, info) => {
            const user = {
                id: users.length + 123214,
                name,
                age,
            };
            users.push(user);
            return user;
        },
        updateUser: (root, { id, name, age }, context, info) => {
            let message = 'No existe el usuario';
            users.forEach( (user) => {
                if (user.id == id) {
                    user.name = name;
                    user.age = age;
                    message = 'Updated'
                }
            })
            return message;
        },
        deleteUser: (root, { id }, context, info) => {
            let message = 'deleted'
            users = users.filter(u => u.id != id);
            return message;
        }
    },
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(()=> console.log('Servidor arriba en puerto 4000'))
