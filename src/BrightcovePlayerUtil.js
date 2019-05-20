import { NativeModules, Platform } from 'react-native';

const requestDownloadVideoByReferenceId = Platform.select({
  ios: function(accountId, policyKey, referenceId, bitRate) {
    return NativeModules.BrightcovePlayerUtil.requestDownloadVideoWithReferenceId(
      referenceId,
      accountId,
      policyKey,
      bitRate || 0
    );
  },
  android: function(accountId, policyKey, referenceId) {}
});

const requestDownloadVideoByVideoId = Platform.select({
  ios: function(accountId, policyKey, videoId, bitRate) {
    return NativeModules.BrightcovePlayerUtil.requestDownloadVideoWithVideoId(
      videoId,
      accountId,
      policyKey,
      bitRate || 0
    );
  },
  android: function(accountId, policyKey, videoId) {}
});

const getOfflineVideoStatuses = Platform.select({
  ios: function() {
    return NativeModules.BrightcovePlayerUtil.getOfflineVideoStatuses();
  },
  android: function(accountId, policyKey, videoId) {}
});

const deleteOfflineVideo = Platform.select({
  ios: function(videoToken) {
    return NativeModules.BrightcovePlayerUtil.deleteOfflineVideoWithVideoToken(
      videoToken
    );
  },
  android: function(accountId, policyKey, videoId) {}
});

module.exports = {
  requestDownloadVideoByReferenceId,
  requestDownloadVideoByVideoId,
  getOfflineVideoStatuses,
  deleteOfflineVideo
};
