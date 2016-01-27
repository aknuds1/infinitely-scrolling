'use strict'
let h = require('react-hyperscript')
let R = require('ramda')
let S = require('underscore.string.fp')
let component = require('omniscient')

require('purecss/build/pure.css')
require('normalize.css/normalize.css')
require('./layout.styl')

let logger = require('js-logger-aknudsen').get('layout')

let Header = component('Header', (cursor) => {
  logger.debug('Header rendering')
  let navItems = cursor.cursor(['router', 'navItems',]).toJS()
  logger.debug('Nav items:', navItems)
  return h('header', [
    h('nav#menu.pure-menu.pure-menu-open.pure-menu-fixed.pure-menu-horizontal', [
      h('a.pure-menu-heading', {href: '/',}, 'InfinitelyScrolling'),
      h('ul.pure-menu-list', R.addIndex(R.map)((navItem, i) => {
        let classes = ['pure-menu-item', navItem.isSelected ? 'pure-menu-selected' : null,]
        let extraAttrs = navItem.isExternal ? {target: '_blank',} : {}
        return h(`li.${S.join('.', classes)}`, [
          h('a.pure-menu-link', R.merge({href: navItem.path,}, extraAttrs), navItem.text),
        ])
      }, navItems)),
    ]),
  ])
})

let Footer = component('Footer', () => {
  return h('footer', [
    h('p', 'InfinitelyScrolling.'),
    h('p', [
      '© 2016 ',
      h('a', {href: 'http://arveknudsen.com', target: '_blank',}, 'Arve Knudsen'),
    ]),
  ])
})

module.exports.render = (cursor, page) => {
  logger.debug(`Layout rendering`)
  return h('div', [
    Header(cursor),
    h('#content', [page,]),
    Footer(),
  ])
}
