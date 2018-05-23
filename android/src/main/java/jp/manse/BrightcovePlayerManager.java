package jp.manse;

import android.view.View;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;


public class BrightcovePlayerManager extends SimpleViewManager<BrightcovePlayerView> {
    public static final String REACT_CLASS = "BrightcovePlayer";

    private static ThemedReactContext context;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public BrightcovePlayerView createViewInstance(ThemedReactContext ctx) {
        context = ctx;
        BrightcovePlayerView brightcovePlayerView = new BrightcovePlayerView(ctx);
        return brightcovePlayerView;
    }

    @ReactProp(name = "policyKey", customType = "")
    public void setPolicyKey(BrightcovePlayerView view, String policyKey) {
        view.setPolicyKey(policyKey);
    }

    @ReactProp(name = "accountId", customType = "")
    public void setAccountId(BrightcovePlayerView view, String accountId) {
        view.setAccountId(accountId);
    }

    @ReactProp(name = "videoReferenceId", customType = "")
    public void setVideoReferenceId(BrightcovePlayerView view, String videoReferenceId) {
        view.setVideoReferenceId(videoReferenceId);
    }
}
