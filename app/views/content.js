'use strict'
let component = require('omniscient')
let logger = require('js-logger-aknudsen').get('views.calendar')
let immutable = require('immutable')
let h = require('react-hyperscript')
let Parse = require('parse')
let R = require('ramda')
let S = require('underscore.string.fp')
let moment = require('moment')
let React = require('react')
let Infinite = React.createFactory(require('../react-infinity'))

let ajax = require('../ajax')

require('./content.styl')

let Content = component('Content', (cursor) => {
  let state = cursor.toJS()
  logger.debug(`Rendering content, state:`, state)
  return h('.pure-g', [
    h('.pure-u-1', [
      h('#content-pad', [
        Infinite({
          childComponent: component(({text, id,}) => {
            return h('.item', text)
          }),
          data: [
            {
              id: 1,
              text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
            },
            {
              id: 2,
              text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
            },
            {
              id: 3,
              text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
            },
            {
              id: 4,
              text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
            },
          ],
          elementWidth: 900,
          elementHeight: 100,
          stackElements: false,
          align: 'left',
        }),
      ]),
    ]),
  ])
})

module.exports = Content
