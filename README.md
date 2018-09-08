# React Native Brightcove Player

A React Native implementation of Brightcove Player SDK.

<img src="https://user-images.githubusercontent.com/443965/40413410-b9963158-5eb0-11e8-924f-9f61df58fa04.jpg" width="500">

## Installation

```console
yarn add react-native-brightcove-player
react-native link react-native-brightcove-player
```

### iOS

- Make `Podfile` like below and `pod install`

```rb
source 'https://github.com/brightcove/BrightcoveSpecs.git'

platform :ios, '8.0'
use_frameworks!

target 'Your-Project-Name' do
    pod 'Brightcove-Player-Core'
end
```

### Android

- Add following lines in `android/app/build.gradle`

```gradle
repositories {
    maven {
        url 'http://repo.brightcove.com/releases'
    }
}
```

## Usage

```jsx
import { BrightcovePlayer } from 'react-native-brightcove-player';

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BrightcovePlayer
          style={styles.player}
          accountId="3636334163001"
          videoId="3666678807001"
          policyKey="BCpkADawqM1W-vUOMe6RSA3pA6Vw-VWUNn5rL0lzQabvrI63-VjS93gVUugDlmBpHIxP16X8TSe5LSKM415UHeMBmxl7pqcwVY_AZ4yKFwIpZPvXE34TpXEYYcmulxJQAOvHbv2dpfq-S_cm"
        />
      </View>
    );
  }
}
```

- Specifying `accountId`, `policyKey`, and `videoId` or `referenceId` will load the video.
- Size of the player must be non-zero.
- It may not work on Android simulator, in that case please run on device.
- For a more detailed example, please see [example/App.js](https://github.com/manse/react-native-brightcove-player/blob/master/example/App.js).

| Prop                   | Type     | Default | iOS | Android |  Description                                                        | Event Object                 |
| ---------------------- | -------- | - |- | - | ---------------------------------------------------------------------------- | ---------------------------- |
| accountId              | string   |   | ✅ | ✅ | Brightcove AccountId                                                            |                              |
| policyKey              | string   |   | ✅ | ✅ | Brightcove PolicyKey                                                            |                              |
| videoId                | string   |   | ✅ | ✅ | Brightcove VideoId. \*Either videoId or referenceId is required                 |                              |
| referenceId            | string   |   | ✅ | ✅ | Brightcove ReferenceId. \*Either videoId or referenceId is required             |                              |
| autoPlay               | boolean  |   | ✅ | ✅ | Whether to play automatically when video loaded                                 |                              |
| play                   | boolean  |   | ✅ | ✅ | Control playback and pause                                                      |                              |
| fullscreen             | boolean  |   | ✅ | ✅ | Control full screen state                                                       |                              |
| disableDefaultControl  | boolean  |   | ✅ | ✅ | Disable default player control. Set true if you implement own video controller. |                              |
| onReady                | Function |   | ✅ | ✅ | Indicates the video can be played back                                          |                              |
| onPlay                 | Function |   | ✅ | ✅ | Indicates the video playback starts                                             |                              |
| onPause                | Function |   | ✅ | ✅ | Indicates the video is paused                                                   |                              |
| onEnd                  | Function |   | ✅ | ✅ | Indicates the video is played to the end                                        |                              |
| onProgress             | Function |   | ✅ | ✅ | Indicates the playback head of the video advances.                              | `{ currentTime: number }`    |
| onChangeDuration       | Function |   | ✅ | ✅ | Indicates the video length is changed                                           | `{ duration: number }`       |
| onUpdateBufferProgress | Function |   | ✅ | ✅ | Indicates the video loading buffer is updated                                   | `{ bufferProgress: number }` |
| onEnterFullscreen      | Function |   | ✅ | ✅ | Indicates the player enters full screen                                         |                              |
| onExitFullscreen       | Function |   | ✅ | ✅ | Indicates the player exit full screen                                           |                              |
| resizeAspectFill       | boolean  | true  | ✅ | ❌ | Specifies that the player should preserve the video’s aspect ratio and fill the layer’s bounds. See: [AVFoundation > AVPlayerLayer > videoGravity ](https://developer.apple.com/documentation/avfoundation/avplayerlayer/1388915-videogravity?language=objc) | |
| onStatusEvent          | Function |   | ✅ | ✅ | Indicates playback status event has fired                                      | `{ info: string, error?: string }` |

| Method                                | Description                       |
| ------------------------------------- | --------------------------------- |
| seekTo(timeInSeconds: number) => void | Change playhead to arbitrary time |
