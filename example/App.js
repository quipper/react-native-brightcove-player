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
    progress: 0
  };

  render() {
    return (
      <View style={styles.container}>
        <BrightcovePlayer
          ref={ref => (this.player = ref)}
          style={styles.player}
          play={this.state.playing}
          autoPlay={true}
          accountId="3636334163001"
          videoId="3666678807001"
          policyKey="BCpkADawqM1W-vUOMe6RSA3pA6Vw-VWUNn5rL0lzQabvrI63-VjS93gVUugDlmBpHIxP16X8TSe5LSKM415UHeMBmxl7pqcwVY_AZ4yKFwIpZPvXE34TpXEYYcmulxJQAOvHbv2dpfq-S_cm"
          onReady={() => console.log('ready')}
          onPlay={() => this.setState({ playing: true })}
          onPause={() => this.setState({ playing: false })}
          onEnd={() => console.log('end')}
          onProgress={({ currentTime }) =>
            this.setState({ progress: currentTime })
          }
        />
        <View style={styles.content}>
          <Text style={styles.title}>React Native Brightcove Player</Text>
          <Text>
            {this.state.playing ? 'Playing' : 'Paused'} (
            {Math.floor(this.state.progress * 10) / 10}s)
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
              onPress={() => this.player.seekTo(this.state.progress + 10)}
            />
            <Button
              title="-10s"
              onPress={() => this.player.seekTo(this.state.progress - 10)}
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
