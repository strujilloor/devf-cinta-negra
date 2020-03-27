# Día 03
## MongoDB Atlas

1. Crear una cuenta, puedes iniciar sesión con google
2. En Clusters, CONNECT
   1. Connect your application
   2. Driver: Node.js
   3. Version: 3.0 or later
   4. Connection String Only, Copy
3. En Database Access
   1. ADD NEW DATABASE USER
      1. Definir username
      2. Autogenerate Secure Password (y guardarlo en algún lado)
      3. Database User Privileges: Read and Write to any database
      4. ADD USER
4. En Network Access
   1. ADD IP ADDRESS
   2. Whitelist Entry: 0.0.0.0/0
   3. CONFIRM

## ESLint

1. En VSC Instalamos la Extensión ESLint
2. https://eslint.org/docs/user-guide/getting-started
   1. ``` npm install eslint --global ```
3. Para inicializar ESLint en nuestro proyecto:
   1. ``` eslint --init ```

## GraphQL - MongoDB - GraphQL Yoga
```
npm i nodemon
npm i graphql-yoga
npm i mongoose
npm i dotenv
```

[Configuración index.js][1]

### dotenv

1. dotenv nos permitirá utilizar variables de entorno en cualquier version de nodejs:
   1. ``` require('dotenv').config(); ```
   2. creamos nuestro .env en la raiz del proyecto [.env][2]
   3. las variables de entorno deben tener la siguiente forma:
      1. ``` NOMBRE_LA_VARIABLE=VALOR ```

### GraphQL Yoga

Es un servidor GraphQL Totalmente destacado con enfoque en una fácil configuración y rendimiento.

[GraphQL Yoga][3]

index.js:

```javascript
const { GraphQLServer } = require('graphql-yoga');
const { importSchema } = require('graphql-import');
const resolvers = require('./src/resolvers');

// Mongoose configuration...

const typeDefs = importSchema( __dirname + '/schema.graphql');

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('Servidor arriba en puerto 4000'));

```

### Mongoose Config

index.js:
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const mongo = mongoose.connection;

mongo.on('error', error => console.log(error))
    .once('open', () => console.log('Connected to Database! '));
```

### Mongoose Models

src/models/[Authors.js][5]

```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    birth_date: Date,
    posts: {type: [Schema.Types.ObjectId], ref: 'posts'},
    gender: {type: String, enum: ['M', 'F', 'O']},
    profile_pic: String,
    is_active: {type: Boolean, default: true},
});

module.exports = mongoose.model('authors', AuthorSchema);
```

### Services

Los servicios ejecutarán el crud a mongo. y serán utilizados por los resolvers de GraphQl

src/services/[AuthorService.js][6]

```javascript
const Authors = require('../models/Authors');

const getAllAuthors = () => Authors.find({is_active: true});

const createAuthor = (data) => Authors.create(data);

module.exports = {
    getAllAuthors,
    createAuthor
};
```


### GraphQL Schema

GraphQL trabaja a travez de algo denominado 'Schema', Este esquema sirve para definir las operaciones, tipos y atributos que tendrá nuestro servidor en GraphQL. Para poder construir el schema  necesitamos de  algo conocido como SDL o Schema Definition Language el cual es un lenguaje bien definido propio de GraphQL  y es aquí donde se describe el schema de nuestro servidor.

[schema.graphql][4]

#### 1. Query
Los Query son utilizados para obtener recursos ya sea de forma de objetos o en forma de colleciones.
```graphql
type Query {
    getAuthors: [Author]!
}
```
> Note: getAuthors nos retornará una lista de Autores, el ! nos indica que si o si, debe retornar una lista.

#### 2. Mutation
Se ocupan para crear, modificar y borrar recursos, son muy similares a los query, pero con la diferencia de que es necesario enviar parámetros para poder realizar una operación.
```graphql
type Mutation {
    createAuthor(data:AuthorCreateInput!): Author!
}
```
> Note: createAuthor nos retornará el autor creado, el ! nos indica que si o si, debe retornar un autor.

#### 3. Type (Tipos)
Un type siempre tiene un nombre y puede implementar una o mas interfaces. (es como la definición de un modelo).
```graphql
type Author {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    birth_date: String!
    posts: [Post]!
    gender: GENDERS
    profile_pic: String!
    is_active: Boolean!
}

type Post {
    _id: ID!
    title: String!
    content: String!
    author: Author!
    cover: String!
    liked_by: [Author]!
    is_active: Boolean
}
```
#### 4. Campos o atributos (fields)

Un campo tiene un nombre y  un tipo.
```graphql
first_name: String
```
GraphQL ya tiene implementados algunos valores escalares como:
1. String
2. Boolean
3. Int
4. Float
5. ID

Ademas GraphQL tiene la flexibilidad de crear tipos a partir de los escalares anteriores. 

Para denotar que un campo no es nulo se ocupa el signo de admiración ! tal y como se muestra a continuación.
```graphql
first_name: String!
```
Las listas o arreglos se denotan a travez de corchetes y se escriben  de la siguiente manera.
```graphql
posts: [Post]!
```
#### 5. Enum
Un enum es un tipo especial en GraphQL el cual es una colección de opciones posibles:
```graphql
enum GENDERS{
    M
    F
    O
}
```

#### 6. Input
Un Input define un modelo que solo será usado como parámetro
```graphql
input AuthorCreateInput{
    first_name: String!
    last_name: String!
    email: String!
    birth_date: String
    gender: GENDERS
    profile_pic: String
    is_active: Boolean
}
```
> solo serán obligatorios first_name, last_name, y email

> Note: vemos que será usado en la mutation

### Resolvers

src/[resolvers][7]

src/resolvers/AuthorResolvers

```javascript
const { getAllAuthors } = require('../../services/AuthorService');

const getAuthors = async () => {
    const authors = await getAllAuthors();
    return authors;
};

module.exports = {
    getAuthors
};
```

> Como podemos ver este resolver utiliza el servicio para traer y retornar autores.



[1]: ./index.js
[2]: ./.env
[3]: https://github.com/prisma-labs/graphql-yoga
[4]: ./schema.graphql
[5]: ./src/models/Authors.js
[6]: ./src/services/AuthorService.js
[7]: ./src/resolvers

