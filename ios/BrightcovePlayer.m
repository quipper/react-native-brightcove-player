#import "BrightcovePlayer.h"

@interface BrightcovePlayer () <BCOVPlaybackControllerDelegate, BCOVPUIPlayerViewDelegate>

@end

@implementation BrightcovePlayer

BOOL _resizeAspectFill;

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        _resizeAspectFill = true;
        [self setup];
    }
    return self;
}

- (void)setup {
    _playbackController = [BCOVPlayerSDKManager.sharedManager createPlaybackController];
    _playbackController.delegate = self;
    _playbackController.autoPlay = YES;
    _playbackController.autoAdvance = YES;
    
    _playerView = [[BCOVPUIPlayerView alloc] initWithPlaybackController:self.playbackController options:nil controlsView:[BCOVPUIBasicControlView basicControlViewWithVODLayout] ];
    _playerView.delegate = self;
    _playerView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    _playerView.backgroundColor = UIColor.blackColor;
    
    [self addSubview:_playerView];
}

- (void)setupService {
    if (!_playbackService && _accountId && _policyKey) {
        _playbackService = [[BCOVPlaybackService alloc] initWithAccountId:_accountId policyKey:_policyKey];
    }
}

- (void)loadMovie {
    if (!_playbackService) return;
    if (_videoId) {
        [_playbackService findVideoWithVideoID:_videoId parameters:nil completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
            if (video) {
                [self.playbackController setVideos: @[ video ]];
            }  else {
                if (self.onStatusEvent) {
                    self.onStatusEvent(@{
                                         @"type": @("loadFail"),
                                         @"error": [NSString stringWithFormat:@"Could not find video with videoId: %@ with error: `%@`",  _videoId, error]
                                         });
                }
            }
        }];
    } else if (_referenceId) {
        [_playbackService findVideoWithReferenceID:_referenceId parameters:nil completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
            if (video) {
                [self.playbackController setVideos: @[ video ]];
            }  else {
                if (self.onStatusEvent) {
                    self.onStatusEvent(@{
                                         @"type": @("loadFail"),
                                         @"error": [NSString stringWithFormat:@"Could not find video with referenceId: %@ with error: `%@`",  _referenceId, error]
                                         });
                }
            }
        }];
    }
}

- (id<BCOVPlaybackController>)createPlaybackController {
    BCOVBasicSessionProviderOptions *options = [BCOVBasicSessionProviderOptions alloc];
    BCOVBasicSessionProvider *provider = [[BCOVPlayerSDKManager sharedManager] createBasicSessionProviderWithOptions:options];
    return [BCOVPlayerSDKManager.sharedManager createPlaybackControllerWithSessionProvider:provider viewStrategy:nil];
}

