import React, { Component } from 'react';
import { Row, Col, Card, Icon, Spin, Button } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class LoadingScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timeoutWarning: false,
			assumeOffline: false,
		};
		this.offlineTimer = null;
		this.slowConnectionTimer = null;
	}

	componentWillMount() {
		// Display a slow-connection warning after 3.5s
		this.slowConnectionTimer = window.setTimeout(() => {
			this.setState({ timeoutWarning: true });
		}, 3.5 * 1000);

		// Display an alert that we believe the backend is offline after 10s
		this.offlineTimer = window.setTimeout(() => {
			this.setState({ assumeOffline: true });
		}, 10 * 1000);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user && this.props.user) {
			if (nextProps.user.error !== this.props.user.error) {
				if (this.slowConnectionTimer) {
					window.clearTimeout(this.slowConnectionTimer);
				}
				if (this.offlineTimer) window.clearTimeout(this.offlineTimer);
				this.setState({ assumeOffline: true });
			}
		}
	}

	componentWillUnmount() {
		if (this.slowConnectionTimer) {
			window.clearTimeout(this.slowConnectionTimer);
		}
		if (this.offlineTimer) window.clearTimeout(this.offlineTimer);
	}

	render() {
		const { timeoutWarning, assumeOffline } = this.state;
		return (
			<div style={{ marginBottom: 50 }}>
				<Helmet>
					<title>Brainy Kids | Loading Profile...</title>
				</Helmet>
				<Row type="flex" justify="center">
					<Col xs={22} sm={22} md={8} style={{ marginTop: 100 }}>
						<Card
							title="Loading Your Profile"
							className="cardShadow"
							style={{
								marginTop: 50,
								marginLeft: 'auto',
								marginRight: 'auto',
							}}>
							{!assumeOffline && (
								<div style={{ textAlign: 'center' }}>
									<Spin />
									{timeoutWarning && (
										// TODO: Ensure this is animated
										<div
											style={{
												marginTop: 20,
												borderTop:
													'1px solid rgba(0,0,0,0.1)',
												paddingTop: 10,
											}}>
											<h1>
												<Icon
													type="info-circle-o"
													style={{ marignRight: 10 }}
												/>
											</h1>
											<p>
												Hmm... This is taking longer
												than usual. We've reported this
												to our developers so they can
												investigate.
											</p>
										</div>
									)}
								</div>
							)}
							{assumeOffline && (
								<div style={{ textAlign: 'center' }}>
									<h1>
										<Icon
											type="exclamation-circle"
											style={{ marignRight: 10 }}
										/>
									</h1>
									<h3>Well, this extremely is awkward.</h3>
									<p>
										We sincerely apologize for the
										inconvenience! It looks like the Brainy
										Kids backend infrastructure isn't
										responding right now. We've alerted our
										developers about this issue!
									</p>
									<p>
										You can try{' '}
										<Link to="/logout">logging out</Link>.
										This may fix the error you're currently
										experiencing.
									</p>
								</div>
							)}
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user ? state.user : null,
	};
};

export default connect(mapStateToProps)(LoadingScreen);
