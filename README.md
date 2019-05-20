# React Native Brightcove Player

A React Native implementation of Brightcove Player SDK.

<img src="https://user-images.githubusercontent.com/443965/40413410-b9963158-5eb0-11e8-924f-9f61df58fa04.jpg" width="500">

## Supported Version

- iOS 10 >=
- Android 5.0 >=

## Installation

```console
yarn add react-native-brightcove-player
react-native link react-native-brightcove-player
```

- Add `resolver` entry into `metro.config.js` or `rn-cli.config.js`
  - See example app for more details
  - note: It is [workaround](https://github.com/facebook/react-native/issues/21242#issuecomment-445784118), so you should remove when it's no longer needed

```js
const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  resolver: {
    blacklistRE: blacklist([/node_modules\/.*\/node_modules\/react-native\/.*/])
  }
};
```

### iOS

- Make `Podfile` like below and `pod install`

```rb
source 'https://github.com/brightcove/BrightcoveSpecs.git'

platform :ios, '10.0'
use_frameworks!

target 'example' do
    pod 'Brightcove-Player-Core'
end
```

### Android

- Add following lines in `android/app/build.gradle`

```gradle
allprojects {
  repositories {
      maven {
          url 'http://repo.brightcove.com/releases'
      }
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
- It may not work on Android simulator, in that case please run on device.
- For a more detailed example, please see [example/App.js](https://github.com/manse/react-native-brightcove-player/blob/master/example/App.js).

| Prop                   | Type     | Description                                                                         | Event Object                 |
| ---------------------- | -------- | ----------------------------------------------------------------------------------- | ---------------------------- |
| accountId              | string   | Brightcove AccountId. Required                                                      |                              |
| policyKey              | string   | Brightcove PolicyKey. Required                                                      |                              |
| videoId                | string   | Brightcove VideoId. \*Either `videoId` or `referenceId` is required                 |                              |
| referenceId            | string   | Brightcove ReferenceId. \*Either `videoId` or `referenceId` is required             |                              |
| autoPlay               | boolean  | Set `true` to play automatically                                                    |                              |
| play                   | boolean  | Control playback and pause                                                          |                              |
| fullscreen             | boolean  | Control full screen state                                                           |                              |
| volume                 | number   | Set audio volume (`0.0 ~ 1.0`)                                                      |                              |
| bitRate                | number   | Set maximum buffering bitrate. Set `0` to automatic quality                         |                              |
| playbackRate           | number   | Set playback speed scale. Default is `1`                                            |                              |
| disableDefaultControl  | boolean  | Disable default player control. Set `true` when you implement own video controller. |                              |
| onReady                | Function | Indicates the video can be played back                                              |                              |
| onPlay                 | Function | Indicates the video playback starts                                                 |                              |
| onPause                | Function | Indicates the video is paused                                                       |                              |
| onEnd                  | Function | Indicates the video is played to the end                                            |                              |
| onProgress             | Function | Indicates the playback head of the video advances.                                  | `{ currentTime: number }`    |
| onChangeDuration       | Function | Indicates the video length is changed                                               | `{ duration: number }`       |
| onUpdateBufferProgress | Function | Indicates the video loading buffer is updated                                       | `{ bufferProgress: number }` |
| onEnterFullscreen      | Function | Indicates the player enters full screen                                             |                              |
| onExitFullscreen       | Function | Indicates the player exit full screen                                               |                              |

| Method                                | Description                       |
| ------------------------------------- | --------------------------------- |
| seekTo(timeInSeconds: number) => void | Change playhead to arbitrary time |

## License

MIT
