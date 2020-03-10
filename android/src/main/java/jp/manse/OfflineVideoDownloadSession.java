package jp.manse;

import androidx.annotation.NonNull;
import android.util.Log;

import com.brightcove.player.edge.Catalog;
import com.brightcove.player.edge.OfflineCallback;
import com.brightcove.player.edge.OfflineCatalog;
import com.brightcove.player.edge.VideoListener;
import com.brightcove.player.model.Video;
import com.brightcove.player.network.DownloadStatus;
import com.brightcove.player.offline.MediaDownloadable;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;

import java.io.Serializable;
import java.util.Map;

import jp.manse.util.DefaultEventEmitter;

public class OfflineVideoDownloadSession extends VideoListener implements MediaDownloadable.DownloadEventListener {
    final private static String ERROR_CODE = "error";
    final private static String ERROR_MESSAGE_ALREADY_EXISTS = "Offline video already exists";
    final private static String ERROR_MESSAGE_ALREADY_DOWNLOADING = "Offline video is already downloading";
    final private static String ERROR_MESSAGE_VIDEO_NOT_FOUND = "Could not find the video";
    final private static String ERROR_MESSAGE_DOWNLOAD_CANCEL = "Failed to download video";
    public String videoId;
    public String referenceId;
    public double downloadProgress = 0;

    public Promise promise;

    private Catalog catalog;
    private OfflineCatalog offlineCatalog;
    private OnOfflineVideoDownloadSessionListener listener;

    public interface OnOfflineVideoDownloadSessionListener {
        void onCompleted(OfflineVideoDownloadSession session);

        void onProgress();
    }

    public OfflineVideoDownloadSession(ReactApplicationContext context, String accountId, String policyKey, OnOfflineVideoDownloadSessionListener listener) {
        this.catalog = new Catalog(DefaultEventEmitter.sharedEventEmitter, accountId, policyKey);
        this.offlineCatalog = new OfflineCatalog(context, DefaultEventEmitter.sharedEventEmitter, accountId, policyKey);
        this.offlineCatalog.setMeteredDownloadAllowed(true);
        this.offlineCatalog.setMobileDownloadAllowed(true);
        this.offlineCatalog.setRoamingDownloadAllowed(true);
        this.offlineCatalog.addDownloadEventListener(this);
        this.listener = listener;
    }

    public void requestDownloadWithReferenceId(String referenceId, int bitRate, Promise promise) {
        this.promise = promise;
        this.referenceId = referenceId;
        this.offlineCatalog.setVideoBitrate(bitRate);
        this.catalog.findVideoByReferenceID(referenceId, this);
    }

    public void requestDownloadWithVideoId(String videoId, int bitRate, Promise promise) {
        this.promise = promise;
        this.videoId = videoId;
        this.offlineCatalog.setVideoBitrate(bitRate);
        this.catalog.findVideoByID(videoId, this);
    }

    public void resumeDownload(Video video) {
        this.onVideo(video);
    }

    @Override
    public void onVideo(final Video video) {
        this.videoId = video.getId();
        this.referenceId = video.getReferenceId();
        DownloadStatus status = this.offlineCatalog.getVideoDownloadStatus(video);
        switch (status.getCode()) {
            case DownloadStatus.STATUS_NOT_QUEUED:
                this.offlineCatalog.downloadVideo(video);
                this.resolve(video);
                break;
            case DownloadStatus.STATUS_DOWNLOADING:
            case DownloadStatus.STATUS_PENDING:
                this.rejectWithCallback(ERROR_MESSAGE_ALREADY_DOWNLOADING);
                break;
            case DownloadStatus.STATUS_COMPLETE:
                this.rejectWithCallback(ERROR_MESSAGE_ALREADY_EXISTS);
                this.listener.onCompleted(this);
                break;
            default:
                this.offlineCatalog.cancelVideoDownload(video);
                this.offlineCatalog.deleteVideo(video, new OfflineCallback<Boolean>() {
                    @Override
                    public void onSuccess(Boolean aBoolean) {
                        offlineCatalog.downloadVideo(video);
                        resolve(video);
                    }

                    @Override
                    public void onFailure(Throwable throwable) {
                        rejectWithCallback(ERROR_MESSAGE_DOWNLOAD_CANCEL);
                    }
                });
        }
    }

    @Override
    public void onError(String error) {
        this.rejectWithCallback(ERROR_MESSAGE_VIDEO_NOT_FOUND);
    }

    @Override
    public void onDownloadRequested(@NonNull Video video) {
    }

    @Override
    public void onDownloadStarted(@NonNull Video video, long l, @NonNull Map<String, Serializable> map) {
    }

    @Override
    public void onDownloadProgress(@NonNull Video video, @NonNull DownloadStatus downloadStatus) {
        this.listener.onProgress();
        this.downloadProgress = downloadStatus.getProgress() * 0.01d;
    }

    @Override
    public void onDownloadPaused(@NonNull Video video, @NonNull DownloadStatus downloadStatus) {
        this.listener.onCompleted(this);
    }

    @Override
    public void onDownloadCompleted(@NonNull Video video, @NonNull DownloadStatus downloadStatus) {
        this.downloadProgress = 1d;
        this.listener.onCompleted(this);
    }

    @Override
    public void onDownloadCanceled(@NonNull Video video) {
        this.listener.onCompleted(this);
    }

    @Override
    public void onDownloadDeleted(@NonNull Video video) {
        this.listener.onCompleted(this);
    }

    @Override
    public void onDownloadFailed(@NonNull Video video, @NonNull DownloadStatus downloadStatus) {
        this.listener.onCompleted(this);
    }

    private void resolve(Video video) {
        if (this.promise != null) {
            this.promise.resolve(video.getId());
        }
    }

    private void rejectWithCallback(String message) {
        this.listener.onCompleted(this);
        if (this.promise != null) {
            this.promise.reject(ERROR_CODE, message);
        }
    }
}
