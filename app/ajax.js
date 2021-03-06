'use strict'
let logger = require('js-logger-aknudsen').get('ajax')
let R = require('ramda')
let S = require('underscore.string.fp')

let ajax = (method, uri, params, payload) => {
  let paramStr = S.join('&', R.map(([param, value,]) => {
    return `${encodeURIComponent(param)}=${encodeURIComponent(value || '')}`
  }, R.toPairs(params || {})))
  let queryPart = !S.isBlank(paramStr) ? `?${paramStr}` : ''
  let absPath = `${uri}${queryPart}`
  let payloadJson = payload != null ? JSON.stringify(payload) : null

  return new Promise((resolve, reject) => {
    let clientAjax = require('./client/ajax')
    clientAjax(absPath, method, payloadJson, resolve, reject)
  })
}

module.exports = {
  getJson: (path, params) => {
    return ajax('get', path, params)
  },
  postJson: (path, payload) => {
    return ajax('post', path, null, payload)
  },
  putJson: (path, payload) => {
    return ajax('put', path, null, payload)
  },
  delete: (path) => {
    return ajax('delete', path)
  },
}
