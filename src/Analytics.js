import React, {Component} from 'react';
import {Platform} from 'react-native'
import PlayerEventTypes from "./PlayerEventTypes";

// This function takes a component...
function withAnalytics(BCPlayerComponent) {
	// ...and returns another component...
	class WithAnalytics extends Component {
		constructor(props) {
			super(props);
			this.state = {
				percentageTracked: {Q1: false, Q2: false, Q3: false, Q4: false},
				mediainfo: null,
				firstPlayed: false
			}
		}

		/**
		 * Event triggered when the player is ready to play
		 * @param {NativeEvent} event
		 */
		onReady(event) {
			this.onEvent({'type': PlayerEventTypes.ON_READY});
			this.onEvent({'type': PlayerEventTypes.ON_IMPRESSION});
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

			if (!this.state.firstPlayed) {
				this.setState({ firstPlayed: true }, () => {
					this.onEvent({'type': PlayerEventTypes.ON_VIEW});
				});
			}
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
				this.trackQuarters(1, percentagePlayed);
			} else if (roundUpPercentage === 50 && !percentageTracked.Q2) {
				this.trackQuarters(2, percentagePlayed);
			} else if (roundUpPercentage === 75 && !percentageTracked.Q3) {
				this.trackQuarters(3, percentagePlayed);
			} else if (roundUpPercentage === 100 && !percentageTracked.Q4) {
				this.trackQuarters(4, percentagePlayed);
			}

			// Fire the call back of the onProgress
			this.props.onProgress && this.props.onProgress(event);
		}


		/**
		 * Method that tracks back to the "onEvent" call back to communicate a tracking of a quarter
		 * @param {number} mark - The number of the quarter (1,2,3,4)
		 * @param {number} percentagePlayed - The percentage played at the time of the tracking
		 */
		trackQuarters(mark, percentagePlayed) {
			this.setState((prevState) => ({
				percentageTracked: {
					...prevState.percentageTracked,
					[`Q${mark}`]: true
				}
			}));

			this.onEvent({
				type: PlayerEventTypes[`ON_PROGRESS_Q${mark}`],
				percentagePlayed
			});
		}

		/**
		 * Event triggered when the fullscreen happens
		 * @param {NativeEvent} event
		 */
		onEnterFullscreen(event) {
			this.onEvent({'type': PlayerEventTypes.ON_ENTER_FULLSCREEN});
			this.props.onEnterFullscreen && this.props.onEnterFullscreen(event);
		}

		/**
		 * Event triggered when the user exists from the fullscreen
		 * @param {NativeEvent} event
		 */
		onExitFullscreen(event) {
			this.onEvent({'type': PlayerEventTypes.ON_EXIT_FULLSCREEN});
			this.props.onExitFullscreen && this.props.onExitFullscreen(event);
		}

		/**
		 * Event triggered when the user exists from the fullscreen
		 * @param {NativeEvent} event
		 */
		onError(event = {}) {
			this.onEvent({
				'type': PlayerEventTypes.ON_EXIT_FULLSCREEN,
				...event
			});
			this.props.onError && this.props.onError(event);
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
			// ... and renders the wrapped component with the fresh data!
			// Notice that we pass through any additional props
			return <BCPlayerComponent
				{...this.props}
				ref={(player) => this.player = player}
				onReady={this.onReady.bind(this)}
				onPlay={this.onPlay.bind(this)}
				onPause={this.onPause.bind(this)}
				onEnd={this.onEnd.bind(this)}
				onProgress={this.onProgress.bind(this)}
				onEnterFullscreen={this.onEnterFullscreen.bind(this)}
				onExitFullscreen={this.onExitFullscreen.bind(this)}
				onError={this.onError.bind(this)}
			/>;
		}
	}

	// Rename the new component name to be the same as the high order component
	// This is done because there are other components that looks up to the name of the BCPlayer (like ScrollView)
	WithAnalytics.displayName = BCPlayerComponent.displayName || BCPlayerComponent.name || 'BCPlayer';
	return WithAnalytics;
}

module.exports = withAnalytics;