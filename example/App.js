import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  Button
} from 'react-native';
import { BrightcovePlayer } from 'react-native-brightcove-player';

export default class App extends Component {
  state = {
    playing: false,
    currentTime: 0,
    duration: 0,
    bufferProgress: 0,
    fullscreen: false
  };

  render() {
    return (
      <View style={styles.container}>
        <BrightcovePlayer
          ref={ref => (this.player = ref)}
          style={styles.player}
          play={this.state.playing}
          autoPlay={true}
          fullscreen={this.state.fullscreen}
          accountId="3636334163001"
          videoId="3666678807001"
          policyKey="BCpkADawqM1W-vUOMe6RSA3pA6Vw-VWUNn5rL0lzQabvrI63-VjS93gVUugDlmBpHIxP16X8TSe5LSKM415UHeMBmxl7pqcwVY_AZ4yKFwIpZPvXE34TpXEYYcmulxJQAOvHbv2dpfq-S_cm"
          onReady={() => console.log('ready')}
          onPlay={() => this.setState({ playing: true })}
          onPause={() => this.setState({ playing: false })}
          onEnd={() => console.log('end')}
          onProgress={({ currentTime, duration, bufferProgress }) =>
            this.setState({ currentTime, duration, bufferProgress })
          }
          onChangeDuration={({ duration }) => this.setState({ duration })}
          onEnterFullscreen={() => this.setState({ fullscreen: true })}
          onExitFullscreen={() => this.setState({ fullscreen: false })}
        />
        <View style={styles.content}>
          <Text style={styles.title}>React Native Brightcove Player</Text>
          <Text>
            {this.state.playing ? 'Playing' : 'Paused'} (
            {Math.floor(this.state.currentTime * 10) / 10}s /{' '}
            {Math.floor(this.state.duration * 10) / 10}s,{' '}
            {Math.floor(this.state.bufferProgress * 100)}% loaded)
          </Text>
          <View style={styles.control}>
            <Button
              title="Play"
              onPress={() => this.setState({ playing: true })}
            />
            <Button
              title="Pause"
              onPress={() => this.setState({ playing: false })}
            />
            <Button
              title="+10s"
              onPress={() => this.player.seekTo(this.state.currentTime + 10)}
            />
            <Button
              title="-10s"
              onPress={() => this.player.seekTo(this.state.currentTime - 10)}
            />
            <Button
              title="Fullscreen"
              onPress={() =>
                this.setState({ fullscreen: !this.state.fullscreen })
              }
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    flexDirection: 'column'
  },
  player: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  control: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
