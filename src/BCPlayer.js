import React, {Component} from 'react'
import {Animated, BackHandler, Dimensions, Image, Platform, StatusBar, StyleSheet, Text} from 'react-native'
import Orientation from 'react-native-orientation'
import BrightcovePlayer from "./BrightcovePlayer";
import PlayerEventTypes from "./PlayerEventTypes";

const checkSource = (uri) => {
	return typeof uri === 'string' ?
		{source: {uri}} : {source: uri}
}

const Win = Dimensions.get('window')
const backgroundColor = '#000'

const styles = StyleSheet.create({
	background: {
		backgroundColor,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 98
	},
	fullScreen: {
		...StyleSheet.absoluteFillObject
	},
	image: {
		...StyleSheet.absoluteFillObject,
		width: undefined,
		height: undefined,
		zIndex: 99
	}
})

class BCPlayer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			paused: !props.autoPlay,
			fullScreen: false,
			inlineHeight: Win.width * 0.5625,
			loading: false,
			currentTime: 0,
			percentageTracked: {Q1: false, Q2: false, Q3: false, Q4: false},
			mediainfo: null
		}
		this.animInline = new Animated.Value(Win.width * 0.5625);
		this.animFullscreen = new Animated.Value(Win.width * 0.5625);
		this.BackHandler = this.BackHandler.bind(this);
		this.onRotated = this.onRotated.bind(this);
	}

	componentDidMount() {
		Dimensions.addEventListener('change', this.onRotated);
		BackHandler.addEventListener('hardwareBackPress', this.BackHandler);
	}

	componentWillUnmount() {
		Dimensions.removeEventListener('change', this.onRotated);
		BackHandler.removeEventListener('hardwareBackPress', this.BackHandler);
	}

	onRotated({window: {width, height}}) {
		if (this.props.inlineOnly) return;
		const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
		if (this.props.rotateToFullScreen) {
			if (orientation === 'LANDSCAPE') {
				this.setState({fullScreen: true}, () => {
					this.animToFullscreen(height);
					this.props.onFullScreen(this.state.fullScreen);
				})
				return
			}
			if (orientation === 'PORTRAIT') {
				this.setState({
					fullScreen: false,
					paused: this.props.fullScreenOnly || this.state.paused
				}, () => {
					this.animToInline();
					if (this.props.fullScreenOnly) this.props.onPlay(!this.state.paused)
					this.props.onFullScreen(this.state.fullScreen);
				})
				return;
			}
		} else {
			this.animToInline();
		}
		if (this.state.fullScreen) this.animToFullscreen(height);
	}

	BackHandler() {
		if (this.state.fullScreen) {
			this.setState({fullScreen: false}, () => {
				this.animToInline();
				this.props.onFullScreen(this.state.fullScreen);
				if (this.props.rotateToFullScreen) Orientation.lockToPortrait();
				setTimeout(() => {
					if (!this.props.lockPortraitOnFsExit) Orientation.unlockAllOrientations();
				}, 1500)
			})
			return true;
		}
		return false;
	}

	toggleFS() {
		this.setState({fullScreen: !this.state.fullScreen}, () => {
			Orientation.getOrientation((e, orientation) => {
				if (this.state.fullScreen) {
					const initialOrient = Orientation.getInitialOrientation();
					const height = orientation !== initialOrient ?
						Win.width : Win.height;
					this.props.onFullScreen(this.state.fullScreen);
					if (this.props.rotateToFullScreen) Orientation.lockToLandscape();
					this.animToFullscreen(height);
				} else {
					if (this.props.fullScreenOnly) {
						this.setState({paused: true}, () => this.props.onPlay(!this.state.paused));
					}
					this.props.onFullScreen(this.state.fullScreen)
					if (this.props.rotateToFullScreen) Orientation.lockToPortrait();
					this.animToInline();
					setTimeout(() => {
						if (!this.props.lockPortraitOnFsExit) Orientation.unlockAllOrientations();
					}, 1500)
				}
			})
		});
	}

	animToFullscreen(height) {
		Animated.parallel([
			Animated.timing(this.animFullscreen, {toValue: height, duration: 200}),
			Animated.timing(this.animInline, {toValue: height, duration: 200})
		]).start();
	}

	animToInline(height) {
		const newHeight = height || this.state.inlineHeight;
		Animated.parallel([
			Animated.timing(this.animFullscreen, {toValue: newHeight, duration: 100}),
			Animated.timing(this.animInline, {toValue: this.state.inlineHeight, duration: 100})
		]).start();
	}

	onReady(event) {
		this.onEvent({'type': PlayerEventTypes.ON_READY});
		this.props.onReady && this.props.onReady(event);
	}

	/**
	 * Event triggered when the player sets the metadata
	 * @param {NativeEvent} event
	 */
	onMetadataLoaded(event) {
		this.setState({ mediainfo: event.mediainfo }, () => {
			this.onEvent({ 'type': PlayerEventTypes.ON_METADATA_LOADED });
		});
		this.props.onMetadataLoaded && this.props.onMetadataLoaded(event);
	}

	/**
	 * Event triggered everytime that it starts playing. Can be when it starts, or when it resumes from pause
	 * @param {NativeEvent} event
	 */
	onPlay(event) {
		this.onEvent({'type': PlayerEventTypes.ON_PLAY});
		this.props.onPlay && this.props.onPlay(event);
	}

	/**
	 * Event triggered everytime the user clicks pause
	 * @param {NativeEvent} event
	 */
	onPause(event) {
		this.onEvent({'type': PlayerEventTypes.ON_PAUSE});
		this.props.onPause && this.props.onPause(event);
	}

	/**
	 * Event triggered when the video ends
	 * @param {NativeEvent} event
	 */
	onEnd(event) {
		this.onEvent({'type': PlayerEventTypes.ON_END});
		this.props.onEnd && this.props.onEnd(event);
	}


	/**
	 * Event triggered as the stream progress.
	 * @param {NativeEvent} event
	 * @param {number} event.currentTime - The current time of the video
	 * @param {number} event.duration - The total duration of the video
	 */
	onProgress(event) {
		let {currentTime, duration} = event,
			{percentageTracked} = this.state;

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

		this.onEvent({type: PlayerEventTypes[`ON_PROGRESS_Q${mark}`]});
	}

	/**
	 * Event triggered when the fullscreen happens
	 * @param {NativeEvent} event
	 */
	onEnterFullscreen(event) {
		this.onEvent({'type': PlayerEventTypes.ON_ENTER_FULLSCREEN});
	}

	/**
	 * Event triggered when the user exists from the fullscreen
	 * @param {NativeEvent} event
	 */
	onExitFullscreen(event) {
		this.onEvent({'type': PlayerEventTypes.ON_EXIT_FULLSCREEN});
	}

	/**
	 * Handler to normalise the events and send it back to the onEvent callback if that exists
	 * @param {object} event
	 * @param {string} event.type - the event type
	 */
	onEvent(event) {
		event = {
			...event,
			name: this.state.mediainfo && this.state.mediainfo.title || 'N/A',
			videoId: this.props.videoId,
			referenceId: this.props.referenceId,
			accountId: this.props.accountId,
			playerId: this.player.props.playerId,
			platform: Platform.OS
		}
		this.props.onEvent && this.props.onEvent(event);
	}

	render() {
		const {
			fullScreen,
			loading,
			currentTime
		} = this.state;

		const {
			style,
			placeholder,
		} = this.props;

		return (
			<Animated.View
				style={[
					styles.background,
					fullScreen ?
						(styles.fullScreen, {height: this.animFullscreen})
						: {height: this.animInline},
					fullScreen ? null : style
				]}
			>
				<StatusBar hidden={fullScreen}/>
				{
					((loading && placeholder) || currentTime < 0.01) &&
					<Image resizeMode="cover" style={styles.image} {...checkSource(placeholder)} />
				}
				<BrightcovePlayer
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
					onBeforeEnterFullscreen={this.toggleFS.bind(this)}
					onBeforeExitFullscreen={this.toggleFS.bind(this)}
				/>
			</Animated.View>
		)
	}
}

BCPlayer.defaultProps = {
	placeholder: undefined,
	style: {},
	autoPlay: false,
	inlineOnly: false,
	fullScreenOnly: false,
	rotateToFullScreen: false,
	lockPortraitOnFsExit: false,
	onEnd: () => {
	},
	onPlay: () => {
	},
	onProgress: () => {
	},
	onFullScreen: () => {
	}
}


module.exports = BCPlayer;
