#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <BrightcovePlayerSDK/BCOVPlaybackService.h>
#import <BrightcovePlayerSDK/BCOVOfflineVideoManager.h>
#import <BrightcovePlayerSDK/BCOVPlaybackServiceRequestFactory.h>

@interface BrightcovePlayerUtil : RCTEventEmitter<RCTBridgeModule, BCOVOfflineVideoManagerDelegate>
@property (nonatomic) BCOVPlaybackService *playbackService;
+(NSString*)didRemoveOfflineVideoTokenNotificationName;
+(NSString*)kDidRemoveOfflineVideoToken;
@end
