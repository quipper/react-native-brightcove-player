import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
  View,
  requireNativeComponent,
  NativeModules,
  ViewPropTypes,
  Platform,
  UIManager
} from 'react-native';

class BrightcovePlayer extends Component {
  state = {
    androidFullscreen: false
  };

  setNativeProps = nativeProps => {
    if (this._root) {
      this._root.setNativeProps(nativeProps);
    }
  };

  render() {
    return (
      <NativeBrightcovePlayer
        ref={e => (this._root = e)}
        {...this.props}
        style={[
          this.props.style,
          this.state.androidFullscreen && {
            position: 'absolute',
            zIndex: 9999,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }
        ]}
        onReady={event =>
          this.props.onReady && this.props.onReady(event.nativeEvent)
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
        onEnterFullscreen={event =>
          this.props.onEnterFullscreen &&
          this.props.onEnterFullscreen(event.nativeEvent)
        }
        onExitFullscreen={event =>
          this.props.onExitFullscreen &&
          this.props.onExitFullscreen(event.nativeEvent)
        }
        onToggleAndroidFullscreen={event => {
          const fullscreen =
            typeof event.nativeEvent.fullscreen === 'boolean'
              ? event.nativeEvent.fullscreen
              : !this.state.androidFullscreen;
          if (fullscreen === this.state.androidFullscreen) return;
          this.setState({ androidFullscreen: fullscreen });
          if (fullscreen) {
            this.props.onEnterFullscreen &&
              this.props.onEnterFullscreen(event.nativeEvent);
          } else {
            this.props.onExitFullscreen &&
              this.props.onExitFullscreen(event.nativeEvent);
          }
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
      UIManager.BrightcovePlayer.Commands.seekTo,
      [seconds]
    );
  }
});

BrightcovePlayer.propTypes = {
  ...(ViewPropTypes || View.propTypes),
  policyKey: PropTypes.string,
  accountId: PropTypes.string,
  referenceId: PropTypes.string,
  videoId: PropTypes.string,
  autoPlay: PropTypes.bool,
  play: PropTypes.bool,
  fullscreen: PropTypes.bool,
  disableDefaultControl: PropTypes.bool,
  volume: PropTypes.number,
  onReady: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onEnd: PropTypes.func,
  onProgress: PropTypes.func,
  onChangeDuration: PropTypes.func,
  onUpdateBufferProgress: PropTypes.func,
  onEnterFullscreen: PropTypes.func,
  onExitFullscreen: PropTypes.func
};

BrightcovePlayer.defaultProps = {};

const NativeBrightcovePlayer = requireNativeComponent(
  'BrightcovePlayer',
  BrightcovePlayer
);

module.exports = BrightcovePlayer;
