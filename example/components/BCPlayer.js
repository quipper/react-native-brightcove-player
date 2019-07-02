import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { BrightcovePlayer } from 'react-native-brightcove-player';

import Orientation from 'react-native-orientation';

export default class BCPlayer extends Component {

	constructor(props) {
		super(props);

		this.state = {
			orientation: null,
			forcedOrientation: false
		}

		this.orientationDidChange = this.orientationDidChange.bind(this);
		this.onBeforeEnterFullscreen = this.onBeforeEnterFullscreen.bind(this);
		this.onBeforeExitFullscreen = this.onBeforeExitFullscreen.bind(this);
	}

	componentWillMount() {
		// The getOrientation method is async. It happens sometimes that
		// you need the orientation at the moment the JS runtime starts running on device.
		// `getInitialOrientation` returns directly because its a constant set at the
		// beginning of the JS runtime.

		const initial = Orientation.getInitialOrientation();
		this.setState({ orientation: initial });
		// Remember to remove listener
		Orientation.removeOrientationListener(this.orientationDidChange);
	}

	componentDidMount() {
 		Orientation.addOrientationListener(this.orientationDidChange);
	}

	onBeforeEnterFullscreen() {

		if (this.state.orientation === 'PORTRAIT') {
			this.setState({ forcedOrientation: true });
			Orientation.lockToLandscape();
		}

		this.props.onBeforeEnterFullscreen  && this.props.onBeforeEnterFullscreen();
	}

	onBeforeExitFullscreen() {
		this.setState({ forcedOrientation: false });

		if (Platform.OS === 'ios') {
			Orientation.lockToPortrait();
		}
		Orientation.unlockAllOrientations();

		this.props.onBeforeExitFullscreen  && this.props.onBeforeExitFullscreen();
	}

	orientationDidChange(orientation) {
		console.log("orientation did change");
		// If the player hasn't been loaded yet, then don't do anything
		if (!this.player) return;

		switch (orientation) {
			case 'LANDSCAPE':
				// Only set the fullscreen in this case, if the forced orientation by the "lockTolandscape" hasn't been called
				// otherwise, if you call the setfullscreen twice, it might be buggy
				if (!this.state.forcedOrientation) {
					this.player.setFullscreen(true);
				}
			break;
			case 'PORTRAIT':
				this.player.setFullscreen(false);
			break;
		}

		this.setState({ orientation });
	}

	render() {
		return (<BrightcovePlayer
					ref={(player) => this.player = player}
					{...this.props}
					style={[styles.player, this.props.style]}
					playerId={this.props.playerId ? this.props.playerId : `com.brightcove/react-native/${Platform.OS}`}
					onBeforeEnterFullscreen={this.onBeforeEnterFullscreen}
					onBeforeExitFullscreen={this.onBeforeExitFullscreen}
				/>
		);
	}
}

/**
 * Component styles
 */
const styles = StyleSheet.create({
	player: {
		width: '100%',
		aspectRatio: 16/9,
		backgroundColor: '#000000'
	}
});
