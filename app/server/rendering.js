// 'use strict'
// let R = require('ramda')
// let logger = require('js-logger-aknudsen').get('server.rendering')
// let immutable = require('immutable')
// let immstruct = require('immstruct')
// let ReactDomServer = require('react-dom/server')
// let Boom = require('boom')
//
// let router = require('../router')
// let {normalizePath,} = require('../urlUtils')
// let calendar = require('../views/calendar')
// let {createRouterState, updateRouterState, NotFoundError,} = require('../sharedRouting')
// let routeMap = require('../routeMap')
//
// let getInitialRouterState = (request) => {
//   let currentPath = request.path
//   logger.debug(`Computing initial router state, path is '${currentPath}'`)
//   let navItems = R.map((navItem) => {
//     let path = !navItem.isExternal ? normalizePath(navItem.path) : navItem.path
//     let isSelected = path === currentPath
//     logger.debug(`Nav item '${navItem.text}' is selected: ${isSelected}, ${path}`)
//     return R.merge(navItem, {
//       path,
//       isSelected,
//     })
//   }, [
//     {path: '/', text: 'Calendar',},
//     {path: '/about', text: 'About',},
//   ])
//   if (!R.any((navItem) => {return navItem.isSelected}, navItems)) {
//     logger.debug(`Defaulting to root nav item being selected`)
//     let navItem = R.find((navItem) => {return navItem.path === '/'}, navItems)
//     navItem.isSelected = true
//   }
//   return immutable.fromJS({
//     currentPath,
//     isLoading: false,
//     navItems,
//   })
// }
//
// let renderIndex = (request, reply) => {
//   immstruct.clear()
//   let cursor = immstruct('state', {
//     calendar: calendar.createState(),
//     router: getInitialRouterState(request),
//   }).cursor()
//   cursor = cursor.mergeDeep({
//     router: createRouterState(routeMap),
//   })
//   return updateRouterState(cursor, request.path, request.query)
//     .then(([cursor, newState,]) => {
//       logger.debug(`Got new state:`, newState)
//       cursor = cursor.mergeDeep(R.merge(newState, {
//         router: {
//           isLoading: false,
//         },
//       }))
//       let initialState = cursor.toJS()
//       logger.debug(`Successfully loaded initial state:`, initialState)
//       reply.view('index', {
//         initialState: JSON.stringify(initialState),
//       })
//     }, (error) => {
//       if (error instanceof NotFoundError) {
//         logger.debug(`Current route not recognized`)
//         reply(Boom.notFound())
//       } else {
//         logger.error(`Failed to load initial state: '${error}':`, error.stack)
//         reply(Boom.badImplementation())
//       }
//     })
//     .catch((error) => {
//       logger.error(`Rendering failed: ${error}`, error.stack)
//       reply(Boom.badImplementation())
//     })
// }
//
// module.exports = {
//   renderIndex,
// }
