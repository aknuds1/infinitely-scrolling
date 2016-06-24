/*The MIT License (MIT)

Copyright (c) 2015 Eirik L. Vullum

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var isBrowser = (typeof window !== 'undefined');
var Packery = isBrowser ? window.Packery || require('packery') : null;
var imagesloaded = isBrowser ? require('imagesloaded') : null;
var refName = 'packeryContainer';

function PackeryComponent(React) {
    return React.createClass({
        packery: false,

        domChildren: [],

        displayName: 'PackeryComponent',

        propTypes: {
            disableImagesLoaded: React.PropTypes.bool,
            options: React.PropTypes.object
        },

        getDefaultProps: function() {
            return {
                disableImagesLoaded: false,
                options: {},
                className: '',
                elementType: 'div'
            };
        },

        initializePackery: function(force) {
            if (!this.packery || force) {
                this.packery = new Packery(
                    this.refs[refName],
                    this.props.options
                );

                this.domChildren = this.getNewDomChildren();
            }
        },

        getNewDomChildren: function() {
            var node = this.refs[refName];
            var children = this.props.options.itemSelector ? node.querySelectorAll(this.props.options.itemSelector) : node.children;
            return Array.prototype.slice.call(children);
        },

        diffDomChildren: function() {
            var oldChildren = this.domChildren.filter(function(element) {
                /*
                 * take only elements attached to DOM
                 * (aka the parent is the packery container, not null)
                 */
                return !!element.parentNode;
            });

            var newChildren = this.getNewDomChildren();

            var removed = oldChildren.filter(function(oldChild) {
                return !~newChildren.indexOf(oldChild);
            });

            var domDiff = newChildren.filter(function(newChild) {
                return !~oldChildren.indexOf(newChild);
            });

            var beginningIndex = 0;

            // get everything added to the beginning of the DOMNode list
            var prepended = domDiff.filter(function(newChild, i) {
                var prepend = (beginningIndex === newChildren.indexOf(newChild));

                if (prepend) {
                    // increase the index
                    beginningIndex++;
                }

                return prepend;
            });

            // we assume that everything else is appended
            var appended = domDiff.filter(function(el) {
                return prepended.indexOf(el) === -1;
            });

            /*
             * otherwise we reverse it because so we're going through the list picking off the items that
             * have been added at the end of the list. this complex logic is preserved in case it needs to be
             * invoked
             *
             * var endingIndex = newChildren.length - 1;
             *
             * domDiff.reverse().filter(function(newChild, i){
             *     var append = endingIndex == newChildren.indexOf(newChild);
             *
             *     if (append) {
             *         endingIndex--;
             *     }
             *
             *     return append;
             * });
             */

            // get everything added to the end of the DOMNode list
            var moved = [];

            if (removed.length === 0) {
                moved = oldChildren.filter(function(child, index) {
                    return index !== newChildren.indexOf(child);
                });
            }

            this.domChildren = newChildren;

            return {
                old: oldChildren,
                new: newChildren,
                removed: removed,
                appended: appended,
                prepended: prepended,
                moved: moved
            };
        },

        performLayout: function() {
            var diff = this.diffDomChildren();

            if (diff.removed.length > 0) {
                this.packery.remove(diff.removed);
                this.packery.reloadItems();
            }

            if (diff.appended.length > 0) {
                this.packery.appended(diff.appended);
                this.packery.reloadItems();
            }

            if (diff.prepended.length > 0) {
                this.packery.prepended(diff.prepended);
            }

            if (diff.moved.length > 0) {
                this.packery.reloadItems();
            }

            this.packery.layout();
        },

        imagesLoaded: function() {
            if (this.props.disableImagesLoaded) return;

            imagesloaded(
                this.refs[refName],
                function(instance) {
                    this.packery.layout();
                }.bind(this)
            );
        },

        componentDidMount: function() {
            this.initializePackery();
            this.imagesLoaded();
        },

        componentDidUpdate: function() {
            this.performLayout();
            this.imagesLoaded();
        },

        componentWillReceiveProps: function() {
            this._timer = setTimeout(function() {
                this.packery.reloadItems();
                this.isMounted && this.isMounted() && this.forceUpdate();
            }.bind(this), 0);
        },

        componentWillUnmount: function() {
            clearTimeout(this._timer);
        },

        render: function() {
            return React.createElement(this.props.elementType, {
                className: this.props.className,
                ref: refName
            }, this.props.children);
        }
    })
}

module.exports = PackeryComponent;
