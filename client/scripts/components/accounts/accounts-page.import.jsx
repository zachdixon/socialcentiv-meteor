"use strict";

import { classNames } from 'app-deps';
import { Link } from 'Link';
import { Input } from 'Input';

export let AccountsPage = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    let accounts = Accounts.find().fetch(),
        businesses,
        selectors = {},
        modifiers = {};

    Businesses.find().fetch().map((business) => {
      let account = Accounts.findOne({id: business.business_owner_id});
      if (account) {
        Businesses._update(business._id, {$set: {business_owner_email: account.email}});
      }
    });

    if (this.state.accountTypeFilter !== "all") {
      selectors = _.assign(selectors, {account_type: this.state.accountTypeFilter});
    }
    if (this.state.textFilter) {
      let textFilterRegexp = (new RegExp(this.state.textFilter, 'ig'));
      selectors = _.assign(selectors, {$or: [{name: textFilterRegexp},{business_owner_email: textFilterRegexp}]});
    }
    if (this.state.sortBy) {
      modifiers = _.assign(modifiers, {sort: _.pairs(this.state.sortBy)});
    }
    businesses = Businesses.find(selectors, modifiers).fetch();

    return {
      user: Session.get('currentUser'),
      accounts: accounts,
      businesses: businesses
    }
  },

  getInitialState() {
    return {
      accountTypeFilter: "all",
      textFilter: "",
      sortBy: {
        "name": "asc"
      }
    }
  },

  handleInputKeyUp(e) {
    let text = e.currentTarget.value;
    this.setState({textFilter: text});
  },

  handleFilterClick(accountType) {
    this.setState({accountTypeFilter: accountType});
  },

  handleSortClick(field) {
    let sortBy = this.state.sortBy;
    switch(sortBy[field]) {
      case "asc":
        sortBy[field] = "desc";
        break;
      case "desc":
        sortBy = _.omit(sortBy, field);
        break;
      default:
        sortBy[field] = "asc";
        break;
    }
    this.setState({sortBy: sortBy});
  },

  render() {
    let tableHeaders = [
      {id: 1, field: "account_type", label: "Account Type", sortable: true},
      {id: 2, field: "name", label: "Name", sortable: true},
      {id: 3, field: "email", label: "Email", sortable: true},
      // {id: 4, field: "monthly_replies", label: "Monthly Replies", sortable: true},
      // {id: 5, field: "daily_replies", label: "Daily Replies", sortable: true},
      {id: 6, label: "Access Account", sortable: false}
    ];
    return (
      <div id="accounts-page">
        <div className="row">
          <div className="col-md-12">
            <header className="header clearfix">
              <h1 className="pull-left">Accounts</h1>
              <div className="filter-bar">
                <p>Filter By:</p>
                <Input className="form-control"
                       type="text"
                       onKeyUp={this.handleInputKeyUp}
                       placeholder="Name or Email"
                       cancelable={true}
                       wrapperClass="pull-left"
                       onCancel={this.handleInputKeyUp} />
                <button className={classNames({"active": (this.state.accountTypeFilter === "all")})} onClick={this.handleFilterClick.bind(null, "all")}>All</button>
                <button className={classNames({"active": (this.state.accountTypeFilter === "enterprise")})} onClick={this.handleFilterClick.bind(null, "enterprise")}>Enterprise</button>
                <button className={classNames({"active": (this.state.accountTypeFilter === "reply_pro")})} onClick={this.handleFilterClick.bind(null, "reply_pro")}>Reply Pro</button>
              </div>
            </header>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table className="accounts-table table table-bordered table-hover">
              <thead>
                <tr>
                  {tableHeaders.map(header => {
                    return (
                      <th key={header.id} 
                          onClick={header.sortable? this.handleSortClick.bind(null, header.field) : null}
                          className={classNames("noselect", {"sortable-header": header.sortable})}>
                        {header.label}
                        <span 
                          className={classNames("glyphicon",
                                                "pull-right", 
                                                {"glyphicon-sort-by-alphabet": this.state.sortBy[header.field] === "asc", 
                                                "glyphicon-sort-by-alphabet-alt": this.state.sortBy[header.field] === "desc"})}>
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {this.data.businesses.map((business) => {
                  let account = Accounts.findOne({id: business.business_owner_id});
                  if (account) {
                    return (
                      <BusinessRow key={business._id} account={account} business={business}/>
                    )
                  } else {
                    return null;
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
});

let BusinessRow = React.createClass({
  propTypes: {
    account: React.PropTypes.object.isRequired,
    business: React.PropTypes.object.isRequired
  },

  handleAccessAccountClick(e) {
    e.preventDefault();
    App.setCurrentUserCookies(this.props.account.email, this.props.account.authentication_token);
    Session.set('business_id', this.props.business.id);
  },

  render() {
    let account = this.props.account,
        business = this.props.business;
    return (
      <tr>
        <td className="account-type">{_.startCase(business.account_type)}</td>
        <td className="account-name">{business.name}</td>
        <td className="account-email">{account.email}</td>
        {/*<td className="account-monthly-replies">{account.monthly_replies}</td>*/}
        {/*<td className="account-daily-replies">{account.daily_replies}</td>*/}
        <td className="account-access">
          <a href={FlowRouter.path('accountTweets', {id: this.props.business.id})} onClick={this.handleAccessAccountClick}>Access Account</a>
        </td>
      </tr>
    )
  }
});