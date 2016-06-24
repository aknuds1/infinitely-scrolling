'use strict';
var React = require('react')
let s = require('react-prefixr')

function realRender(direction) {
  var windowWidth = this.state.windowWidth;
  var windowHeight = this.state.windowHeight;
  var elementHeight = this.props.mobileWidth <= windowWidth ? this.props.elementHeight :
    this.props.elementMobileHeight;

  var windowY, elementY;
  if (direction === 'vertical') {
    windowY = windowHeight;
    elementY = elementHeight;
  } else {
    windowY = windowWidth;
    elementY = elementWidth;
  }

  var numElements = 1;

  // Number of pixels the container has been scrolled from the top
  var scrollStart = this.state.scrollTop - this.props.scrollDelta;
  console.log(`Scrolled ${this.state.scrollTop} pixels from the top`)
  var numBefore = Math.floor(scrollStart / elementHeight);
  console.log(`Number of elements before scroll start: ${numBefore}`)
  var numVisible = Math.ceil((numBefore * elementY + windowY) / elementY);
  console.log(`Number of visible elements: ${numVisible}`)

  // Keep some extra elements before and after visible elements
  var extra = numElements === 1 ? Math.ceil(numVisible / 2) : 2;
  var lowerLimit = (numBefore - extra) * numElements;
  var higherLimit = (numVisible + extra * 2) * numElements;
  console.log(`Lower limit: ${lowerLimit}, higherLimit: ${higherLimit}, extra: ${extra}`)

  var elementsToRender = [];
  this.props.data.forEach(function (obj, index) {
    if (index >= lowerLimit && index < higherLimit) {
      console.log(`Rendering data item ${index}:`, obj)
      var column, row;
      if (direction === 'vertical') {
        column = index % numElements;
        row = Math.floor(index / numElements);
      } else {
        row = index % numElements;
        column = Math.floor(index / numElements);
      }
      var id = obj.id != null ? obj.id : obj._id;
      var yOffset = (row * elementHeight);
      var subContainer = SubContainer(
        {
          key: id,
          transform: 'translate(0, ' + yOffset + 'px)',
          height: elementHeight + 'px',
        },
        this.props.childComponent(obj)
      );
      elementsToRender.push(subContainer);
    } else {
      console.log(`Skipping data item ${index}`)
    }
  }.bind(this));

  return React.createElement(this.props.containerComponent,
    {
      className: 'infinite-container', style: {
        height: (elementHeight * Math.ceil(this.props.data.length / numElements)) + 'px',
        width: '100%',
        position: 'relative',
      },
    },
    elementsToRender
  );
}

var SubContainer = React.createFactory(React.createClass({
  displayName: 'Sub-Infinity',
  getInitialState: function () {
    return {
      transform: this.props.transform + ' scale(1)',
      opacity: '0',
    };
  },
  componentDidMount: function (argument) {
    this.setState({transform: this.props.transform + ' scale(1)', opacity: '1',});
  },
  componentWillReceiveProps: function (newProps) {
    this.setState({transform: newProps.transform + ' scale(1)',});
  },
  componentWillEnter: function (cb) {
    this.setState({transform: this.props.transform + ' scale(1)', opacity: '0',});
    setTimeout(cb, 100);
  },
  componentDidEnter: function () {
    this.setState({transform: this.props.transform + ' scale(1)', opacity: '1',});
  },
  componentWillLeave: function (cb) {
    this.setState({transform: this.props.transform + ' scale(1)', opacity: '0',});
    setTimeout(cb, 400);
  },
  render: function () {
    return React.DOM.div({style: s({
      position: 'absolute',
      top: '0',
      left: '0',
      transform: this.state.transform,
      width: this.props.width,
      height: this.props.height,
      transition: this.props.transition,
      opacity: this.state.opacity,
    }),},
      this.props.children
    );
  },
}));

var Infinite = React.createClass({
  displayName: 'React-Infinity',

  getDefaultProps: function () {
    return {
      data: [],
      maxColumns: 100,
      transition: '0.5s ease',
      id: null,
      className: 'infinite-container',
      elementClassName: '',
      component: 'div',
      containerComponent: 'div',
      mobileWidth: 480,
      justifyOnMobile: true,
      scrollDelta: 0,
      direction: 'vertical',
      preRender: false,
    };
  },

  propTypes: {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    maxColumns: React.PropTypes.number,
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    elementHeight: React.PropTypes.number,
    mobileWidth: React.PropTypes.number,
    elementMobileHeight: React.PropTypes.number,
    elementMobileWidth: React.PropTypes.number,
    justifyOnMobile: React.PropTypes.bool,
    preRender: React.PropTypes.bool,
    scrollDelta: React.PropTypes.number,
  },

  getInitialState: function () {
    return {
      scrollTop: 0,
      windowWidth: this.props.windowWidth || 800,
      windowHeight: this.props.windowHeight || 600,
      isLoaded: false,
      extra: {
        count: 0,
      },
    };
  },

  componentDidMount: function () {
    global.addEventListener('resize', this.onResize);

    global.addEventListener('scroll', this.onScroll);
    this.onScroll()

    this.setState({
      isLoaded: true,
      windowWidth: global.innerWidth,
      windowHeight: global.innerHeight,
      elementHeight: this.props.elementHeight ||
        this.refs.element1.getDOMNode().getClientRects()[0].height,
      scrollTop: global.scrollY || 0,
    });
  },

  onScroll: function () {
    var scrollTop = global.scrollY;

    if (this.state.scrollTop !== scrollTop) {
      this.setState({scrollTop: scrollTop,});
    }
  },

  onResize: function () {
    this.setState({windowHeight: global.innerHeight, windowWidth: global.innerWidth,});
  },

  componentWillUnmount: function () {
    global.removeEventListener('resize', this.onResize);
    global.removeEventListener('scroll', this.onScroll);
  },

  render: function () {
    if (!this.state.isLoaded) {
      return this.props.preRender ? React.createElement(this.props.containerComponent,
        {
          className: this.props.className,
          id: this.props.id,
          style: {
            fontSize: '0',
            position: 'relative',
          },
        }, this.props.data.map(function (elementData, i) {
          return React.createElement(this.props.component, {
            style: {display: 'inline-block', margin: '32px', verticalAlign: 'top',},
          }, React.createElement(this.props.childComponent, elementData));
        }.bind(this)))
        : null;
    } else {
      var direction = this.props.direction;
      if (direction !== 'horizontal' && direction !== 'vertical') {
        direction = 'vertical';
        console.warn('the prop `direction` must be either "vertical" or "horizontal". It is set to',
          direction);
      }
      return realRender.call(this, direction);
    }
  },
});

module.exports = Infinite;
