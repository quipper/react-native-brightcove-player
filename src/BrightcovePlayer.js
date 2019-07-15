import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactNative, {
  NativeModules,
  Platform,
  requireNativeComponent,
  UIManager,
  View,
  ViewPropTypes
} from 'react-native';

class BrightcovePlayer extends Component {
  state = {
    fullscreen: false
  };

  setNativeProps = nativeProps => {
    if (this._root) {
      this._root.setNativeProps(nativeProps);
    }
  };

  componentWillUnmount = Platform.select({
    ios: function() {
      NativeModules.BrightcovePlayerManager.dispose(
        ReactNative.findNodeHandle(this)
      );
    },
    android: function() {}
  });

  render() {
    return (
      <NativeBrightcovePlayer
        ref={e => (this._root = e)}
        {...this.props}
        style={[
          this.props.style,
          this.state.fullscreen && {
            position: 'absolute',
            zIndex: 9999,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          },
          this.state.fullscreen && this.props.fullscreenStyle
        ]}
        onReady={event =>
          this.props.onReady && this.props.onReady(event.nativeEvent)
        }
        onMetadataLoaded={event =>
          this.props.onMetadataLoaded && this.props.onMetadataLoaded(event.nativeEvent)
        }
        onPlay={event =>
          this.props.onPlay && this.props.onPlay(event.nativeEvent)
        }
        onPause={event =>
          this.props.onPause && this.props.onPause(event.nativeEvent)
        }
        onEnd={event => this.props.onEnd && this.props.onEnd(event.nativeEvent)}
        onProgress={event =>
          this.props.onProgress && this.props.onProgress(event.nativeEvent)
        }
        onChangeDuration={event =>
          this.props.onChangeDuration &&
          this.props.onChangeDuration(event.nativeEvent)
        }
        onUpdateBufferProgress={event =>
          this.props.onUpdateBufferProgress &&
          this.props.onUpdateBufferProgress(event.nativeEvent)
        }
        onBufferingStarted={event =>
          this.props.onBufferingStarted &&
          this.props.onBufferingStarted(event.nativeEvent)
        }
        onBufferingCompleted={event =>
          this.props.onBufferingCompleted &&
          this.props.onBufferingCompleted(event.nativeEvent)
        }
        onBeforeEnterFullscreen={event => {
          this.props.onBeforeEnterFullscreen &&
          this.props.onBeforeEnterFullscreen(event.nativeEvent)
        }}
        onBeforeExitFullscreen={event => {
          this.props.onBeforeExitFullscreen &&
          this.props.onBeforeExitFullscreen(event.nativeEvent)
        }}
        onEnterFullscreen={event => {
          this.props.onEnterFullscreen &&
          this.props.onEnterFullscreen(event.nativeEvent)
          this.setState({ fullscreen: true })
        }}
        onExitFullscreen={event => {
          this.props.onExitFullscreen &&
          this.props.onExitFullscreen(event.nativeEvent)
          this.setState({ fullscreen: false })
        }}
        onNetworkConnectivityChange={event => {
          this.props.onNetworkConnectivityChange && this.props.onNetworkConnectivityChange(event.nativeEvent)
        }}
        onError={event => {
          this.props.onError && this.props.onError(event.nativeEvent)
        }}
      />
    );
  }
}

BrightcovePlayer.prototype.seekTo = Platform.select({
  ios: function(seconds) {
    NativeModules.BrightcovePlayerManager.seekTo(
      ReactNative.findNodeHandle(this),
      seconds
    );
  },
  android: function(seconds) {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._root),
      UIManager.getViewManagerConfig('BrightcovePlayer').Commands.seekTo,
      [seconds]
    );
  }
});

BrightcovePlayer.prototype.setFullscreen = Platform.select({
  ios: function(fullscreen) {
    NativeModules.BrightcovePlayerManager.setFullscreen(
      ReactNative.findNodeHandle(this),
      fullscreen
    );
  },
  android: function(fullscreen) {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._root),
      UIManager.getViewManagerConfig('BrightcovePlayer').Commands.setFullscreen,
      [fullscreen]
    );
  }
});

BrightcovePlayer.propTypes = {
  ...(ViewPropTypes || View.propTypes),
  policyKey: PropTypes.string,
  accountId: PropTypes.string,
  playerId: PropTypes.string,
  referenceId: PropTypes.string,
  videoId: PropTypes.string,
  videoToken: PropTypes.string,
  autoPlay: PropTypes.bool,
  play: PropTypes.bool,
  fullscreen: PropTypes.bool,
  fullscreenStyle: PropTypes.object,
  disableDefaultControl: PropTypes.bool,
  playerType: PropTypes.string,
  volume: PropTypes.number,
  bitRate: PropTypes.number,
  playbackRate: PropTypes.number,
  onReady: PropTypes.func,
  onMetadataLoaded: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onEnd: PropTypes.func,
  onProgress: PropTypes.func,
  onChangeDuration: PropTypes.func,
  onUpdateBufferProgress: PropTypes.func,
  onBufferingStarted: PropTypes.func,
  onBufferingCompleted: PropTypes.func,
  onBeforeEnterFullscreen: PropTypes.func,
  onBeforeExitFullscreen: PropTypes.func,
  onEnterFullscreen: PropTypes.func,
  onExitFullscreen: PropTypes.func,
  onError: PropTypes.func,
  onNetworkConnectivityChange: PropTypes.func
};

BrightcovePlayer.defaultProps = {};

const NativeBrightcovePlayer = requireNativeComponent(
  'BrightcovePlayer',
  BrightcovePlayer
);

module.exports = BrightcovePlayer;
