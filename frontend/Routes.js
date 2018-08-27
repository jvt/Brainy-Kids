import propTypes from "prop-types";
import React, { Component } from "react";

import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import LoginPage from "./containers/LoginPage";
import Dashboard from "./containers/Dashboard";
import Users from "./containers/Users";
import UserShow from './containers/UserShow';

import NotFound from './containers/NotFound';

const Routes = () => {
	return (
		<div>
			<Switch>
				<Route path="/" exact component={LoginPage} />
				<Route path="/dashboard" exact component={Dashboard} />
				<Route path="/users" exact component={Users} />
				<Route path="/users/:id" exact component={UserShow} />
				<Route path="*" component={NotFound}/>
			</Switch>
		</div>
	);
}

export default Routes;
