import React, { Component } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BrightcovePlayer, BrightcovePlayerPoster, BrightcovePlayerUtil } from 'react-native-brightcove-player';

const ACCOUNT_ID = '5434391461001';
const POLICY_KEY =
  'BCpkADawqM0T8lW3nMChuAbrcunBBHmh4YkNl5e6ZrKQwPiK_Y83RAOF4DP5tyBF_ONBVgrEjqW6fbV0nKRuHvjRU3E8jdT9WMTOXfJODoPML6NUDCYTwTHxtNlr5YdyGYaCPLhMUZ3Xu61L';
const PLAYLIST_REF_ID = 'brightcove-native-sdk-plist';

export default class App extends Component {
  state = {
    videos: [],
    offlineVideos: [],
    playback: {
      referenceId: null,
      videoToken: null
    }
  };

  componentDidMount() {
    BrightcovePlayerUtil.getPlaylistWithReferenceId(
      ACCOUNT_ID,
      POLICY_KEY,
      PLAYLIST_REF_ID
    )
      .then(videos => {
        this.setState({
          videos
        });
      })
      .catch(console.warn);
    BrightcovePlayerUtil.getOfflineVideoStatuses(ACCOUNT_ID, POLICY_KEY)
      .then(offlineVideos => {
        this.setState({
          offlineVideos
        });
      })
      .catch(console.warn);
    this.disposer = BrightcovePlayerUtil.addOfflineNotificationListener(
      offlineVideos => {
        this.setState({
          offlineVideos
        });
      }
    );
  }

  requestDownload(videoId) {
    BrightcovePlayerUtil.requestDownloadVideoWithVideoId(
      ACCOUNT_ID,
      POLICY_KEY,
      videoId
    ).catch(() => {});
  }

  play(item) {
    const downloadStatus = this.state.offlineVideos.find(
      video => video.videoId === item.videoId
    );
    this.setState({
      playback:
        downloadStatus && downloadStatus.downloadProgress === 1
          ? {
              videoToken: downloadStatus.videoToken
            }
          : {
              referenceId: item.referenceId
            }
    });
  }

  delete(videoToken) {
    BrightcovePlayerUtil.deleteOfflineVideo(
      ACCOUNT_ID,
      POLICY_KEY,
      videoToken
    ).catch(console.warn);
  }

  componentWillUnmount() {
    this.disposer && this.disposer();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <BrightcovePlayer
          style={styles.video}
          accountId={ACCOUNT_ID}
          policyKey={POLICY_KEY}
          autoPlay
          {...this.state.playback}
        />
        <FlatList
          style={styles.list}
          extraData={this.state.offlineVideos}
          data={this.state.videos}
          keyExtractor={item => item.referenceId}
          renderItem={({ item }) => {
            const downloadStatus = this.state.offlineVideos.find(
              video => video.videoId === item.videoId
            );
            return (
              <View style={styles.listItem}>
                <TouchableOpacity
                  style={styles.mainButton}
                  onPress={() => this.play(item)}
                >
                  <BrightcovePlayerPoster
                    style={styles.poster}
                    accountId={ACCOUNT_ID}
                    policyKey={POLICY_KEY}
                    referenceId={item.referenceId}
                  />
                  <View style={styles.body}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text>{item.description}</Text>
                    {downloadStatus ? (
                      <Text style={styles.offlineBanner}>
                        {downloadStatus.downloadProgress === 1
                          ? 'OFFLINE PLAYBACK'
                          : `DOWNLOADING: ${Math.floor(
                              downloadStatus.downloadProgress * 100
                            )}%`}
                      </Text>
                    ) : null}
                    <Text style={styles.duration}>
                      {`0${Math.floor(item.duration / 60000) % 60}`.substr(-2)}:
                      {`0${Math.floor(item.duration / 1000) % 60}`.substr(-2)}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => {
                    if (!downloadStatus) {
                      this.requestDownload(item.videoId);
                    } else {
                      this.delete(downloadStatus.videoToken);
                    }
                  }}
                >
                  <Text>
                    {!downloadStatus
                      ? '💾'
                      : downloadStatus.downloadProgress === 1
                      ? '🗑'
                      : '⏳'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  video: {
    width: '100%',
    height: 260
  },
  list: {
    flex: 1
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray'
  },
  mainButton: {
    flex: 1,
    flexDirection: 'row'
  },
  body: {
    flex: 1,
    padding: 10,
    flexDirection: 'column'
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  offlineBanner: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'flex-start',
    padding: 3,
    backgroundColor: 'deepskyblue'
  },
  duration: {
    marginTop: 'auto',
    opacity: 0.5
  },
  poster: {
    width: 100,
    height: 100,
    backgroundColor: 'black'
  },
  downloadButton: {
    padding: 16,
    marginLeft: 'auto',
    alignSelf: 'center'
  }
});
