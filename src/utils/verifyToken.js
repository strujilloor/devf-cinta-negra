const jwt = require('jsonwebtoken');
const { getOneAuthorByEmail } = require('../services/AuthorService');

const verifyToken = async req => { // request.
    try {
        const Authorization = req.get('Authorization'); // se puede obtener el valor dentro de un objeto utilizando get.
        if (Authorization) {
            // formato: JWT sadsdfadsds.sadsdasdad.sasdadfdsfsd
            const formatedToken = Authorization.replace('JWT ',''); // reemplazamos JWT por una cadena vacia por que eso no lo vamos a necesitar.
            // nos quedaría así: sadsdfadsds.sadsdasdad.sasdadfdsfsd
            const payload = jwt.verify(formatedToken, process.env.SECRET_KEY_JWT); // verify: verifica en el token (si el tiempo acabó).
            if(!payload) return req; // si nuestro payload no existe vamos a retornar nuestro request así solito.
            const userAuth = await getOneAuthorByEmail(payload.email); // si si, traigame el usuario.
            if (!userAuth) return req;
            return userAuth; // devuelvame el usuario completo. (quedará guardado en nuestro contexto)
        } else {
            return {}; // regresariamos al userAuth del contexto un objeto vacio.
        }
    }catch (e) {
        throw new Error(e.message);
    }
};

module.exports = verifyToken; 