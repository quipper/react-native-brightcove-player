import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, requireNativeComponent, ViewPropTypes } from 'react-native';

class BrightcovePlayer extends Component {
  setNativeProps = nativeProps => {
    if (this._root) {
      this._root.setNativeProps(nativeProps);
    }
  };

  render() {
    return (
      <NativeBrightcovePlayer ref={e => (this._root = e)} {...this.props} />
    );
  }
}

BrightcovePlayer.propTypes = {
  ...(ViewPropTypes || View.propTypes),
  policyKey: PropTypes.string,
  accountId: PropTypes.string,
  videoReferenceId: PropTypes.string
};

BrightcovePlayer.defaultProps = {};

const NativeBrightcovePlayer = requireNativeComponent(
  'BrightcovePlayer',
  BrightcovePlayer
);

module.exports = BrightcovePlayer;
