package jp.manse.offlineVideo;

import android.util.Log;

import com.brightcove.player.edge.OfflineCallback;
import com.brightcove.player.edge.OfflineCatalog;
import com.brightcove.player.model.Video;
import com.brightcove.player.network.DownloadStatus;
import com.facebook.react.bridge.NativeArray;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;
import java.util.List;

import jp.manse.DefaultEventEmitter;

public class OfflineVideoOwner implements OfflineVideoDownloadSession.OnOfflineVideoDownloadSessionListener, OfflineCallback<List<Video>> {
    final private static String DEBUG_TAG = "brightcoveplayer";
    final private static String ERROR_CODE = "error";
    final private static String ERROR_MESSAGE_DUPLICATE_SESSION = "Offline video or download session already exists";
    final private static String ERROR_MESSAGE_DELETE = "Could not delete video";
    final private static String CALLBACK_KEY_VIDEO_TOKEN = "videoToken";
    final private static String CALLBACK_KEY_DOWNLOAD_PROGRESS = "downloadProgress";

    private ReactApplicationContext context;
    public String accountId;
    public String policyKey;

    private List<OfflineVideoStatus> offlineVideoStatuses = new ArrayList<>();
    private List<OfflineVideoDownloadSession> offlineVideoDownloadSessions = new ArrayList<>();
    private boolean isOfflineVideoStatusInitialized = false;
    private boolean isOfflineVideoStatusInitializing = false;
    private List<Promise> initializeOfflineVideoStatusPromises = new ArrayList<>();
    private OfflineCatalog offlineCatalog;

    public OfflineVideoOwner(ReactApplicationContext context, String accountId, String policyKey) {
        this.context = context;
        this.accountId = accountId;
        this.policyKey = policyKey;
        this.offlineCatalog = new OfflineCatalog(context, DefaultEventEmitter.sharedEventEmitter, accountId, policyKey);
    }

