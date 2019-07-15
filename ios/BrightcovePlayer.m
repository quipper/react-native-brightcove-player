#import "BrightcovePlayer.h"
#import "BrightcovePlayerOfflineVideoManager.h"

@interface BrightcovePlayer () <BCOVPlaybackControllerDelegate, BCOVPUIPlayerViewDelegate>


@end

@implementation BrightcovePlayer

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self setup];
    }
    return self;
}

- (void)setup {
    _playbackController = [BCOVPlayerSDKManager.sharedManager createPlaybackController];
    _playbackController.delegate = self;
    _playbackController.autoPlay = NO;
    _playbackController.autoAdvance = YES;
    [_playbackController setAllowsExternalPlayback:YES];

    BCOVPUIPlayerViewOptions *options = [[BCOVPUIPlayerViewOptions alloc] init];
    options.presentingViewController = self;

    _playerView = [[BCOVPUIPlayerView alloc] initWithPlaybackController:self.playbackController options:options controlsView:[BCOVPUIBasicControlView basicControlViewWithVODLayout] ];
    _playerView.delegate = self;
    _playerView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    _playerView.backgroundColor = UIColor.blackColor;

    // Hide the controls until it defines which controls to use based on the READY state
    _playerView.controlsView.hidden = true;

    _targetVolume = 1.0;
    _autoPlay = NO;

    [self addSubview:_playerView];
}

- (void)setupService {
    if ((!_playbackService || _playbackServiceDirty) && _accountId && _policyKey) {
        _playbackServiceDirty = NO;
        _playbackService = [[BCOVPlaybackService alloc] initWithAccountId:_accountId policyKey:_policyKey];
    }
}

- (void)loadMovie {
    if (_videoToken) {
        BCOVVideo *video = [[BrightcovePlayerOfflineVideoManager sharedManager] videoObjectFromOfflineVideoToken:_videoToken];
        if (video) {
            [self.playbackController setVideos: @[ video ]];
        }
        return;
    }

    if (!_playbackService) return;

    if (_videoId) {
        [_playbackService findVideoWithVideoID:_videoId parameters:nil completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
            if (video) {
                _mediaInfo = jsonResponse;
                [self.playbackController setVideos: @[ video ]];
            } else {
                [self emitError:error];
            }
        }];
    } else if (_referenceId) {
        [_playbackService findVideoWithReferenceID:_referenceId parameters:nil completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
            if (video) {
                _mediaInfo = jsonResponse;
                [self.playbackController setVideos: @[ video ]];
            } else {
                [self emitError:error];
            }
        }];
    }
}

- (id<BCOVPlaybackController>)createPlaybackController {
    BCOVBasicSessionProviderOptions *options = [BCOVBasicSessionProviderOptions alloc];
    BCOVBasicSessionProvider *provider = [[BCOVPlayerSDKManager sharedManager] createBasicSessionProviderWithOptions:options];
    return [BCOVPlayerSDKManager.sharedManager createPlaybackControllerWithSessionProvider:provider viewStrategy:nil];
}

- (void)setReferenceId:(NSString *)referenceId {
    _referenceId = referenceId;
    _videoId = NULL;
    [self setupService];
    [self loadMovie];
}

- (void)setVideoId:(NSString *)videoId {
    _videoId = videoId;
    _referenceId = NULL;
    [self setupService];
    [self loadMovie];
}

- (void)setVideoToken:(NSString *)videoToken {
    _videoToken = videoToken;
    [self loadMovie];
}

- (void)setAccountId:(NSString *)accountId {
    _accountId = accountId;
    _playbackServiceDirty = YES;
    _playbackController.analytics.account = accountId;
    [self setupService];
    [self loadMovie];
}

- (void)setPlayerId:(NSString *)playerId {
    _playbackController.analytics.destination = [NSString stringWithFormat: @"bcsdk://%@", playerId];
    [self setupService];
    [self loadMovie];
}


