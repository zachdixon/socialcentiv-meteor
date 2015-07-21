{ReactOnClickOutside, classNames} = NpmDependencies

{string} = React.PropTypes

Header = React.createClass
  render: ->
    <div className="main-nav-wrapper">
      <div className="container">
        <div className="row">
          <a>
            <div className="logo col-md-2 col-sm-2 col-xs-2">
              <img alt="socialcentiv logo" className="logo-img" src="images/new-logo.png" />
            </div>
          </a>
          <MainNav/>
        </div>
      </div>
    </div>

MainNav = React.createClass
  routes: [
    {id: 1, name: "tweets", iconSrc: "images/Twitter_logo_white.png"}
    {id: 2, name: "campaigns", iconClass: "ss-bullseye main-nav-icon"}
    {id: 3, name: "reports", iconClass: "icon-pie main-nav-icon"}
  ]

  render: ->
    <nav>
      <a className="main-nav-menu" href="#"><span className="glyphicon glyphicon-th"></span></a>
      <ul id="main-nav">
        <a className="close-mobile-menu" href="#"><span className="glyphicon glyphicon-remove"></span></a>
        {
          for route in @routes
            <MainNavItem key={route.id} name={route.name} iconSrc={route.iconSrc} iconClass={route.iconClass} />
        }
        <MainUtilityNav />
      </ul>
    </nav>


MainNavItem = React.createClass
  propTypes:
    name: string
    iconSrc: string
    iconClass: string
  
  render: ->
    <li className="main-nav-item">
      {active = ActiveRoute.name(@props.name)}
      <a className={classNames('main-nav-link', {active: active})} href={Router.path(@props.name)}>
        {
          if @props.iconSrc
            <img className="smallimg main-nav-icon" src={@props.iconSrc} />
          else
            <span className={@props.iconClass}></span>
        }
        <span className="label">{@props.name.toUpperCase()}</span>
      </a>
    </li>

MainUtilityNav = React.createClass
  mixins: [ReactMeteorData, ReactOnClickOutside]

  getMeteorData: ->
    business: Session.get('business')

  getInitialState: ->
    open: false

  toggle: ->
    @setState open: !@state.open

  handleClickOutside: (e) ->
    if @state.open then @toggle()

  handleLogout: (e) ->
    # Clear cookies
    Cookie.remove('currentUserEmail', {path: '/', domain: App.DOMAIN})
    Cookie.remove('currentUserAuth', {path: '/', domain: App.DOMAIN})
    # Clear session variables
    Object.keys(Session.keys).forEach (key) ->
      Session.set key, undefined
    # Clearing currentUser should stop observers, but just in case
    # Clear local collections
    for k,collection of App.collections
      collection.observer?.stop()
      collection.remove({})

  render: ->
    <li className="main-nav-item pull-right dropdown-nav">
      <a className="main-nav-link sub-nav-toggle" href="" onClick={@toggle}>
        {
          if @data.business?.status is 'active'
            <span className="account-logo-wrapper">
              <img className="account-logo" src={@data.business.twitter_avatar_url}/>
            </span>
        }
        <span className="label">{@data.business?.name}</span>
      </a>
      <ul className="sub-nav" style={{display: if @state.open then 'block' else 'none'}}>
        <li className="sub-nav-item">
          <a className="sub-nav-link" href="/account">
            <span className="glyphicon glyphicon-user main-nav-icon"></span>
            <span className="label">My Account</span>
          </a>
        </li>
        <li className="sub-nav-item">
          <a className="sub-nav-link link-logout" href="" onClick={@handleLogout}>
            <span className="glyphicon glyphicon-log-out main-nav-icon"></span>
            <span className="label">Log Out</span>
          </a>
        </li>
      </ul>
    </li>

_.extend App.Components, {Header, MainNav, MainNavItem, MainUtilityNav}
