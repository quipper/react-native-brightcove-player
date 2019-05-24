#import <React/RCTBridgeModule.h>
#import "BrightcovePlayerUtil.h"
#import "BrightcovePlayerOfflineVideoManager.h"

static BOOL sharedOfflineVideoManagerInitialized = false;

@implementation BrightcovePlayerUtil

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (void)setBridge:(RCTBridge *)bridge {
    _bridge = bridge;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(requestDownloadVideoWithReferenceId:(NSString *)referenceId accountId:(NSString *)accountId policyKey:(NSString *)policyKey bitRate:(nonnull NSNumber *)bitRate resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    BCOVPlaybackService* playbackService = [[BCOVPlaybackService alloc] initWithAccountId:accountId policyKey:policyKey];
    [playbackService findVideoWithReferenceID:referenceId parameters:nil completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
        if (error) {
            reject(@"error", error.description, error);
            return;
        }
        [[BrightcovePlayerOfflineVideoManager sharedManager] requestVideoDownload:video parameters:[self generateDownloadParameterWithBitRate:bitRate] completion:^(BCOVOfflineVideoToken offlineVideoToken, NSError *error) {
            if (error) {
                reject(@"error", error.description, error);
                return;
            }
            resolve(offlineVideoToken);
        }];
    }];
}

RCT_EXPORT_METHOD(requestDownloadVideoWithVideoId:(NSString *)videoId accountId:(NSString *)accountId policyKey:(NSString *)policyKey bitRate:(nonnull NSNumber *)bitRate resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    BCOVPlaybackService* playbackService = [[BCOVPlaybackService alloc] initWithAccountId:accountId policyKey:policyKey];
    [playbackService findVideoWithVideoID:videoId parameters:nil completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
        if (error) {
            reject(@"error", error.description, error);
            return;
        }
        [[BrightcovePlayerOfflineVideoManager sharedManager] requestVideoDownload:video parameters:[self generateDownloadParameterWithBitRate:bitRate] completion:^(BCOVOfflineVideoToken offlineVideoToken, NSError *error) {
            if (error) {
                reject(@"error", error.description, error);
                return;
            }
            resolve(offlineVideoToken);
        }];
    }];
}

RCT_EXPORT_METHOD(getOfflineVideoStatuses:(NSString *)accountId policyKey:(NSString *)policyKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([self collecteOfflineVideoStatuses]);
}

RCT_EXPORT_METHOD(deleteOfflineVideo:(NSString *)accountId policyKey:(NSString *)policyKey videoToken:(NSString *)videoToken resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[BrightcovePlayerOfflineVideoManager sharedManager] cancelVideoDownload:videoToken];
    [[BrightcovePlayerOfflineVideoManager sharedManager] deleteOfflineVideo:videoToken];
    resolve(nil);
}

- (NSArray *)collecteOfflineVideoStatuses {
    NSArray* statuses = [[BrightcovePlayerOfflineVideoManager sharedManager] offlineVideoStatus];
    NSMutableArray *results = [[NSMutableArray alloc] init];
    for (BCOVOfflineVideoStatus *status in statuses) {
        [results addObject:
         @{
           @"downloadProgress": @(status.downloadPercent / 100.0),
           @"videoToken": status.offlineVideoToken
           }];
    }
    return results;
}

- (NSDictionary *)generateDownloadParameterWithBitRate:(NSNumber*)bitRate {
    return
    @{
      kBCOVOfflineVideoManagerRequestedBitrateKey: bitRate
      };
}

@end
