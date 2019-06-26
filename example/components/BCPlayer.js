import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { BrightcovePlayer } from 'react-native-brightcove-player';

import Orientation from 'react-native-orientation';

export default class BCPlayer extends Component {

	onEnterFullscreen() {
		Orientation.lockToLandscape();
		this.props.onEnterFullscreen  && this.props.onEnterFullscreen();
	}

	onExitFullscreen() {
		Orientation.unlockAllOrientations();
		this.props.onExitFullscreen  && this.props.onExitFullscreen();
	}

	render() {
		return (<BrightcovePlayer
					{...this.props}
					style={[styles.player, this.props.style]}
					onEnterFullscreen={this.onEnterFullscreen.bind(this)}
					onExitFullscreen={this.onExitFullscreen.bind(this)}
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
		backgroundColor: 'green'
	}
});
