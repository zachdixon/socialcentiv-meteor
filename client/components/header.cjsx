{string} = React.PropTypes

@Header = React.createClass
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

@MainNav = React.createClass

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


@MainNavItem = React.createClass

  propTypes:
    name: string
    iconSrc: string
    iconClass: string

  className: ->
    if ActiveRoute.name(@props.name) then 'main-nav-link active' else 'main-nav-link'
  
  render: ->
    <li className="main-nav-item">
      <a className={@className()} href={Router.path(@props.name)}>
        {
          if @props.iconSrc
            <img className="smallimg main-nav-icon" src={@props.iconSrc} />
          else
            <span className={@props.iconClass}></span>
        }
        <span className="label">{@props.name.toUpperCase()}</span>
      </a>
    </li>

@MainUtilityNav = React.createClass
  mixins: [ReactMeteorData]

  getMeteorData: ->
    business: Session.get('business')

  getInitialState: ->
    open: false

  toggle: ->
    @setState open: !@getState('open')

  render: ->
    <li className="main-nav-item pull-right dropdown-nav">
      <a className="main-nav-link sub-nav-toggle" href="" onclick={@toggle}>
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
          <a className="sub-nav-link link-logout" href="" onclick={@logout}>
            <span className="glyphicon glyphicon-log-out main-nav-icon"></span>
            <span className="label">Log Out</span>
          </a>
        </li>
      </ul>
    </li>