package jp.manse;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.brightcove.player.edge.Catalog;
import com.brightcove.player.edge.OfflineCallback;
import com.brightcove.player.edge.OfflineCatalog;
import com.brightcove.player.edge.PlaylistListener;
import com.brightcove.player.model.Playlist;
import com.brightcove.player.model.Video;
import com.brightcove.player.network.DownloadStatus;
import com.facebook.react.bridge.NativeArray;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jp.manse.util.DefaultEventEmitter;

public class BrightcovePlayerAccount implements OfflineVideoDownloadSession.OnOfflineVideoDownloadSessionListener {
    final private static int FPS = 40;
    final private static String DEBUG_TAG = "brightcoveplayer";
    final private static String ERROR_CODE = "error";
    final private static String ERROR_MESSAGE_DUPLICATE_SESSION = "Offline video or download session already exists";
    final private static String ERROR_MESSAGE_DELETE = "Could not delete video";
    final private static String ERROR_MESSAGE_PLAYLIST = "Failed to load playlist";
    final private static String CALLBACK_KEY_VIDEO_TOKEN = "videoToken";
    final private static String CALLBACK_KEY_DOWNLOAD_PROGRESS = "downloadProgress";
    final private static String CALLBACK_KEY_ACCOUNT_ID = "accountId";
    final private static String CALLBACK_KEY_VIDEO_ID = "videoId";
    final private static String CALLBACK_KEY_REFERENCE_ID = "referenceId";
    final private static String CALLBACK_KEY_NAME = "name";
    final private static String CALLBACK_KEY_DESCRIPTION = "description";
    final private static String CALLBACK_KEY_DURATION = "duration";

    private ReactApplicationContext context;
    public String accountId;
    public String policyKey;

    private Handler handler;
    private List<OfflineVideoDownloadSession> offlineVideoDownloadSessions = new ArrayList<>();
    private boolean getOfflineVideoStatusesRunning = false;
    private List<Promise> getOfflineVideoStatusesPendingPromises = new ArrayList<>();
    private List<Video> allDownloadedVideos = new ArrayList<>();
    private Catalog catalog;
    private OfflineCatalog offlineCatalog;
    private OnBrightcovePlayerAccountListener listener;

    public interface OnBrightcovePlayerAccountListener {
        void onOfflineStorageStateChanged(NativeArray array);
    }

    public BrightcovePlayerAccount(final ReactApplicationContext context, final String accountId, final String policyKey, OnBrightcovePlayerAccountListener listener) {
        this.context = context;
        this.accountId = accountId;
        this.policyKey = policyKey;
        this.listener = listener;
        handler = new Handler(Looper.myLooper());
        this.catalog = new Catalog(DefaultEventEmitter.sharedEventEmitter, accountId, policyKey);
        this.offlineCatalog = new OfflineCatalog(context, DefaultEventEmitter.sharedEventEmitter, accountId, policyKey);
        this.offlineCatalog.setMeteredDownloadAllowed(true);
        this.offlineCatalog.setMobileDownloadAllowed(true);
        this.offlineCatalog.setRoamingDownloadAllowed(true);
        this.offlineCatalog.findAllVideoDownload(DownloadStatus.STATUS_DOWNLOADING, new OfflineCallback<List<Video>>() {
            @Override
            public void onSuccess(List<Video> videos) {
                for (Video video : videos) {
                    OfflineVideoDownloadSession session = new OfflineVideoDownloadSession(context, accountId, policyKey, BrightcovePlayerAccount.this);
                    session.resumeDownload(video);
                    offlineVideoDownloadSessions.add(session);
                }
            }

            @Override
            public void onFailure(Throwable throwable) {
            }
        });
    }

