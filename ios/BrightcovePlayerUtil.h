#import <React/RCTBridgeModule.h>
#import <BrightcovePlayerSDK/BCOVPlaybackService.h>
#import <BrightcovePlayerSDK/BCOVOfflineVideoManager.h>
#import <BrightcovePlayerSDK/BCOVPlaybackServiceRequestFactory.h>

@interface BrightcovePlayerUtil : NSObject<RCTBridgeModule>
@property (nonatomic) BCOVPlaybackService *playbackService;
@end
