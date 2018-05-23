package jp.manse;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.util.AttributeSet;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.brightcove.player.edge.Catalog;
import com.brightcove.player.edge.VideoListener;
import com.brightcove.player.event.Event;
import com.brightcove.player.event.EventListener;
import com.brightcove.player.event.EventType;
import com.brightcove.player.mediacontroller.BrightcoveMediaController;
import com.brightcove.player.mediacontroller.ShowHideController;
import com.brightcove.player.model.Video;
import com.brightcove.player.view.BrightcoveExoPlayerVideoView;
import com.brightcove.player.view.BrightcovePlayer;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;

public class BrightcovePlayerView extends BrightcoveExoPlayerVideoView {
    private String policyKey;
    private String accountId;
    private String videoReferenceId;
    private Catalog catalog;

    public BrightcovePlayerView(ThemedReactContext context) {
        this(context, null);
    }

    public BrightcovePlayerView(ThemedReactContext context, AttributeSet attrs) {
        super(context, attrs);
        this.setBackgroundColor(Color.BLACK);
        this.finishInitialization();
        this.setMediaController(new BrightcoveMediaController(this));
        this.getEventEmitter().on(EventType.VIDEO_SIZE_KNOWN, new EventListener() {
            @Override
            public void processEvent(Event e) {
                fixVideoLayout();
            }
        });
    }

    public void setPolicyKey(String policyKey) {
        this.policyKey = policyKey;
        this.setupCatalog();
        this.loadMovie();
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
        this.setupCatalog();
        this.loadMovie();
    }

    public void setVideoReferenceId(String videoReferenceId) {
        this.videoReferenceId = videoReferenceId;
        this.setupCatalog();
        this.loadMovie();
    }

    private void setupCatalog() {
        if (this.catalog != null || this.policyKey == null || this.accountId == null) return;
        this.catalog = new Catalog(this.getEventEmitter(), this.accountId, this.policyKey);
    }

    private void loadMovie() {
        if (this.catalog == null || this.videoReferenceId == null) return;
        this.catalog.findVideoByID(this.videoReferenceId, new VideoListener() {

            @Override
            public void onVideo(Video video) {
                BrightcovePlayerView.this.clear();
                BrightcovePlayerView.this.add(video);
                BrightcovePlayerView.this.start();
            }
        });
    }

    private void fixVideoLayout() {
        int viewWidth = this.getMeasuredWidth();
        int viewHeight = this.getMeasuredHeight();
        SurfaceView surfaceView = (SurfaceView) this.getRenderView();
        surfaceView.measure(viewWidth, viewHeight);
        int surfaceWidth = surfaceView.getMeasuredWidth();
        int surfaceHeight = surfaceView.getMeasuredHeight();
        int leftOffset = (viewWidth - surfaceWidth) / 2;
        int topOffset = (viewHeight - surfaceHeight) / 2;
        surfaceView.layout(leftOffset, topOffset, leftOffset + surfaceWidth, topOffset + surfaceHeight);
    }
}
