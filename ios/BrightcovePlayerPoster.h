#import <UIKit/UIKit.h>
#import <BrightcovePlayerSDK/BCOVPlayerSDKManager.h>
#import <BrightcovePlayerSDK/BCOVPlaybackService.h>
#import <React/RCTBridge.h>
#import <React/UIView+React.h>

@interface BrightcovePlayerPoster : UIImageView

@property (nonatomic) BCOVPlaybackService *playbackService;
@property (nonatomic) BOOL playbackServiceDirty;

@property (nonatomic, copy) NSURLSession *session;
@property (nonatomic, copy) NSString *referenceId;
@property (nonatomic, copy) NSString *videoId;
@property (nonatomic, copy) NSString *videoToken;
@property (nonatomic, copy) NSString *accountId;
@property (nonatomic, copy) NSString *policyKey;

@end
