import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { BrightcovePlayer } from 'react-native-brightcove-player';

import Orientation from 'react-native-orientation';

export default class BCPlayer extends Component {

	state = {
		orientation: null
	}

	componentWillMount() {
		// The getOrientation method is async. It happens sometimes that
		// you need the orientation at the moment the JS runtime starts running on device.
		// `getInitialOrientation` returns directly because its a constant set at the
		// beginning of the JS runtime.

		const initial = Orientation.getInitialOrientation();
		this.setState({ orientation: initial });
	}

	onBeforeEnterFullscreen() {
		Orientation.lockToLandscape();
		this.props.onBeforeEnterFullscreen  && this.props.onBeforeEnterFullscreen();
	}

	onBeforeExitFullscreen() {
		Orientation.lockToPortrait();
		Orientation.unlockAllOrientations();
		this.props.onBeforeExitFullscreen  && this.props.onBeforeExitFullscreen();
	}

	render() {
		return (<BrightcovePlayer
					{...this.props}
					style={[styles.player, this.props.style]}
					onBeforeEnterFullscreen={this.onBeforeEnterFullscreen.bind(this)}
					onBeforeExitFullscreen={this.onBeforeExitFullscreen.bind(this)}
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
