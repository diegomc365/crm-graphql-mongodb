const {ApolloServer} = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers')

// server
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// start up server
server.listen().then( ({url})=> {
    console.log(`Servidor listo en la URL ${url}`)
})