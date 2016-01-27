'use strict'
GLOBAL.__IS_BROWSER__ = false

let Hapi = require('hapi')
let R = require('ramda')
let path = require('path')
let jade = require('jade')
let immstruct = require('immstruct')
let Boom = require('boom')
let Logger = require('js-logger-aknudsen')
let logger = Logger.get('server')
Logger.useDefaults({
  formatter: (messages, context) => {
    messages.unshift(`${context.level.name} - [${context.name}]`)
  },
})

let server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, '../public'),
      },
    },
  },
})
let port = 8000
server.connection({
  host: '0.0.0.0',
  port,
})

server.register(R.map((x) => {return require(x)}, ['inert', 'vision',]), (err) => {
  if (err != null) {
    throw err
  }

  server.views({
    engines: { jade, },
    path: __dirname + '/templates',
    compileOptions: {
      pretty: true,
    },
  })

  server.route({
    method: ['GET',],
    path: '/{path*}',
    handler: (request, reply) => {
      reply.view('index')
    },
  })
  server.route({
    method: ['GET',],
    path: '/bundle.js',
    handler: {
      file: path.join(__dirname, '../dist/bundle.js'),
    },
  })
  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        listing: true,
      },
    },
  })

  server.start((err) => {
    if (err != null) {
      logger.error(`Failed to start server: ${err}`)
      process.exit(1)
    } else {
      logger.info('Server running at', server.info.uri)
    }
  })
})
