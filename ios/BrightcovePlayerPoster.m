#import "BrightcovePlayerPoster.h"
#import "BrightcovePlayerOfflineVideoManager.h"

@interface BrightcovePlayerPoster ()
@end

@implementation BrightcovePlayerPoster

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.contentMode = UIViewContentModeScaleAspectFill;
        self.clipsToBounds = YES;
    }
    return self;
}

- (void)setReferenceId:(NSString *)referenceId {
    _referenceId = referenceId;
    _videoId = NULL;
    [self setupService];
    [self loadPoster];
}

- (void)setVideoId:(NSString *)videoId {
    _videoId = videoId;
    _referenceId = NULL;
    [self setupService];
    [self loadPoster];
}

- (void)setVideoToken:(NSString *)videoToken {
    _videoToken = videoToken;
    [self loadPoster];
}

- (void)setAccountId:(NSString *)accountId {
    _accountId = accountId;
    _playbackServiceDirty = YES;
    [self setupService];
    [self loadPoster];
}

- (void)setPolicyKey:(NSString *)policyKey {
    _policyKey = policyKey;
    _playbackServiceDirty = YES;
    [self setupService];
    [self loadPoster];
}

- (void)setResizeMode:(NSString *)resizeMode {
    if ([resizeMode isEqualToString:@"contain"]) {
        self.contentMode = UIViewContentModeScaleAspectFit;
    } else if ([resizeMode isEqualToString:@"fit"]) {
        self.contentMode = UIViewContentModeScaleToFill;
    } else {
        self.contentMode = UIViewContentModeScaleAspectFill;
    }
}

- (void)setupService {
    if ((!_playbackService || _playbackServiceDirty) && _accountId && _policyKey) {
        _playbackServiceDirty = NO;
        _playbackService = [[BCOVPlaybackService alloc] initWithAccountId:_accountId policyKey:_policyKey];
    }
}

- (void)loadPoster {
    if (_videoToken) {
        BCOVVideo *video = [[BrightcovePlayerOfflineVideoManager sharedManager] videoObjectFromOfflineVideoToken:_videoToken];
        if (video) {
            self.image = [UIImage imageWithContentsOfFile:video.properties[kBCOVOfflineVideoPosterFilePathPropertyKey]];
        }
        return;
    }
    if (!_playbackService) return;
    if (_videoId) {
        [_playbackService findVideoWithVideoID:_videoId parameters:nil completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
            if (video) {
                [self loadImage:video.properties[kBCOVVideoPropertyKeyPoster]];
            }
        }];
    } else if (_referenceId) {
        [_playbackService findVideoWithReferenceID:_referenceId parameters:nil completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
            if (video) {
                [self loadImage:video.properties[kBCOVVideoPropertyKeyPoster]];
            }
        }];
    }
}

-(void)loadImage:(NSString *)url{
    if (_session) {
        [_session invalidateAndCancel];
    }
    if (!url) return;
    _session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]
                                             delegate:nil
                                        delegateQueue:[NSOperationQueue mainQueue]];
    NSURLSessionTask *task = [_session dataTaskWithURL:[NSURL URLWithString:url] completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (error || !data) {
            return;
        }
        self.image = [UIImage imageWithData:data];
    }];
    [task resume];
}

@end
