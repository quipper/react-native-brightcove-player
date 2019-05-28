package jp.manse;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;


public class BrightcovePlayerPosterManager extends SimpleViewManager<BrightcovePlayerPosterView> {
    public static final String REACT_CLASS = "BrightcovePlayerPoster";

    private static ThemedReactContext context;
    private ReactApplicationContext applicationContext;

    public BrightcovePlayerPosterManager(ReactApplicationContext context) {
        this.applicationContext = context;
    }


    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public BrightcovePlayerPosterView createViewInstance(ThemedReactContext ctx) {
        context = ctx;
        BrightcovePlayerPosterView brightcovePlayerPosterView = new BrightcovePlayerPosterView(ctx, applicationContext);
        return brightcovePlayerPosterView;
    }

    @ReactProp(name = "policyKey")
    public void setPolicyKey(BrightcovePlayerPosterView view, String policyKey) {
        view.setPolicyKey(policyKey);
    }

    @ReactProp(name = "accountId")
    public void setAccountId(BrightcovePlayerPosterView view, String accountId) {
        view.setAccountId(accountId);
    }

    @ReactProp(name = "videoId")
    public void setVideoId(BrightcovePlayerPosterView view, String videoId) {
        view.setVideoId(videoId);
    }

    @ReactProp(name = "referenceId")
    public void setReferenceId(BrightcovePlayerPosterView view, String referenceId) {
        view.setReferenceId(referenceId);
    }

    @ReactProp(name = "videoToken")
    public void setVideoToken(BrightcovePlayerPosterView view, String videoToken) {
        view.setVideoToken(videoToken);
    }

    @ReactProp(name = "resizeMode")
    public void setResizeMode(BrightcovePlayerPosterView view, String resizeMode) {
        view.setResizeMode(resizeMode);
    }
}