- (void)setIsLive:(NSString *)isLive {
    _isLive = isLive;
}

- (void)setPolicyKey:(NSString *)policyKey {
    _policyKey = policyKey;
    _playbackServiceDirty = YES;
    [self setupService];
    [self loadMovie];
}

- (void)setAutoPlay:(BOOL)autoPlay {
    _autoPlay = autoPlay;
}

- (void)setPlay:(BOOL)play {
    if (_playing == play) return;
    if (play) {
        [_playbackController play];
    } else {
        [_playbackController pause];
    }
}

- (void)setFullscreen:(BOOL)fullscreen {
    if (fullscreen) {
        [_playerView performScreenTransitionWithScreenMode:BCOVPUIScreenModeFull];
    } else {
        [_playerView performScreenTransitionWithScreenMode:BCOVPUIScreenModeNormal];
    }
}

- (void)setVolume:(NSNumber*)volume {
    _targetVolume = volume.doubleValue;
    [self refreshVolume];
}

- (void)setBitRate:(NSNumber*)bitRate {
    _targetBitRate = bitRate.doubleValue;
    [self refreshBitRate];
}

- (void)setPlaybackRate:(NSNumber*)playbackRate {
    _targetPlaybackRate = playbackRate.doubleValue;
    if (_playing) {
        [self refreshPlaybackRate];
    }
}

- (void)refreshVolume {
    if (!_playbackSession) return;
    _playbackSession.player.volume = _targetVolume;
}

- (void)refreshBitRate {
    if (!_playbackSession) return;
    AVPlayerItem *item = _playbackSession.player.currentItem;
    if (!item) return;
    item.preferredPeakBitRate = _targetBitRate;
}

- (void)refreshPlaybackRate {
    if (!_playbackSession || !_targetPlaybackRate) return;
    _playbackSession.player.rate = _targetPlaybackRate;
}

- (void)setDisableDefaultControl:(BOOL)disable {
    _disableDefaultControl = disable;
    _playerView.controlsView.hidden = disable;
}

- (void)seekTo:(NSNumber *)time {
    [_playbackController seekToTime:CMTimeMakeWithSeconds([time floatValue], NSEC_PER_SEC) completionHandler:^(BOOL finished) {
    }];
}

