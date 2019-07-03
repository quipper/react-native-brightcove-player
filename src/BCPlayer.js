import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import BrightcovePlayer from './BrightcovePlayer';

import Orientation from 'react-native-orientation';

export default class BrigthcovePlayer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      orientation: null,
      forcedOrientation: false
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

  onReady(event) {
    console.log('READY', event);
    this.props.onReady && this.props.onReady(event);
  }

  onPlay(event) {
    console.log('PLAY', this.player);
    this.props.onPlay && this.props.onPlay(event);
  }

  onPause(event) {
    this.props.onPause && this.props.onPause(event);
  }

  onEnd(event) {
    this.props.onEnd && this.props.onEnd(event);
  }

  onProgress(event) {
    console.log('ON PROGRESS', { event })
    this.props.onProgress && this.props.onProgress(event);
  }

  onEnterFullscreen(event) {
    this.props.onEnterFullscreen && this.props.onEnterFullscreen(event);
  }

  onExitFullscreen(event) {
    this.props.onExitFullscreen && this.props.onExitFullscreen(event);
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
