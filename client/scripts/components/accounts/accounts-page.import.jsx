"use strict";

import { classNames } from 'app-deps';
import { Link } from 'client/scripts/components/global/link';

export let AccountsPage = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      user: Session.get('currentUser'),
      accounts: Session.get('accounts') || [] // FIXME - use Accounts collection instead for easier filtering/sorting
    }
  },

  getInitialState() {
    return {
      filter: "all",
      accounts: []
    }
  },

  handleFilterClick(filter) {
    this.setState({filter: filter});
  },

  render() {
    return (
      <div id="accounts-page">
        <div className="row">
          <div className="col-md-12">
            <header className="header clearfix">
              <h1 className="pull-left">Accounts</h1>
              <div className="filter-bar">
                <p>Filter By:</p>
                <button className={classNames({"active": (this.state.filter === "all")})} onClick={this.handleFilterClick.bind(null, "all")}>All</button>
                <button className={classNames({"active": (this.state.filter === "enterprise")})} onClick={this.handleFilterClick.bind(null, "enterprise")}>Enterprise</button>
                <button className={classNames({"active": (this.state.filter === "reply_pro")})} onClick={this.handleFilterClick.bind(null, "reply_pro")}>Reply Pro</button>
              </div>
            </header>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table className="accounts-table table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Account Type</th>
                  <th>Account Name</th>
                  <th>Email</th>
                  <th>Monthly Replies</th>
                  <th>Daily Replies</th>
                  <th>Access Account</th>
                </tr>
              </thead>
              <tbody>
                {this.data.accounts.map((account) => {
                  if (this.state.filter === "all" || account.account_type === this.state.filter) {
                    return (
                      <AccountRow key={account.id} account={account} />
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

let AccountRow = React.createClass({
  propTypes: {
    account: React.PropTypes.object
  },

  render() {
    let account = this.props.account;
    return (
      <tr>
        <td className="account-type">{_.startCase(account.account_type)}</td>
        <td className="account-name">{account.name}</td>
        <td className="account-email">{account.email}</td>
        <td className="account-monthly-replies">{account.monthly_replies}</td>
        <td className="account-daily-replies">{account.daily_replies}</td>
        <td className="account-access">
          <Link to={'/managed/accounts/' + account.id + '/tweets'}>Access Account</Link>
        </td>
      </tr>
    )
  }
});