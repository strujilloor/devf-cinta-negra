# DOCUMENTACIÓN CINTA NEGRA
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
   2. To check syntax, find problems, and enforce code style
   3. CommonJS (require/exports)
   4. None of these
   5. No use typescript
   6. Node
   7. Answer questions about your style
   8. Json
   9. Spaces
   10. Single
   11. Windows
   12. Do you require semicolons? Yes

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

#### 7. Scalars

```
npm install --save graphql-scalars
```
doc: https://github.com/Urigo/graphql-scalars

en este caso vamos a utilizar el scalar EmailAdd para los campos de tipo email, y para la mutation de login (ver el archivo schema.graphql).

archivo schema.graphql :
```graphql
scalar EmailAdd

# ...

type Author {
    _id: ID!
    first_name: String!
    last_name: String!
    
    email: EmailAdd! # aquí

    password: String!
    birth_date: String!
    posts: [Post]!
    gender: GENDERS
    profile_pic: String!
    is_active: Boolean!
}

```

> Note: solo se implementa en el la identidad general, no en el input o update

Ahora debemos importarlas en nuestros resolvers de la siguiente forma:

En src/resolvers/index.js :

```javascript
const AuthorResolver = require('./AuthorResolvers');
const PostsResolver = require('./PostResolvers');

const { EmailAddressResolver } = require('graphql-scalars'); // lo importamos

module.exports = {
    EmailAdd: EmailAddressResolver, // y lo agregamos
    Query:{
        ...AuthorResolver.Query,
        ...PostsResolver.Query,
    },
    Mutation:{
        ...AuthorResolver.Mutation,
        ...PostsResolver.Mutation,
    }
}
```

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

## Authentication

```
npm install bcrypt
npm install jsonwebtoken
```

documentación bcrypt: https://github.com/kelektiv/node.bcrypt.js
documentación jwt: https://github.com/auth0/node-jsonwebtoken

### Authenticate Methods

1. authenticate
2. createToken
3. verifyToken.

### Create Token

Un token va a contener header, payload y signature (firma).

en el payload podemos decidir que almacenar en él, (sería bueno no almacenar contraseñas!), en este caso almacenará el email y el first_name del usuario.

jwt.sign recibe como parámetros:
1. el payload
2. nuestra secret key (definida en .env)
3. un objeto con las opciones, en este caso el tiempo de expiración

path: src/utils/createToken.js

```javascript
const jwt = require('jsonwebtoken');
/*
header
payload
signature
*/

const createToken = ( { email, first_name } ) => {
    const payload = {
        email,
        first_name,
    };
    return jwt.sign(payload, process.env.SECRET_KEY_JWT,{ expiresIn: '1d'});
};

module.exports = createToken; 
```

### Verify Token

path: src/utils/verifyToken.js

```javascript
const jwt = require('jsonwebtoken');
const { getOneAuthorByEmail } = require('../services/AuthorService');

const verifyToken = async ( req ) => { // recibe la request.
    try {
        // obtenemos la authorization de la request
        const Authorization = req.get('Authorization'); // se puede obtener el valor dentro de un objeto utilizando get.
        if ( Authorization ) {
            // formato: JWT sadsdfadsds.sadsdasdad.sasdadfdsfsd
            const formatedToken = Authorization.replace('JWT ',''); // reemplazamos JWT por una cadena vacia por que eso no lo vamos a necesitar.
            // nos quedaría así: sadsdfadsds.sadsdasdad.sasdadfdsfsd
            const payload = jwt.verify( formatedToken, process.env.SECRET_KEY_JWT ); // verify: verifica en el token (si el tiempo acabó (expiró)).
            if ( !payload ) return req; // si nuestro payload no existe vamos a retornar nuestro request así solito.
            const userAuth = await getOneAuthorByEmail( payload.email ); // si si, traigame el usuario.
            if ( !userAuth ) return req;
            return userAuth; // devuelvame el usuario completo. (quedará guardado en nuestro contexto)
        } else {
            return {}; // regresariamos al userAuth del contexto un objeto vacio.
        }
    }catch (e) {
        throw new Error( e.message );
    }
};

module.exports = verifyToken; 
```

### Authenticate

path: src/utils/authenticate.js

```javascript
const bcrypt = require('bcrypt'); // para desencriptar
const { getOneAuthorByEmail } = require('../services/AuthorService');
const createToken = require('./createToken'); // generar el token para devolverselo a quien este haciendo la petición

const authenticate = ( {email, password} ) => {
    return new Promise((resolve, reject)=>{
        getOneAuthorByEmail(email).then(userAuth => {
            if( !userAuth ) reject( new Error('Author not exist') );
            bcrypt.compare(password, userAuth.password, (err, isValid) => { // compara el password con el valor almacenado encriptado
                if(err) reject(new Error('Error to compare'));
                isValid // es valida la contraseña ?
                    ? resolve(createToken(userAuth)) // creame el token con el usuario a authenticar
                    : reject(new Error('Incorrect Password'));
            });
        }); 
    });
};

module.exports = authenticate;
```

### Agregar Secret Key JWT

path: .env
```
NOMBRE_LA_VARIABLE=VALOR
SECRET_KEY_JWT=heladodevainilla 
```


[1]: ./index.js
[2]: ./.env
[3]: https://github.com/prisma-labs/graphql-yoga
[4]: ./schema.graphql
[5]: ./src/models/Authors.js
[6]: ./src/services/AuthorService.js
[7]: ./src/resolvers

