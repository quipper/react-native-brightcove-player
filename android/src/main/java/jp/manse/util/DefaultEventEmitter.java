package jp.manse.util;

import com.brightcove.player.event.Event;
import com.brightcove.player.event.EventEmitter;
import com.brightcove.player.event.EventListener;

import java.util.Map;

public class DefaultEventEmitter implements EventEmitter {
    final public static EventEmitter sharedEventEmitter = new DefaultEventEmitter();

    @Override
    public int on(String s, EventListener eventListener) {
        return 0;
    }

    @Override
    public int once(String s, EventListener eventListener) {
        return 0;
    }

    @Override
    public void off() {

    }

    @Override
    public void off(String s, int i) {

    }

    @Override
    public void emit(String s) {

    }

    @Override
    public void emit(String s, Map<String, Object> map) {

    }

    @Override
    public void request(String s, EventListener eventListener) {

    }

    @Override
    public void request(String s, Map<String, Object> map, EventListener eventListener) {

    }

    @Override
    public void respond(Map<String, Object> map) {

    }

    @Override
    public void respond(Event event) {

    }

    @Override
    public void enable() {

    }

    @Override
    public void disable() {

    }
}
