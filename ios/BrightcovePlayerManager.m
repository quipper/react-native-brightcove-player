#import "BrightcovePlayerManager.h"
#import "BrightcovePlayer.h"

@implementation BrightcovePlayerManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
    return [[BrightcovePlayer alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(policyKey, NSString);
RCT_EXPORT_VIEW_PROPERTY(accountId, NSString);
RCT_EXPORT_VIEW_PROPERTY(videoReferenceId, NSString);

@end
