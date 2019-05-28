package jp.manse;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.List;

public class BrightcovePlayerUtil extends ReactContextBaseJavaModule {
    final private static String ERROR_CODE = "error";
    final private static String ERROR_MESSAGE_MISSING_ARGUMENTS = "Both accountId and policyKey must not be null";

    private List<BrightcovePlayerAccount> brightcovePlayerAccounts = new ArrayList<>();

    public BrightcovePlayerUtil(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BrightcovePlayerUtil";
    }

    @ReactMethod
    public void requestDownloadVideoWithReferenceId(String referenceId, String accountId, String policyKey, int bitRate, Promise promise) {
        BrightcovePlayerAccount account = this.getBrightcovePlayerAccount(accountId, policyKey);
        if (account == null) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_MISSING_ARGUMENTS);
            return;
        }
        account.requestDownloadWithReferenceId(referenceId, bitRate, promise);
    }

    @ReactMethod
    public void requestDownloadVideoWithVideoId(String videoId, String accountId, String policyKey, int bitRate, Promise promise) {
        BrightcovePlayerAccount account = this.getBrightcovePlayerAccount(accountId, policyKey);
        if (account == null) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_MISSING_ARGUMENTS);
            return;
        }
        account.requestDownloadWithVideoId(videoId, bitRate, promise);
    }

    @ReactMethod
    public void getOfflineVideoStatuses(String accountId, String policyKey, Promise promise) {
        BrightcovePlayerAccount account = this.getBrightcovePlayerAccount(accountId, policyKey);
        if (account == null) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_MISSING_ARGUMENTS);
            return;
        }
        account.getOfflineVideoStatuses(promise);
    }

    @ReactMethod
    public void deleteOfflineVideo(String accountId, String policyKey, String videoId, Promise promise) {
        BrightcovePlayerAccount account = this.getBrightcovePlayerAccount(accountId, policyKey);
        if (account == null) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_MISSING_ARGUMENTS);
            return;
        }
        account.deleteOfflineVideo(videoId, promise);
    }

    @ReactMethod
    public void getPlaylistWithPlaylistId(String playlistId, String accountId, String policyKey, Promise promise) {
        BrightcovePlayerAccount account = this.getBrightcovePlayerAccount(accountId, policyKey);
        if (account == null) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_MISSING_ARGUMENTS);
            return;
        }
        account.getPlaylistWithPlaylistId(playlistId, promise);
    }

    @ReactMethod
    public void getPlaylistWithReferenceId(String referenceId, String accountId, String policyKey, Promise promise) {
        BrightcovePlayerAccount account = this.getBrightcovePlayerAccount(accountId, policyKey);
        if (account == null) {
            promise.reject(ERROR_CODE, ERROR_MESSAGE_MISSING_ARGUMENTS);
            return;
        }
        account.getPlaylistWithReferenceId(referenceId, promise);
    }

    private BrightcovePlayerAccount getBrightcovePlayerAccount(String accountId, String policyKey) {
        if (accountId == null || policyKey == null) return null;
        for (BrightcovePlayerAccount owner: this.brightcovePlayerAccounts) {
            if (owner.accountId.equals(accountId) && policyKey.equals(policyKey)) {
                return owner;
            }
        }
        BrightcovePlayerAccount owner = new BrightcovePlayerAccount(this.getReactApplicationContext(), accountId, policyKey);
        this.brightcovePlayerAccounts.add(owner);
        return owner;
    }
}
