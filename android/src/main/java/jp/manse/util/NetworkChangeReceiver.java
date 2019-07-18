package jp.manse.util;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class NetworkChangeReceiver extends BroadcastReceiver {

    private NetworkChangeListener listener;

    @Override
    public void onReceive(final Context context, final Intent intent) {

        int status = NetworkUtil.getConnectivityStatus(context);
        Log.e("NetworkChangeReceiver", "The network status is " + status);
        if ("android.net.conn.CONNECTIVITY_CHANGE".equals(intent.getAction())) {
            if (status == NetworkUtil.NETWORK_STATUS_NOT_CONNECTED) {
                Log.e("NetworkChangeReceiver", "Not connected");
                if (listener != null) {
                    listener.onDisconnected();
                }
            } else {
                Log.e("NetworkChangeReceiver", "Is connected");
                if (listener != null) {
                    listener.onConnected();
                }
            }
        }
    }

    public void registerListener(NetworkChangeListener listener) {
        this.listener = listener;
    }

    public void unregisterListener() {
        this.listener = null;
    }

    public interface NetworkChangeListener {
        void onConnected();
        void onDisconnected();
    }
}