package jp.manse;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.List;

import jp.manse.offlineVideo.OfflineVideoOwner;

public class BrightcovePlayerUtil extends ReactContextBaseJavaModule {
    final private static String ERROR_CODE = "error";
    final private static String ERROR_MESSAGE_MISSING_ARGUMENTS = "Both accountId and policyKey must not be null";

    private List<OfflineVideoOwner> offlineVideoOwners = new ArrayList<>();

    public BrightcovePlayerUtil(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BrightcovePlayerUtil";
    }

    @ReactMethod
    public void requestDownloadVideoWithReferenceId(String referenceId, final String accountId, final String policyKey, final int bitRate, final Promise promise) {
        OfflineVideoOwner owner = this.getOfflineVideoOwner(accountId, policyKey);
        if (owner == null) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_MISSING_ARGUMENTS);
            return;
        }
        owner.requestDownloadWithReferenceId(referenceId, bitRate, promise);
    }

    @ReactMethod
    public void requestDownloadVideoWithVideoId(String videoId, final String accountId, final String policyKey, final int bitRate, final Promise promise) {
        OfflineVideoOwner owner = this.getOfflineVideoOwner(accountId, policyKey);
        if (owner == null) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_MISSING_ARGUMENTS);
            return;
        }
        owner.requestDownloadWithVideoId(videoId, bitRate, promise);
    }

    @ReactMethod
    public void getOfflineVideoStatuses(String accountId, String policyKey, final Promise promise) {
        OfflineVideoOwner owner = this.getOfflineVideoOwner(accountId, policyKey);
        if (owner == null) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_MISSING_ARGUMENTS);
            return;
        }
        owner.getOfflineVideoStatuses(promise);
    }

    @ReactMethod
    public void deleteOfflineVideoWithVideoToken(String accountId, String policyKey, String videoId, final Promise promise) {
        OfflineVideoOwner owner = this.getOfflineVideoOwner(accountId, policyKey);
        if (owner == null) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_MISSING_ARGUMENTS);
            return;
        }
        owner.deleteOfflineVideo(videoId, promise);
    }

    private OfflineVideoOwner getOfflineVideoOwner(String accountId, String policyKey) {
        if (accountId == null || policyKey == null) return null;
        for (OfflineVideoOwner owner: this.offlineVideoOwners) {
            if (owner.accountId.equals(accountId) && policyKey.equals(policyKey)) {
                return owner;
            }
        }
        OfflineVideoOwner owner = new OfflineVideoOwner(this.getReactApplicationContext(), accountId, policyKey);
        this.offlineVideoOwners.add(owner);
        return owner;
    }
}
