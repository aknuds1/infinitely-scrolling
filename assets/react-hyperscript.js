/*Copyright (c) 2014 Matt Morgan

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
function h(componentOrTag, properties, children) {
  // If a child array or text node are passed as the second argument, shift them
  if (!children && isChildren(properties)) {
    children = properties;
    properties = {};
  }

  properties = properties || {};

  // Supported nested dataset attributes
  if (properties.dataset) {
    Object.keys(properties.dataset).forEach(function unnest(attrName) {
      var dashedAttr = attrName.replace(/([a-z])([A-Z])/, function dash(match) {
        return match[0] + '-' + match[1].toLowerCase();
      });
      properties['data-' + dashedAttr] = properties.dataset[attrName];
    });
  }

  // Support nested attributes
  if (properties.attributes) {
    Object.keys(properties.attributes).forEach(function unnest(attrName) {
      properties[attrName] = properties.attributes[attrName];
    });
  }

  // When a selector, parse the tag name and fill out the properties object
  if (typeof componentOrTag === 'string') {
    componentOrTag = parseTag(componentOrTag, properties);
  }

  // Create the element
  var args = [componentOrTag, properties].concat(children);
  return React.createElement.apply(React, args);
}

function isChildren(x) {
  return typeof x === 'string' || typeof x === 'number' || Array.isArray(x);
}
