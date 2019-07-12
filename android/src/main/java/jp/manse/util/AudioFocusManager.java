package jp.manse.util;

import android.content.Context;
import android.media.AudioManager;
import android.support.annotation.NonNull;

public class AudioFocusManager {

    AudioManager audioManager;
    // The AudioFocusChangeListerner that will be associated with audioManager focus request
    AudioManager.OnAudioFocusChangeListener onAudioFocusChangeListener;
    boolean mHaveAudioFocus = false;
    // The external listener of the changes (player)
    AudioFocusChangedListener listener;

    public AudioFocusManager(@NonNull Context context) {
        audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        onAudioFocusChangeListener = new AudioManager.OnAudioFocusChangeListener() {
            @Override
            public void onAudioFocusChange(int focusChange) {
                mHaveAudioFocus = focusChange > 0;
                onAudioStateChanged();
            }
        };

    }

    public void registerListener(AudioFocusChangedListener listener) {
        this.listener = listener;
    }

    public void unregisterListener() {
        this.listener = null;
    }

    public void requestFocus() {
        // If it already has focus then return, otherwise, request the focus with the onAudioFocusChangeListener
        if (mHaveAudioFocus) {
            return;
        }
        audioManager.requestAudioFocus(onAudioFocusChangeListener, AudioManager.STREAM_MUSIC,
                AudioManager.AUDIOFOCUS_GAIN);
    }

    public void abandonFocus() {
        if (mHaveAudioFocus) {
            audioManager.abandonAudioFocus(onAudioFocusChangeListener);
        }
    }

    private void onAudioStateChanged() {
        // Inform the AudioFocusChangedListener (the player) of the focus change
        if (this.listener != null) {
            this.listener.audioFocusChanged(mHaveAudioFocus);
        }
    }

    public interface AudioFocusChangedListener {
        void audioFocusChanged(boolean hasFocus);
    }
}
