import { NativeModules } from 'react-native';

const requestDownloadVideoWithReferenceId = function(
  accountId,
  policyKey,
  referenceId,
  bitRate
) {
  return NativeModules.BrightcovePlayerUtil.requestDownloadVideoWithReferenceId(
    referenceId,
    accountId,
    policyKey,
    bitRate || 0
  );
};

const requestDownloadVideoWithVideoId = function(
  accountId,
  policyKey,
  videoId,
  bitRate
) {
  return NativeModules.BrightcovePlayerUtil.requestDownloadVideoWithVideoId(
    videoId,
    accountId,
    policyKey,
    bitRate || 0
  );
};

const getOfflineVideoStatuses = function(accountId, policyKey) {
  return NativeModules.BrightcovePlayerUtil.getOfflineVideoStatuses(
    accountId,
    policyKey
  );
};

const deleteOfflineVideo = function(accountId, policyKey, videoToken) {
  return NativeModules.BrightcovePlayerUtil.deleteOfflineVideoWithVideoToken(
    accountId,
    policyKey,
    videoToken
  );
};

module.exports = {
  requestDownloadVideoWithReferenceId,
  requestDownloadVideoWithVideoId,
  getOfflineVideoStatuses,
  deleteOfflineVideo
};
