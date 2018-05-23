import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, Image, View } from 'react-native';
import { BrightcovePlayer } from 'react-native-brightcove-player';

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BrightcovePlayer
          style={styles.player}
          accountId="3636334163001"
          videoReferenceId="3666678807001"
          policyKey="BCpkADawqM1W-vUOMe6RSA3pA6Vw-VWUNn5rL0lzQabvrI63-VjS93gVUugDlmBpHIxP16X8TSe5LSKM415UHeMBmxl7pqcwVY_AZ4yKFwIpZPvXE34TpXEYYcmulxJQAOvHbv2dpfq-S_cm"
        />
        <View style={styles.content}>
          <Text style={styles.title}>React Native Brightcove Player</Text>
          <Text style={styles.body}>
            Lorem ipsum Ullamco et anim id exercitation sit dolor dolor culpa
            velit minim pariatur Duis elit laborum exercitation laborum in eu
            eiusmod minim non cillum laborum Duis aliquip mollit nulla aliqua
            anim minim in.
          </Text>
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
  body: {
    fontSize: 14,
    marginBottom: 10
  }
});