    public void requestDownloadWithReferenceId(String referenceId, int bitRate, Promise promise) {
        if (this.hasOfflineVideoDownloadSessionWithReferenceId(referenceId)) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_DUPLICATE_SESSION);
            return;
        }
        OfflineVideoDownloadSession session = new OfflineVideoDownloadSession(this.context, this.accountId, this.policyKey, this);
        session.requestDownloadWithReferenceId(referenceId, bitRate, promise);
        this.offlineVideoDownloadSessions.add(session);
        this.listener.onOfflineStorageStateChanged(collectNativeOfflineVideoStatuses());
    }

    public void requestDownloadWithVideoId(String videoId, int bitRate, Promise promise) {
        if (this.hasOfflineVideoDownloadSessionWithVideoId(videoId)) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_DUPLICATE_SESSION);
            return;
        }
        OfflineVideoDownloadSession session = new OfflineVideoDownloadSession(this.context, this.accountId, this.policyKey, this);
        session.requestDownloadWithVideoId(videoId, bitRate, promise);
        this.offlineVideoDownloadSessions.add(session);
        this.listener.onOfflineStorageStateChanged(collectNativeOfflineVideoStatuses());
    }

    public void getOfflineVideoStatuses(Promise promise) {
        if (this.getOfflineVideoStatusesRunning) {
            this.getOfflineVideoStatusesPendingPromises.add(promise);
            return;
        }
        this.getOfflineVideoStatusesRunning = true;
        this.getOfflineVideoStatusesPendingPromises.clear();
        this.getOfflineVideoStatusesPendingPromises.add(promise);
        final Runnable updateRunnable = new Runnable() {
            @Override
            public void run() {
                sendOfflineVideoStatuses();
                getOfflineVideoStatusesRunning = false;
            }
        };
        this.offlineCatalog.findAllVideoDownload(DownloadStatus.STATUS_COMPLETE, new OfflineCallback<List<Video>>() {
            @Override
            public void onSuccess(List<Video> videos) {
                allDownloadedVideos = videos;
                handler.postDelayed(updateRunnable, FPS);
            }

            @Override
            public void onFailure(Throwable throwable) {
                for (Promise promise : getOfflineVideoStatusesPendingPromises) {
                    promise.reject(ERROR_CODE, ERROR_CODE);
                }
                getOfflineVideoStatusesRunning = false;
            }
        });
    }

    private void sendOfflineVideoStatuses() {
        for (Promise promise : getOfflineVideoStatusesPendingPromises) {
            promise.resolve(this.collectNativeOfflineVideoStatuses());
        }
    }

    public void deleteOfflineVideo(final String videoId, final Promise promise) {
        try {
            if (videoId == null) throw new Exception();
            this.offlineCatalog.cancelVideoDownload(videoId);
            for (int i = this.offlineVideoDownloadSessions.size() - 1; i >= 0; i--) {
                OfflineVideoDownloadSession session = this.offlineVideoDownloadSessions.get(i);
                if (videoId.equals(session.videoId)) {
                    this.offlineVideoDownloadSessions.remove(i);
                }
            }
            this.offlineCatalog.deleteVideo(videoId, new OfflineCallback<Boolean>() {
                @Override
                public void onSuccess(Boolean aBoolean) {
                    promise.resolve(null);
                    for (int i = allDownloadedVideos.size() - 1; i >= 0; i--) {
                        Video video = allDownloadedVideos.get(i);
                        if (videoId.equals(video.getId())) {
                            allDownloadedVideos.remove(i);
                        }
                    }
                    listener.onOfflineStorageStateChanged(collectNativeOfflineVideoStatuses());
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

    public void getPlaylistWithPlaylistId(String playlistId, final Promise promise) {
        catalog.findPlaylistByID(playlistId, new PlaylistListener() {
            @Override
            public void onPlaylist(Playlist playlist) {
                promise.resolve(collectNativePlaylist(accountId, playlist));
            }

            @Override
            public void onError(String error) {
                promise.reject(ERROR_CODE, ERROR_MESSAGE_PLAYLIST);
            }
        });
    }

    public void getPlaylistWithReferenceId(String referenceId, final Promise promise) {
        catalog.findPlaylistByReferenceID(referenceId, new PlaylistListener() {
            @Override
            public void onPlaylist(Playlist playlist) {
                promise.resolve(collectNativePlaylist(accountId, playlist));
            }

            @Override
            public void onError(String error) {
                promise.reject(ERROR_CODE, ERROR_MESSAGE_PLAYLIST);
            }
        });
    }

    private NativeArray collectNativeOfflineVideoStatuses() {
        WritableNativeArray statuses = new WritableNativeArray();
        for (Video video : this.allDownloadedVideos) {
            WritableNativeMap map = new WritableNativeMap();
            map.putString(CALLBACK_KEY_ACCOUNT_ID, this.accountId);
            map.putString(CALLBACK_KEY_VIDEO_ID, video.getId());
            map.putString(CALLBACK_KEY_VIDEO_TOKEN, video.getId());
            map.putDouble(CALLBACK_KEY_DOWNLOAD_PROGRESS, 1);
            statuses.pushMap(map);
        }
        for (OfflineVideoDownloadSession session : this.offlineVideoDownloadSessions) {
            if (session.videoId == null) continue;
            boolean found = false;
            for (Video video : this.allDownloadedVideos) {
                if (session.videoId.equals(video.getId())) {
                    found = true;
                    break;
                }
            }
            if (found) continue;
            WritableNativeMap map = new WritableNativeMap();
            map.putString(CALLBACK_KEY_ACCOUNT_ID, this.accountId);
            map.putString(CALLBACK_KEY_VIDEO_ID, session.videoId);
            map.putString(CALLBACK_KEY_VIDEO_TOKEN, session.videoId);
            map.putDouble(CALLBACK_KEY_DOWNLOAD_PROGRESS, session.downloadProgress);
            statuses.pushMap(map);
        }
        return statuses;
    }

    private NativeArray collectNativePlaylist(String accountId, Playlist playlist) {
        WritableNativeArray result = new WritableNativeArray();
        for (Video video : playlist.getVideos()) {
            WritableNativeMap map = new WritableNativeMap();
            map.putString(CALLBACK_KEY_ACCOUNT_ID, accountId);
            map.putString(CALLBACK_KEY_VIDEO_ID, video.getId());
            map.putString(CALLBACK_KEY_REFERENCE_ID, video.getReferenceId());
            map.putString(CALLBACK_KEY_NAME, video.getName());
            map.putString(CALLBACK_KEY_DESCRIPTION, video.getDescription());
            map.putInt(CALLBACK_KEY_DURATION, video.getDuration());
            result.pushMap(map);
        }
        return result;
    }

    private boolean hasOfflineVideoDownloadSessionWithReferenceId(String referenceId) {
        for (OfflineVideoDownloadSession session : this.offlineVideoDownloadSessions) {
            if (referenceId.equals(session.referenceId)) return true;
        }
        return false;
    }

    private boolean hasOfflineVideoDownloadSessionWithVideoId(String videoId) {
        for (OfflineVideoDownloadSession session : this.offlineVideoDownloadSessions) {
            if (videoId.equals(session.videoId)) return true;
        }
        return false;
    }

    @Override
    public void onCompleted(OfflineVideoDownloadSession session) {
        this.offlineVideoDownloadSessions.remove(session);
        if (session.downloadProgress == 1) {
            Map<String, Object> param = new HashMap<>();
            param.put(Video.Fields.ID, session.videoId);
            this.allDownloadedVideos.add(new Video(param));
        }
        this.listener.onOfflineStorageStateChanged(collectNativeOfflineVideoStatuses());
    }

    @Override
    public void onProgress() {
        this.listener.onOfflineStorageStateChanged(collectNativeOfflineVideoStatuses());
    }
}
