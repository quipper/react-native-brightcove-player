import React, {Component} from 'react'
import {
    Animated,
    AppState,
    AppStateStatus,
    BackHandler,
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet
} from 'react-native'
import BrightcovePlayer from './BrightcovePlayer'
import Orientation from 'react-native-orientation'
import withEvents from './Events'

// Wraps the Brightcove player with special Events
const BrightcovePlayerWithEvents = withEvents(BrightcovePlayer)

const Win = Dimensions.get('window')
const backgroundColor = '#000'

const styles = StyleSheet.create({
    background: {
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 98
    },
    fullScreen: {
        ...StyleSheet.absoluteFillObject
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        zIndex: 99
    }
})

class BCPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            paused: !props.autoPlay,
            fullScreen: false,
            inlineHeight: Win.width * 0.5625,
            percentageTracked: {Q1: false, Q2: false, Q3: false, Q4: false},
            mediainfo: null,
            onRotate: false,
            appState: AppState.currentState
        }
        this.animInline = new Animated.Value(Win.width * 0.5625)
        this.animFullscreen = new Animated.Value(Win.width * 0.5625)
        this.BackHandler = this.BackHandler.bind(this)
        this.orientationDidChange = this.orientationDidChange.bind(this)
        this._handleAppStateChange = this._handleAppStateChange.bind(this)
    }

    componentWillMount() {
        // The getOrientation method is async. It happens sometimes that
        // you need the orientation at the moment the JS runtime starts running on device.
        // `getInitialOrientation` returns directly because its a constant set at the
        // beginning of the JS runtime.
        // Remember to remove listener
        Orientation.removeOrientationListener(this.orientationDidChange)
    }

    componentDidMount() {
        Orientation.addOrientationListener(this.orientationDidChange)
        BackHandler.addEventListener('hardwareBackPress', this.BackHandler)
        AppState.addEventListener('change', this._handleAppStateChange)
    }

    _handleAppStateChange(nextAppState: AppStateStatus) {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active') {
            if (this.state.fullScreen) {
                this.player.setFullscreen(false)
            }
        }
        this.setState({appState: nextAppState})
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.BackHandler)
        Orientation.removeOrientationListener(this.orientationDidChange)
        AppState.removeEventListener('change', this._handleAppStateChange)
    }

    orientationDidChange(orientation) {
        if (this.props.rotateToFullScreen) {
            if (orientation === 'LANDSCAPE' && !this.state.fullScreen) {
                this.setState({onRotate: true}, () => {
                    this.player.setFullscreen && this.player.setFullscreen(true)
                })
                return
            }
            if (orientation === 'PORTRAIT' && this.state.fullScreen) {
                this.setState({onRotate: true}, () => {
                    this.player.setFullscreen && this.player.setFullscreen(false)
                })
                return
            }
        }
    }

    BackHandler() {
        if (this.state.fullScreen) {
            this.player.setFullscreen(false)
            return true
        }
        return false
    }

    toggleFS() {
        this.setState({fullScreen: !this.state.fullScreen}, () => {
            if (this.state.fullScreen) {
                const initialOrient = Orientation.getInitialOrientation()
                const height = this.state.onRotate ? Dimensions.get('window').height : Dimensions.get('window').width
                this.props.onFullScreen && this.props.onFullScreen(this.state.fullScreen)
                if (!this.state.onRotate) Orientation.lockToLandscape()
                this.animToFullscreen(height)
            } else {
                if (this.props.fullScreenOnly) {
                    this.setState({paused: true}, () => this.props.onPlay(!this.state.paused))
                }
                this.props.onFullScreen && this.props.onFullScreen(this.state.fullScreen)
                if (!this.state.onRotate) Orientation.lockToPortrait()
                this.animToInline()
                setTimeout(() => {
                    if (!this.props.lockPortraitOnFsExit) Orientation.unlockAllOrientations()
                }, 1500)
            }
            this.setState({onRotate: false})
        })
    }

    animToFullscreen(height) {
        Animated.parallel([
            Animated.timing(this.animFullscreen, {toValue: height, duration: 200}),
            Animated.timing(this.animInline, {toValue: height, duration: 200})
        ]).start()
    }

    animToInline(height) {
        const newHeight = height || this.state.inlineHeight
        Animated.parallel([
            Animated.timing(this.animFullscreen, {toValue: newHeight, duration: 100}),
            Animated.timing(this.animInline, {toValue: this.state.inlineHeight, duration: 100})
        ]).start()
    }

    render() {
        const {
            fullScreen
        } = this.state

        const {
            style
        } = this.props

        return (
            <Animated.View
                style={[
                    styles.background,
                    fullScreen ?
                        (styles.fullScreen, {height: this.animFullscreen})
                        : {height: this.animInline},
                    fullScreen ? null : style
                ]}
            >
                <StatusBar hidden={fullScreen}/>
                <BrightcovePlayerWithEvents
                    ref={(player) => this.player = player}
                    {...this.props}
                    style={[styles.player, this.props.style]}
                    playerId={this.props.playerId ? this.props.playerId : `com.brightcove/react-native/${Platform.OS}`}
                    onBeforeEnterFullscreen={this.toggleFS.bind(this)}
                    onBeforeExitFullscreen={this.toggleFS.bind(this)}
                    disableDefaultControl={this.props.disableControls}
                />
            </Animated.View>
        )
    }

}

BCPlayer.defaultProps = {
    placeholder: undefined,
    style: {},
    autoPlay: false,
    inlineOnly: false,
    fullScreenOnly: false,
    rotateToFullScreen: false,
    lockPortraitOnFsExit: false,
    disableControls: false
}


module.exports = BCPlayer
