package jp.manse.offlineVideo;

public class OfflineVideoStatus {
    public String videoId;
    public String referenceId;
    public double downloadProgress;

    OfflineVideoStatus(String videoId, String referenceId, double downloadProgress) {
        this.videoId = videoId;
        this.referenceId = referenceId;
        this.downloadProgress = downloadProgress;
    }
}
