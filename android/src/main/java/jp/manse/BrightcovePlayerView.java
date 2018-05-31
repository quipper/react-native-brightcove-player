package jp.manse;

import android.graphics.Color;
import android.util.AttributeSet;
import android.util.Log;
import android.view.SurfaceView;

import com.brightcove.player.edge.Catalog;
import com.brightcove.player.edge.VideoListener;
import com.brightcove.player.event.Event;
import com.brightcove.player.event.EventListener;
import com.brightcove.player.event.EventType;
import com.brightcove.player.mediacontroller.BrightcoveMediaController;
import com.brightcove.player.model.Video;
import com.brightcove.player.view.BrightcoveExoPlayerVideoView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class BrightcovePlayerView extends BrightcoveExoPlayerVideoView {
    private String policyKey;
    private String accountId;
    private String videoId;
    private String referenceId;
    private Catalog catalog;
    private Boolean autoPlay = true;
    private Boolean playing = false;

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
        this.getEventEmitter().on(EventType.READY_TO_PLAY, new EventListener() {
            @Override
            public void processEvent(Event e) {
                WritableMap event = Arguments.createMap();
                ReactContext reactContext = (ReactContext) BrightcovePlayerView.this.getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(BrightcovePlayerView.this.getId(), BrightcovePlayerManager.EVENT_READY, event);
            }
        });
        this.getEventEmitter().on(EventType.DID_PLAY, new EventListener() {
            @Override
            public void processEvent(Event e) {
                BrightcovePlayerView.this.playing = true;
                WritableMap event = Arguments.createMap();
                ReactContext reactContext = (ReactContext) BrightcovePlayerView.this.getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(BrightcovePlayerView.this.getId(), BrightcovePlayerManager.EVENT_PLAY, event);
            }
        });
        this.getEventEmitter().on(EventType.DID_PAUSE, new EventListener() {
            @Override
            public void processEvent(Event e) {
                BrightcovePlayerView.this.playing = false;
                WritableMap event = Arguments.createMap();
                ReactContext reactContext = (ReactContext) BrightcovePlayerView.this.getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(BrightcovePlayerView.this.getId(), BrightcovePlayerManager.EVENT_PAUSE, event);
            }
        });
        this.getEventEmitter().on(EventType.COMPLETED, new EventListener() {
            @Override
            public void processEvent(Event e) {
                WritableMap event = Arguments.createMap();
                ReactContext reactContext = (ReactContext) BrightcovePlayerView.this.getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(BrightcovePlayerView.this.getId(), BrightcovePlayerManager.EVENT_END, event);
            }
        });
        this.getEventEmitter().on(EventType.PROGRESS, new EventListener() {
            @Override
            public void processEvent(Event e) {
                WritableMap event = Arguments.createMap();
                Long playhead = (Long)e.properties.get(Event.PLAYHEAD_POSITION);
                event.putDouble("currentTime", playhead / 1000d);
                ReactContext reactContext = (ReactContext) BrightcovePlayerView.this.getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(BrightcovePlayerView.this.getId(), BrightcovePlayerManager.EVENT_PROGRESS, event);
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

    public void setVideoId(String videoId) {
        this.videoId = videoId;
        this.referenceId = null;
        this.setupCatalog();
        this.loadMovie();
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
        this.videoId = null;
        this.setupCatalog();
        this.loadMovie();
    }

    public void setAutoPlay(Boolean autoPlay) {
        this.autoPlay = autoPlay;
    }

    public void setPlay(Boolean play) {
        if (this.playing == play) return;
        if (play) {
            this.start();
        } else {
            this.pause();
        }
    }

    private void setupCatalog() {
        if (this.catalog != null || this.policyKey == null || this.accountId == null) return;
        this.catalog = new Catalog(this.getEventEmitter(), this.accountId, this.policyKey);
    }

    private void loadMovie() {
        if (this.catalog == null) return;
        VideoListener listener = new VideoListener() {

            @Override
            public void onVideo(Video video) {
                BrightcovePlayerView.this.clear();
                BrightcovePlayerView.this.add(video);
                if (BrightcovePlayerView.this.autoPlay) {
                    BrightcovePlayerView.this.start();
                }
            }
        };
        if (this.videoId != null) {
            this.catalog.findVideoByID(this.videoId, listener);
        } else if (this.referenceId != null) {
            this.catalog.findVideoByReferenceID(this.referenceId, listener);
        }
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
