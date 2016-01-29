'use strict'
let immstruct = require('immstruct')
let ReactDom = require('react-dom')
let Logger = require('js-logger-aknudsen')
let h = require('react-hyperscript')
let component = require('omniscient')

let Content = require('./views/content')

require('normalize.css/normalize.css')
require('purecss/build/pure.css')
require('./app.styl')
require('./layout.styl')

Logger.useDefaults({
  formatter: (messages, context) => {
    messages.unshift(`${context.level.name} - [${context.name}]`)
  },
})

let logger = Logger.get('entry')

let structure = immstruct('state', {})

let App = component('App', (cursor) => {
  return h('div', [
    h('#content', [Content(cursor),]),
  ])
})

let render = () => {
  ReactDom.render(App(structure.cursor()), document.getElementById('container'))
}

render()
structure.on('swap', render)