- (void)setResizeAspectFill:(BOOL)resizeAspectFill {
    _resizeAspectFill = resizeAspectFill;
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

- (void)setAccountId:(NSString *)accountId {
    _accountId = accountId;
    [self setupService];
    [self loadMovie];
}

- (void)setPolicyKey:(NSString *)policyKey {
    _policyKey = policyKey;
    [self setupService];
    [self loadMovie];
}

- (void)setAutoPlay:(BOOL)autoPlay {
    _playbackController.autoPlay = autoPlay;
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

- (void)setDisableDefaultControl:(BOOL)disable {
    _playerView.controlsView.hidden = disable;
}

- (void)seekTo:(NSNumber *)time {
    [_playbackController seekToTime:CMTimeMakeWithSeconds([time floatValue], NSEC_PER_SEC) completionHandler:^(BOOL finished) {
    }];
}

- (void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didPassCuePoints:(NSDictionary *)cuePointInfo{
      
    BCOVCuePointCollection *collection = cuePointInfo[kBCOVPlaybackSessionEventKeyCuePoints];
    
    for(BCOVCuePoint *point in collection){
        if (self.onCuePoint) {
            self.onCuePoint(@{
                                 @"type": [point type],
                                 @"id" :[point.properties valueForKey:@"id"] ? [point.properties valueForKey:@"id"] : nil,
                                 @"position" : @(CMTimeGetSeconds([point position])),
                                 @"name" : [point.properties valueForKey:@"name"] ? [point.properties valueForKey:@"name"] : nil,
                                 @"metadata" : [point.properties valueForKey:@"metadata"] ? [point.properties valueForKey:@"metadata"] : nil,
                                 @"forceStop" : [point.properties valueForKey:@"force_stop"] ? [point.properties valueForKey:@"force_stop"] : nil,
                                 });
        }
    }
}

- (void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didReceiveLifecycleEvent:(BCOVPlaybackSessionLifecycleEvent *)lifecycleEvent {

    if(_resizeAspectFill) {
        session.playerLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    }

    if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventReady) {
        if (self.onReady) {
            self.onReady(@{});
        }
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("ready")
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlay) {
        _playing = true;
        if (self.onPlay) {
            self.onPlay(@{});
        }
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("play")
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPause) {
        _playing = false;
        if (self.onPause) {
            self.onPause(@{});
        }
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("pause")
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventEnd) {
        if (self.onEnd) {
            self.onEnd(@{});
        }
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("end")
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventFail) {
        if (self.onStatusEvent) {
            
             NSString* error = nil;
            if ([lifecycleEvent.properties  valueForKey:kBCOVPlaybackSessionEventKeyError] != nil ) {
                error = [NSString stringWithFormat:@"`%@`",  lifecycleEvent.properties[kBCOVPlaybackSessionEventKeyError]];
            }
            
            self.onStatusEvent(@{
                                 @"type": @("fail"),
                                 @"error":  error ? error : [NSNull null]
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventFailedToPlayToEndTime) {
        if (self.onStatusEvent) {
             NSString* error = nil;
            if ([lifecycleEvent.properties  valueForKey:kBCOVPlaybackSessionEventKeyError] != nil ) {
                error = [NSString stringWithFormat:@"`%@`",  lifecycleEvent.properties[kBCOVPlaybackSessionEventKeyError]];
            }
            
            self.onStatusEvent(@{
                                 @"type": @("failedToPlayToEndTime"),
                                 @"error":  error ? error : [NSNull null]
                                 });
        }
    }  else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventResumeBegin) {
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("resumeBegin")
                                 });
        }
    }  else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventResumeComplete) {
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("resumeComplete")
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventResumeFail) {
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("resumeFail")
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackStalled) {
        // name non-standard to avoid conflict with RCTVideo event PlaybackStalled
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("playbackStalled")
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackRecovered) {
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("playbackRecovered")
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackBufferEmpty) {
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("playbackBufferEmpty")
                                 });
        }
    }  else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackLikelyToKeepUp) {
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("playbackLikelyToKeepUp")
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventTerminate) {
        if (self.onStatusEvent) {
            self.onStatusEvent(@{
                                 @"type": @("terminate")
                                 });
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventError) {
        if (self.onStatusEvent) {
            NSString* error = nil;
            if ([lifecycleEvent.properties  valueForKey:kBCOVPlaybackSessionEventKeyError] != nil ) {
                error = [NSString stringWithFormat:@"`%@`",  lifecycleEvent.properties[kBCOVPlaybackSessionEventKeyError]];
            }
            
            self.onStatusEvent(@{
                                 @"type": @("error"),
                                  @"error": error ? error : [NSNull null]
                                 });
        }
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
    if (self.onProgress && progress > 0 && progress != INFINITY) {
        self.onProgress(@{
                          @"currentTime": @(progress)
                          });
    }
    float bufferProgress = _playerView.controlsView.progressSlider.bufferProgress;
    if (_lastBufferProgress != bufferProgress) {
        _lastBufferProgress = bufferProgress;
        self.onUpdateBufferProgress(@{
                          @"bufferProgress": @(bufferProgress),
                          });
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

@end
