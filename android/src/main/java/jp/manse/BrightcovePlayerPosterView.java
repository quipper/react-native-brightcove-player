package jp.manse;

import android.graphics.Color;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.brightcove.player.edge.Catalog;
import com.brightcove.player.edge.OfflineCatalog;
import com.brightcove.player.edge.VideoListener;
import com.brightcove.player.model.Video;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;

import jp.manse.util.DefaultEventEmitter;
import jp.manse.util.ImageLoader;

public class BrightcovePlayerPosterView extends RelativeLayout implements LifecycleEventListener {
    private ThemedReactContext context;
    private ReactApplicationContext applicationContext;
    private ImageView imageView;
    private String policyKey;
    private String accountId;
    private String videoId;
    private String referenceId;
    private String videoToken;
    private Catalog catalog;
    private OfflineCatalog offlineCatalog;
    private ImageLoader imageLoader;

    public BrightcovePlayerPosterView(ThemedReactContext context, ReactApplicationContext applicationContext) {
        super(context);
        this.context = context;
        this.applicationContext = applicationContext;
        this.applicationContext.addLifecycleEventListener(this);
        this.imageView = new ImageView(context);
        this.imageView.setLayoutParams(new LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        this.imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
        this.addView(imageView);
        this.requestLayout();
    }

    public void setPolicyKey(String policyKey) {
        this.policyKey = policyKey;
        this.loadPoster();
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
        this.loadPoster();
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
        this.referenceId = null;
        this.loadPoster();
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
        this.videoId = null;
        this.loadPoster();
    }

    public void setVideoToken(String videoToken) {
        this.videoToken = videoToken;
        this.loadPoster();
    }

    public void setResizeMode(String resizeMode) {
        if ("contain".equals(resizeMode)) {
            this.imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
        } else if ("fit".equals(resizeMode)) {
            this.imageView.setScaleType(ImageView.ScaleType.FIT_XY);
        } else {
            this.imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
        }
    }

    private void loadPoster() {
        if (this.videoToken != null && !this.videoToken.equals("")) {
            this.offlineCatalog = new OfflineCatalog(this.context, DefaultEventEmitter.sharedEventEmitter, this.accountId, this.policyKey);
            Video video = this.offlineCatalog.findOfflineVideoById(this.videoToken);
            loadImage(video);
            return;
        }
        VideoListener listener = new VideoListener() {
            @Override
            public void onVideo(Video video) {
                loadImage(video);
            }
        };
        this.catalog = new Catalog(DefaultEventEmitter.sharedEventEmitter, this.accountId, this.policyKey);
        if (this.videoId != null) {
            this.catalog.findVideoByID(this.videoId, listener);
        } else if (this.referenceId != null) {
            this.catalog.findVideoByReferenceID(this.referenceId, listener);
        }
    }

    private void loadImage(Video video) {
        if (video == null) {
            this.imageView.setImageResource(android.R.color.transparent);
            return;
        }
        String url = video.getPosterImage().toString();
        if (url == null) {
            this.imageView.setImageResource(android.R.color.transparent);
            return;
        }
        if (this.imageLoader != null) {
            this.imageLoader.cancel(true);
        }
        this.imageLoader = new ImageLoader(this.imageView);
        this.imageLoader.execute(url);
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        if (this.imageLoader != null) {
            this.imageLoader.cancel(true);
        }
        this.applicationContext.removeLifecycleEventListener(this);
    }
}
