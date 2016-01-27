'use strict'
let immstruct = require('immstruct')
let ReactDom = require('react-dom')
let Logger = require('js-logger-aknudsen')
let component = require('omniscient')

let Content = require('./views/content')
let layout = require('./layout')

require('./app.styl')
require('./styles/fonts.css')

Logger.useDefaults({
  formatter: (messages, context) => {
    messages.unshift(`${context.level.name} - [${context.name}]`)
  },
})

let logger = Logger.get('entry')

let structure = immstruct('state', {})

let App = component('App', (cursor) => {
  return layout.render(cursor, Content(cursor))
})

let render = () => {
  ReactDom.render(App(structure.cursor()), document.getElementById('container'))
}

render()
structure.on('swap', render)
