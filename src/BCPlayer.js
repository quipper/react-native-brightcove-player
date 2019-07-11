import React, {Component} from 'react'
import {Animated, BackHandler, Dimensions, Platform, StatusBar, StyleSheet} from 'react-native'
import Orientation from 'react-native-orientation'
import BrightcovePlayer from './BrightcovePlayer';
import withEvents from './Events';

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

	render() {
		const {
			fullScreen
		} = this.state;

		const {
			style
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
				<BrightcovePlayer
					ref={(player) => this.player = player}
					{...this.props}
					style={[styles.player, this.props.style]}
					playerId={this.props.playerId ? this.props.playerId : `com.brightcove/react-native/${Platform.OS}`}
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
	lockPortraitOnFsExit: false
}


module.exports = withEvents(BCPlayer);
