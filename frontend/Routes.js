import propTypes from 'prop-types';
import React, { Component } from 'react';

import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import AuthGuard from './components/AuthGuard';

import LoginPage from './containers/LoginPage';
import LogoutPage from './containers/LogoutPage';
import Dashboard from './containers/Dashboard';
import Programs from './containers/Programs';
import Students from './containers/Students';
import StudentShow from './containers/StudentShow';

import NotFound from './containers/NotFound';

const Routes = () => {
	return (
		<div>
			<Switch>
				<Route path="/" exact component={LoginPage} />
				<AuthGuard path="/dashboard" exact component={Dashboard} />
				<AuthGuard path="/programs" exact component={Programs} />
				<AuthGuard path="/students" exact component={Students} />
				<AuthGuard path="/students/:id" exact component={StudentShow} />
				<Route path="/logout" exact component={LogoutPage} />
				<Route path="*" component={NotFound} />
			</Switch>
		</div>
	);
};

export default Routes;
