# React Native Brightcove Player

A React Native implementation of Brightcove Player SDK.

<img src="https://user-images.githubusercontent.com/443965/40413410-b9963158-5eb0-11e8-924f-9f61df58fa04.jpg" width="500">

## Installation

```console
yarn add git+https://git@github.com/manse/react-native-brightcove-player.git
react-native link
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

- Add following lines in `app/build.gradle`
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
                    videoReferenceId="3666678807001"
                    policyKey="BCpkADawqM1W-vUOMe6RSA3pA6Vw-VWUNn5rL0lzQabvrI63-VjS93gVUugDlmBpHIxP16X8TSe5LSKM415UHeMBmxl7pqcwVY_AZ4yKFwIpZPvXE34TpXEYYcmulxJQAOvHbv2dpfq-S_cm"
                />
            </View>
        );
    }
}
```

- Specifying `accountId`, `videoReferenceId` and `policyKey` will load the video.
- Size of the player must be non-zero.
- It may not work on Android simulator, in that case please run on device.