- (void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didReceiveLifecycleEvent:(BCOVPlaybackSessionLifecycleEvent *)lifecycleEvent {
    if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventReady) {

        if ([_isLive isEqualToString:@"true"]) {
            _playerView.controlsView.layout = [BCOVPUIControlLayout basicLiveControlLayout];
        } else if ([[_isLive uppercaseString] isEqualToString:@"DVR"]) {
            _playerView.controlsView.layout = [BCOVPUIControlLayout basicLiveDVRControlLayout];
        } else {
            _playerView.controlsView.layout = [BCOVPUIControlLayout basicVODControlLayout];
        }
        // Once the controls are set to the layout, define the controls to the state sent to the player
        _playerView.controlsView.hidden = _disableDefaultControl;

        _playbackSession = session;
        [self refreshVolume];
        [self refreshBitRate];

        if (self.onReady) {
            self.onReady(@{});
        }

        if (self.onMetadataLoaded) {
            NSDictionary *mediainfo = @{ @"title" : _mediaInfo[@"name"]};
            self.onMetadataLoaded(@{
                @"mediainfo": mediainfo
            });
        }
        if (_autoPlay) {
            [_playbackController play];
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlay) {
        _playing = true;
        [self refreshPlaybackRate];
        if (self.onPlay) {
            self.onPlay(@{});
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPause) {
        _playing = false;
        if (self.onPause) {
            self.onPause(@{});
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventEnd) {
        if (self.onEnd) {
            self.onEnd(@{});
        }
    /**
     * The playback buffer is empty. This will occur when the video initially loads,
     * after a seek occurs, and when playback stops because of a slow or disabled
     * network. When the buffer is full enough to start playback again,
     * kBCOVPlaybackSessionLifecycleEventPlaybackLikelyToKeepUp will be sent.
     * or
      * Playback of the video has stalled. When the video recovers,
     * kBCOVPlaybackSessionLifecycleEventPlaybackRecovered will be sent.
     */
     } else if ((lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackBufferEmpty) || (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackStalled)) {
        if (self.onBufferingStarted) {
            self.onBufferingStarted(@{});
        }
    /**
     * After becoming empty, this event is sent when the playback buffer has filled
     * enough that it should be able to keep up with playback. This event will come after
     * kBCOVPlaybackSessionLifecycleEventPlaybackBufferEmpty.
     * or
     * Playback has recovered after being stalled.
     */
     } else if ((lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackLikelyToKeepUp) || (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackRecovered)) {
        if (self.onBufferingCompleted) {
            self.onBufferingCompleted(@{});
        }
    /**
     * A generic error has occurred.
     */
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventError) {
        NSError *error = lifecycleEvent.properties[@"error"];
        NSLog(@"Lifecycle Event Fail error: %@", error);
        [self emitError:error];
    /**
     * The video failed to load.
     */
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventFail) {
        NSError *error = lifecycleEvent.properties[@"error"];
        NSLog(@"Lifecycle Event Fail error: %@", error);
        [self emitError:error];
    /**
     * The video failed during playback and was unable to recover, possibly due to a
     * network error.
     */
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventFailedToPlayToEndTime) {
        NSError *error = lifecycleEvent.properties[@"error"];
        NSLog(@"Lifecycle Event Fail error: %@", error);
        [self emitError:error];
    }

}

- (void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didChangeDuration:(NSTimeInterval)duration {
    if (self.onChangeDuration) {
        self.onChangeDuration(@{
                                @"duration": @(duration)
                                });
    }
}

-(void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didProgressTo:(NSTimeInterval)progress {
    NSTimeInterval duration = CMTimeGetSeconds(session.player.currentItem.duration);
    if (self.onProgress && progress > 0 && progress != INFINITY) {
        self.onProgress(@{
                          @"currentTime": @(progress),
                          @"duration": @(!isnan(duration) ? duration : -1)
                          });
    }
    float bufferProgress = _playerView.controlsView.progressSlider.bufferProgress;
    if (_lastBufferProgress != bufferProgress) {
        _lastBufferProgress = bufferProgress;
        self.onUpdateBufferProgress(@{
                                      @"bufferProgress": @(bufferProgress),
                                      @"duration": @(!isnan(duration) ? duration : -1)
                                      });
    }
}

-(void)playerView:(BCOVPUIPlayerView *)playerView willTransitionToScreenMode:(BCOVPUIScreenMode)screenMode {
    if (screenMode == BCOVPUIScreenModeNormal) {
        if (self.onBeforeExitFullscreen) {
            self.onBeforeExitFullscreen(@{});
        }
    } else if (screenMode == BCOVPUIScreenModeFull) {
        if (self.onBeforeEnterFullscreen) {
            self.onBeforeEnterFullscreen(@{});
        }
    }
}

-(void)playerView:(BCOVPUIPlayerView *)playerView didTransitionToScreenMode:(BCOVPUIScreenMode)screenMode {
    if (screenMode == BCOVPUIScreenModeNormal) {
        if (self.onExitFullscreen) {
            self.onExitFullscreen(@{});
        }
    } else if (screenMode == BCOVPUIScreenModeFull) {
        if (self.onEnterFullscreen) {
            self.onEnterFullscreen(@{});
        }
    }
}

-(void)dispose {
    [self.playbackController setVideos:@[]];
}

- (void)emitError:(NSError *)error {

    if (!self.onError) {
        return;
    }

    NSString *code = [NSString stringWithFormat:@"%ld", (long)[error code]];

    self.onError(@{@"error_code": code, @"message": [error localizedDescription]});
}

@end
