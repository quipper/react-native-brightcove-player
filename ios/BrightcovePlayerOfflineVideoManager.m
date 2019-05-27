#import "BrightcovePlayerOfflineVideoManager.h"

static BOOL initialized = false;

@implementation BrightcovePlayerOfflineVideoManager

+ (BCOVOfflineVideoManager *)sharedManager {
    if (!initialized) {
        initialized = true;
        NSDictionary *options =
        @{
          kBCOVOfflineVideoManagerAllowsCellularDownloadKey: @(YES),
          kBCOVOfflineVideoManagerAllowsCellularPlaybackKey: @(YES),
          kBCOVOfflineVideoManagerAllowsCellularAnalyticsKey: @(YES)
          };
        [BCOVOfflineVideoManager initializeOfflineVideoManagerWithDelegate:nil options:options];
    }
    return BCOVOfflineVideoManager.sharedManager;
}

@end
