#import "BrightcovePlayerPosterManager.h"
#import "BrightcovePlayerPoster.h"
#import <React/RCTUIManager.h>

@implementation BrightcovePlayerPosterManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view {
    return [[BrightcovePlayerPoster alloc] init];
}

- (dispatch_queue_t)methodQueue {
    return _bridge.uiManager.methodQueue;
}

RCT_EXPORT_VIEW_PROPERTY(policyKey, NSString);
RCT_EXPORT_VIEW_PROPERTY(accountId, NSString);
RCT_EXPORT_VIEW_PROPERTY(videoId, NSString);
RCT_EXPORT_VIEW_PROPERTY(referenceId, NSString);
RCT_EXPORT_VIEW_PROPERTY(videoToken, NSString);
RCT_EXPORT_VIEW_PROPERTY(resizeMode, NSString);

@end
