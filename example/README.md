# Brightcove Player for React Native

This repo contains examples of the different scenarios where Dream 11 intent to use the Brightcove Player for react native

The examples uses the open source library https://github.com/manse/react-native-brightcove-player as the player wrapper


# Install

```
$ yarn install
$ react-native link react-native-gesture-handler
$ cd ios
$ pod install
```

# Troubleshooting

## React Native Gesture (iOS)

```
null is not an object (evaluating '_RNGestureHandlerModule.default.Direction')
```

If that's the case, you might need to manually link the library:
https://facebook.github.io/react-native/docs/linking-libraries-ios

* open node_modules/react-native-gesture-handler/ios/
* finder will show up
* drag the dir RNGestureHandler.xcodeproj to Libraries in the top of Xcode
* select only reference and create group if the dialog shows up

[https://user-images.githubusercontent.com/10719495/50431747-6c24f980-0910-11e9-9b77-78b55b061735.png]

## React Native Orientation (iOS)

You might need to do the same process cited above for the orientation