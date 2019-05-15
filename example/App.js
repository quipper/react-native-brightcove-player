import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { BrightcovePlayer } from 'react-native-brightcove-player';

export default class App extends Component {
  state = {
    playing: false,
    currentTime: 0,
    duration: 0,
    bufferProgress: 0,
    fullscreen: false,
    disableControl: false,
    volume: 1,
    bitRate: 0,
    playbackRate: 1
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
          disableDefaultControl={this.state.disableControl}
          volume={this.state.volume}
          bitRate={this.state.bitRate}
          playbackRate={this.state.playbackRate}
          accountId="3636334163001"
          videoId="3666678807001"
          policyKey="BCpkADawqM1W-vUOMe6RSA3pA6Vw-VWUNn5rL0lzQabvrI63-VjS93gVUugDlmBpHIxP16X8TSe5LSKM415UHeMBmxl7pqcwVY_AZ4yKFwIpZPvXE34TpXEYYcmulxJQAOvHbv2dpfq-S_cm"
          onReady={() => console.log('onReady')}
          onPlay={() => {
            console.log('onPlay');
            this.setState({ playing: true });
          }}
          onPause={() => {
            console.log('onPause');
            this.setState({ playing: false });
          }}
          onEnd={() => console.log('onEnd')}
          onProgress={({ currentTime }) => {
            console.log('onProgress', currentTime);
            this.setState({ currentTime });
          }}
          onUpdateBufferProgress={({ bufferProgress }) => {
            console.log('onUpdateBufferProgress', bufferProgress);
            this.setState({ bufferProgress });
          }}
          onChangeDuration={({ duration }) => {
            console.log('onChangeDuration', duration);
            this.setState({ duration });
          }}
          onEnterFullscreen={() => {
            console.log('onEnterFullscreen');
            this.setState({ fullscreen: true });
          }}
          onExitFullscreen={() => {
            console.log('onExitFullscreen');
            this.setState({ fullscreen: false });
          }}
        />
        <View style={styles.content}>
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
          </View>
          <Text style={styles.caption}>Volume</Text>
          <View style={styles.control}>
            <Button title="1.0" onPress={() => this.setState({ volume: 1 })} />
            <Button
              title="0.5"
              onPress={() => this.setState({ volume: 0.5 })}
            />
            <Button title="0.0" onPress={() => this.setState({ volume: 0 })} />
          </View>
          <Text style={styles.caption}>Quality</Text>
          <View style={styles.control}>
            <Button
              title="Auto"
              onPress={() => this.setState({ bitRate: 0 })}
            />
            <Button
              title="Low"
              onPress={() => this.setState({ bitRate: 159000 })}
            />
            <Button
              title="Medium"
              onPress={() => this.setState({ bitRate: 432000 })}
            />
            <Button
              title="High"
              onPress={() => this.setState({ bitRate: 832000 })}
            />
          </View>
          <Text style={styles.caption}>Playback Rate</Text>
          <View style={styles.control}>
            <Button
              title="0.5x"
              onPress={() => this.setState({ playbackRate: 0.5 })}
            />
            <Button
              title="1x"
              onPress={() => this.setState({ playbackRate: 1 })}
            />
            <Button
              title="2x"
              onPress={() => this.setState({ playbackRate: 2 })}
            />
          </View>
          <Text style={styles.caption}>Control</Text>
          <View style={styles.control}>
            <Button
              title="Enter Fullscreen"
              onPress={() =>
                this.setState({ fullscreen: !this.state.fullscreen })
              }
            />
            <Button
              title={`${
                this.state.disableControl ? 'Enable' : 'Disable'
              } Control`}
              onPress={() =>
                this.setState({ disableControl: !this.state.disableControl })
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
  caption: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  control: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15
  }
});
