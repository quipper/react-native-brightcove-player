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
    fullscreen: false
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
          this.state.fullscreen && {
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
        onFullscreen={event =>
          this.setState({ fullscreen: !this.state.fullscreen })
        }
      />
    );
  }
}

BrightcovePlayer.prototype.seekTo = Platform.select({
  ios: function (seconds) {
    NativeModules.BrightcovePlayerManager.seekTo(
      ReactNative.findNodeHandle(this),
      seconds
    );
  },
  android: function (seconds) {
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
  onReady: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onEnd: PropTypes.func,
  onProgress: PropTypes.func
};

BrightcovePlayer.defaultProps = {};

const NativeBrightcovePlayer = requireNativeComponent(
  'BrightcovePlayer',
  BrightcovePlayer
);

module.exports = BrightcovePlayer;
