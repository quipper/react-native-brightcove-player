import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import BrightcovePlayer from './BrightcovePlayer';

import Orientation from 'react-native-orientation';

import PlayerEventTypes from './PlayerEventTypes';

class BCPlayer extends Component {

	constructor(props) {
		super(props);

		this.state = {
		orientation: null,
		forcedOrientation: false,
		percentageTracked: { Q1: false, Q2: false, Q3: false, Q4: false }
		}

		this.orientationDidChange = this.orientationDidChange.bind(this);

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

	/**
	 * Event triggered when the player is ready to play
	 * @param {NativeEvent} event
	 */
	onReady(event) {
		this.onEvent({ 'type': PlayerEventTypes.ON_READY });
		this.props.onReady && this.props.onReady(event);
	}

	/**
	 * Event triggered everytime that it starts playing. Can be when it starts, or when it resumes from pause
	 * @param {NativeEvent} event
	 */
	onPlay(event) {
		this.onEvent({ 'type': PlayerEventTypes.ON_PLAY });
		this.props.onPlay && this.props.onPlay(event);
	}

	/**
	 * Event triggered everytime the user clicks pause
	 * @param {NativeEvent} event
	 */
	onPause(event) {
		this.onEvent({ 'type': PlayerEventTypes.ON_PAUSE });
		this.props.onPause && this.props.onPause(event);
	}

	/**
	 * Event triggered when the video ends
	 * @param {NativeEvent} event
	 */
	onEnd(event) {
		this.onEvent({ 'type': PlayerEventTypes.ON_END });
		this.props.onEnd && this.props.onEnd(event);
	}

	/**
	 * Event triggered as the stream progress.
	 * @param {NativeEvent} event
	 * @param {number} event.currentTime - The current time of the video
	 * @param {number} event.duration - The total duration of the video
	 */
	onProgress(event) {
		let { currentTime, duration } = event,
			{ percentageTracked } = this.state;

		/*
		* Calculate the percentage played
		*/
		let percentagePlayed = Math.round(currentTime / duration * 100),
			roundUpPercentage = Math.ceil(percentagePlayed / 25) * 25 || 25; // make sure that 0 is 25

		/**
		 * The following logic is applied:
		 * Between 0% - 25% - Track Q1 mark
		 * Between 25% - 50% - Track Q2 mark
		 * Between 50% - 75% - Track Q3 mark
		 * Between 75% - 100% - Track Q4 mark
		 */
		if (roundUpPercentage === 25 && !percentageTracked.Q1) {
			this.trackQuarters(1);
		} else if (roundUpPercentage === 50 && !percentageTracked.Q2) {
			this.trackQuarters(2);
		} else if (roundUpPercentage === 75 && !percentageTracked.Q3) {
			this.trackQuarters(3);
		} else if (roundUpPercentage === 100 && !percentageTracked.Q4) {
			this.trackQuarters(4);
		}

		// Fire the call back of the onProgress
		this.props.onProgress && this.props.onProgress(event);
	}


	/**
	 * Method that tracks back to the "onEvent" call back to communicate a tracking of a quarter
	 * @param {number} mark - The number of the quarter (1,2,3,4)
	 */
	trackQuarters(mark) {
		this.setState((prevState) => ({
			percentageTracked: {
				...prevState.percentageTracked,
				[`Q${mark}`]: true
			}
		}));

		this.onEvent({ type: PlayerEventTypes[`ON_PROGRESS_Q${mark}`] });
	}

	/**
	 * Event triggered when the fullscreen happens
	 * @param {NativeEvent} event
	 */
	onEnterFullscreen(event) {
		this.onEvent({ 'type': PlayerEventTypes.ON_ENTER_FULLSCREEN });
		this.props.onEnterFullscreen && this.props.onEnterFullscreen(event);
	}

	/**
	 * Event triggered when the user exists from the fullscreen
	 * @param {NativeEvent} event
	 */
	onExitFullscreen(event) {
		this.onEvent({ 'type': PlayerEventTypes.ON_EXIT_FULLSCREEN });
		this.props.onExitFullscreen && this.props.onExitFullscreen(event);
	}

	/**
	 * Handler to normalise the events and send it back to the onEvent callback if that exists
	 * @param {object} event
	 * @param {string} event.type - the event type
	 */
	onEvent(event) {
		event = {
			...event,
			name: 'This is the name of the video',
			videoId: this.props.videoId,
			accountId: this.props.accountId,
			playerId: this.player.props.playerId
		}
		this.props.onEvent && this.props.onEvent(event);
	}

	render() {
		return (<BrightcovePlayer
			ref={(player) => this.player = player}
			{...this.props}
			style={[styles.player, this.props.style]}
			playerId={this.props.playerId ? this.props.playerId : `com.brightcove/react-native/${Platform.OS}`}
			onReady={this.onReady.bind(this)}
			onPlay={this.onPlay.bind(this)}
			onPause={this.onPause.bind(this)}
			onEnd={this.onEnd.bind(this)}
			onProgress={this.onProgress.bind(this)}
			onEnterFullscreen={this.onEnterFullscreen.bind(this)}
			onExitFullscreen={this.onExitFullscreen.bind(this)}
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

module.exports = BCPlayer;
