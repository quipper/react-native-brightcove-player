package jp.manse.offlineVideo;

import android.support.annotation.NonNull;
import android.util.Log;

import com.brightcove.player.edge.Catalog;
import com.brightcove.player.edge.OfflineCatalog;
import com.brightcove.player.edge.VideoListener;
import com.brightcove.player.model.Video;
import com.brightcove.player.network.DownloadStatus;
import com.brightcove.player.offline.MediaDownloadable;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;

import java.io.Serializable;
import java.util.Map;

import jp.manse.DefaultEventEmitter;

public class OfflineVideoDownloadSession extends VideoListener implements MediaDownloadable.DownloadEventListener {
    final private static String ERROR_CODE = "error";
    final private static String ERROR_MESSAGE_ALREADY_EXISTS = "Offline video already exists";
    final private static String ERROR_MESSAGE_VIDEO_NOT_FOUND = "Could not find the video";
    final private static String ERROR_MESSAGE_DOWNLOAD_CANCEL = "Failed to download video";
    public String videoId;
    public String referenceId;
    public double downloadProgress = 0;

    public Promise promise;

    private boolean hasFinished = false;
    private OnOfflineVideoDownloadSessionListener listener;
    private Catalog catalog;
    private OfflineCatalog offlineCatalog;

    public interface OnOfflineVideoDownloadSessionListener {
        void onSuccess(OfflineVideoDownloadSession session);

        void onError(OfflineVideoDownloadSession session);
    }

    OfflineVideoDownloadSession(ReactApplicationContext context, String accountId, String policyKey, int bitRate, Promise promise, OnOfflineVideoDownloadSessionListener listener) {
        this.promise = promise;
        this.listener = listener;
        this.offlineCatalog = new OfflineCatalog(context, DefaultEventEmitter.sharedEventEmitter, accountId, policyKey);
        this.offlineCatalog.setMeteredDownloadAllowed(false);
        this.offlineCatalog.setMobileDownloadAllowed(false);
        this.offlineCatalog.setRoamingDownloadAllowed(false);
        this.offlineCatalog.setVideoBitrate(bitRate);
        this.offlineCatalog.addDownloadEventListener(this);
        this.catalog = new Catalog(DefaultEventEmitter.sharedEventEmitter, accountId, policyKey);
    }

    public void requestDownloadWithReferenceId(String referenceId) {
        this.referenceId = referenceId;
        this.catalog.findVideoByReferenceID(referenceId, this);
    }

    public void requestDownloadWithVideoId(String videoId) {
        this.videoId = videoId;
        this.catalog.findVideoByID(videoId, this);
    }

    @Override
    public void onDownloadRequested(@NonNull Video video) {
        this.videoId = video.getId();
        this.referenceId = video.getReferenceId();
    }

    @Override
    public void onDownloadStarted(@NonNull Video video, long l, @NonNull Map<String, Serializable> map) {
        this.videoId = video.getId();
        this.referenceId = video.getReferenceId();
    }

    @Override
    public void onDownloadProgress(@NonNull Video video, @NonNull DownloadStatus downloadStatus) {
        this.downloadProgress = downloadStatus.getProgress() * 0.01;
    }

    @Override
    public void onDownloadPaused(@NonNull Video video, @NonNull DownloadStatus downloadStatus) {
        this.invokeError(ERROR_MESSAGE_DOWNLOAD_CANCEL);
    }

    @Override
    public void onDownloadCompleted(@NonNull Video video, @NonNull DownloadStatus downloadStatus) {
        this.downloadProgress = 1d;
        this.invokeSuccess(video);
    }

    @Override
    public void onDownloadCanceled(@NonNull Video video) {
        this.invokeError(ERROR_MESSAGE_DOWNLOAD_CANCEL);
    }

    @Override
    public void onDownloadDeleted(@NonNull Video video) {
        this.invokeError(ERROR_MESSAGE_DOWNLOAD_CANCEL);
    }

    @Override
    public void onDownloadFailed(@NonNull Video video, @NonNull DownloadStatus downloadStatus) {
        this.invokeError(ERROR_MESSAGE_DOWNLOAD_CANCEL);
    }

    @Override
    public void onVideo(Video video) {
        DownloadStatus status = this.offlineCatalog.downloadVideo(video);
        if (status.getCode() != DownloadStatus.STATUS_NOT_QUEUED) {
            this.invokeError(ERROR_MESSAGE_ALREADY_EXISTS);
        }
    }

    @Override
    public void onError(String error) {
        this.invokeError(ERROR_MESSAGE_VIDEO_NOT_FOUND);
    }

    private void invokeSuccess(Video video) {
        if (this.hasFinished) return;
        this.hasFinished = true;
        this.promise.resolve(video.getId());
        this.listener.onSuccess(this);
    }

    private void invokeError(String message) {
        if (this.hasFinished) return;
        this.hasFinished = true;
        this.promise.reject(ERROR_CODE, message);
        this.listener.onError(this);
    }
}