    public void requestDownloadWithReferenceId(String referenceId, int bitRate, Promise promise) {
        if (this.hasOfflineVideoWithReferenceId(referenceId)) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_DUPLICATE_SESSION);
            return;
        }
        OfflineVideoDownloadSession session = new OfflineVideoDownloadSession(this.context, accountId, policyKey, bitRate, promise, this);
        session.requestDownloadWithReferenceId(referenceId);
        this.offlineVideoDownloadSessions.add(session);
    }

    public void requestDownloadWithVideoId(String videoId, int bitRate, Promise promise) {
        if (this.hasOfflineVideoWithVideoId(videoId)) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_DUPLICATE_SESSION);
            return;
        }
        OfflineVideoDownloadSession session = new OfflineVideoDownloadSession(this.context, accountId, policyKey, bitRate, promise, this);
        session.requestDownloadWithVideoId(videoId);
        this.offlineVideoDownloadSessions.add(session);
    }

    public void getOfflineVideoStatuses(Promise promise) {
        if (this.isOfflineVideoStatusInitialized) {
            promise.resolve(this.collectNativeOfflineVideoStatuses());
            return;
        }
        if (this.isOfflineVideoStatusInitializing) {
            this.initializeOfflineVideoStatusPromises.add(promise);
            return;
        }
        this.initializeOfflineVideoStatusPromises.clear();
        this.initializeOfflineVideoStatusPromises.add(promise);
        this.isOfflineVideoStatusInitializing = true;
        this.offlineCatalog.findAllVideoDownload(DownloadStatus.STATUS_COMPLETE, this);
    }

    public void deleteOfflineVideo(String videoId, final Promise promise) {
        try {
            this.offlineCatalog.cancelVideoDownload(videoId);
            for (int i = this.offlineVideoDownloadSessions.size() - 1; i >= 0; i--) {
                OfflineVideoDownloadSession session = this.offlineVideoDownloadSessions.get(i);
                if (session.videoId.equals(videoId)) {
                    this.offlineVideoDownloadSessions.remove(session);
                }
            }
            for (int i = this.offlineVideoStatuses.size() - 1; i >= 0; i--) {
                OfflineVideoStatus status = this.offlineVideoStatuses.get(i);
                if (status.videoId.equals(videoId)) {
                    this.offlineVideoStatuses.remove(status);
                }
            }
            this.offlineCatalog.deleteVideo(videoId, new OfflineCallback<Boolean>() {
                @Override
                public void onSuccess(Boolean aBoolean) {
                    promise.resolve(null);
                }

                @Override
                public void onFailure(Throwable throwable) {
                    promise.reject(ERROR_CODE, ERROR_MESSAGE_DELETE);
                }
            });
        } catch (Exception e) {
            Log.e(DEBUG_TAG, e.getMessage());
            promise.reject(ERROR_CODE, e);
        }
    }

    private NativeArray collectNativeOfflineVideoStatuses() {
        WritableNativeArray statuses = new WritableNativeArray();
        for (OfflineVideoDownloadSession session: this.offlineVideoDownloadSessions) {
            if (session.videoId == null) continue;
            WritableNativeMap map = new WritableNativeMap();
            map.putString(CALLBACK_KEY_VIDEO_TOKEN, session.videoId);
            map.putDouble(CALLBACK_KEY_DOWNLOAD_PROGRESS, session.downloadProgress);
            statuses.pushMap(map);
        }
        for (OfflineVideoStatus status: this.offlineVideoStatuses) {
            boolean found = false;
            for (OfflineVideoDownloadSession session: this.offlineVideoDownloadSessions) {
                if (status.videoId.equals(session.videoId)) {
                    found = true;
                    break;
                }
            }
            if (found) continue;
            WritableNativeMap map = new WritableNativeMap();
            map.putString(CALLBACK_KEY_VIDEO_TOKEN, status.videoId);
            map.putDouble(CALLBACK_KEY_DOWNLOAD_PROGRESS, status.downloadProgress);
            statuses.pushMap(map);
        }
        return statuses;
    }

    private boolean hasOfflineVideoWithReferenceId(String referenceId) {
        for (OfflineVideoStatus status : this.offlineVideoStatuses) {
            if (referenceId.equals(status.referenceId)) return true;
        }
        for (OfflineVideoDownloadSession session : this.offlineVideoDownloadSessions) {
            if (referenceId.equals(session.referenceId)) return true;
        }
        return false;
    }

    private boolean hasOfflineVideoWithVideoId(String videoId) {
        for (OfflineVideoStatus status : this.offlineVideoStatuses) {
            if (videoId.equals(status.videoId)) return true;
        }
        for (OfflineVideoDownloadSession session : this.offlineVideoDownloadSessions) {
            if (videoId.equals(session.videoId)) return true;
        }
        return false;
    }

    @Override
    public void onSuccess(OfflineVideoDownloadSession session) {
        this.offlineVideoDownloadSessions.remove(session);
        this.offlineVideoStatuses.add(new OfflineVideoStatus(session.videoId, session.referenceId, session.downloadProgress));
    }

    @Override
    public void onError(OfflineVideoDownloadSession session) {
        this.offlineVideoDownloadSessions.remove(session);
    }

    @Override
    public void onSuccess(List<Video> videos) {
        this.offlineVideoStatuses.clear();
        for (Video video: videos) {
            this.offlineVideoStatuses.add(new OfflineVideoStatus(video.getId(), video.getReferenceId(), 1d));
        }
        this.isOfflineVideoStatusInitialized = true;
        NativeArray result = this.collectNativeOfflineVideoStatuses();
        for (Promise promise: this.initializeOfflineVideoStatusPromises) {
            promise.resolve(result);
        }
    }

    @Override
    public void onFailure(Throwable throwable) {
        this.isOfflineVideoStatusInitializing = false;
    }
}
