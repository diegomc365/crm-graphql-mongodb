const {ApolloServer} = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});

// connect to the db
connectDB();

// server apollo
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        // console.log(req.headers['authorization'])
        // console.log(req.headers);

        const token = req.headers['authorization'] || '';
        if(token) {
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);
                console.log(usuario);
                return {
                    usuario
                }
            } catch (error) {
                console.log('Hubo un error')
                console.log(error);
            }
        }
    }
});

// start up server
server.listen().then( ({url})=> {
    console.log(`Server ready at URL ${url}`)
})