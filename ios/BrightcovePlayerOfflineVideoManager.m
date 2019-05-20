#import "BrightcovePlayerOfflineVideoManager.h"

static BOOL initialized = false;

@implementation BrightcovePlayerOfflineVideoManager

+ (BCOVOfflineVideoManager *)sharedManager {
    if (!initialized) {
        initialized = true;
        NSDictionary *options =
        @{
          kBCOVOfflineVideoManagerAllowsCellularDownloadKey: @(NO),
          kBCOVOfflineVideoManagerAllowsCellularPlaybackKey: @(NO),
          kBCOVOfflineVideoManagerAllowsCellularAnalyticsKey: @(NO)
          };
        [BCOVOfflineVideoManager initializeOfflineVideoManagerWithDelegate:nil options:options];
    }
    return BCOVOfflineVideoManager.sharedManager;
}

@end
