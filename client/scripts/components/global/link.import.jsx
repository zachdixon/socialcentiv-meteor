/**
 * Mostly copied from React Router LinK
 * https://github.com/rackt/react-router/blob/0.13.x/modules/components/Link.js
 * Altered to work with FlowRouter
 * Deps: Underscore, FlowRouter
 */

let PropTypes = React.PropTypes;

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * <Link> components are used to create an <a> element that links to a route.
 * When that route is active, the link gets an "active" class name (or the
 * value of its `activeClassName` prop).
 *
 * You could use the following component to link to that route:
 *
 *   <Link to="showPost" params={{ postID: "123" }} />
 *
 * In addition to params, links may pass along query string parameters
 * using the `query` prop.
 *
 *   <Link to="showPost" params={{ postID: "123" }} query={{ show:true }}/>
 */
export class Link extends React.Component {

  handleClick(event) {
    let allowTransition = true;
    let clickResult;

    if (this.props.onClick)
      clickResult = this.props.onClick(event);

    if (isModifiedEvent(event) || !isLeftClickEvent(event))
      return;

    if (clickResult === false || event.defaultPrevented === true)
      allowTransition = false;

    event.preventDefault();

    if (allowTransition)
      FlowRouter.go(this.props.to, this.props.params, this.props.query);
  }

  /**
   * Returns the value of the "href" attribute to use on the DOM element.
   */
  getHref() {
    return FlowRouter.path(this.props.to, this.props.params, this.props.query);
  }

  /**
   * Returns the value of the "class" attribute to use on the DOM element, which contains
   * the value of the activeClassName property when this <Link> is active.
   */
  getClassName() {
    let className = this.props.className

    if (this.getActiveState())
      className += ` ${ this.props.activeClassName }`
    return className
  }

  getActiveState() {
    return FlowRouter.current().path === this.getHref();
  }

  render() {
    let props = $.extend({}, this.props, {
      href: this.getHref(),
      className: this.getClassName(),
      onClick: this.handleClick.bind(this)
    });

    if (props.activeStyle && this.getActiveState())
      props.style = props.activeStyle;

    return React.DOM.a(props, this.props.children);
  }

}

// TODO: Include these in the above class definition
// once we can use ES7 property initializers.
// https://github.com/babel/babel/issues/619


Link.propTypes = {
  activeClassName: PropTypes.string.isRequired,
  to: PropTypes.oneOfType([ PropTypes.string, PropTypes.route ]).isRequired,
  params: PropTypes.object,
  query: PropTypes.object,
  activeStyle: PropTypes.object,
  onClick: PropTypes.func
};

Link.defaultProps = {
  activeClassName: 'active',
  className: ''
};
