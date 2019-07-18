import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Header } from 'react-navigation';
import {BCPlayer} from 'react-native-brightcove-player';

// Dream 11 Account
const ACCOUNT_ID = '6008340455001';
const POLICY_KEY = 'BCpkADawqM2HRDvtLxjif_KyjnhHtg7RS8advAhVCOHvDc2kHo9587NU_BE0VXSDoAaRCarG8hBlBqtrLvKXUh2SRVSAURawe8BPjFcVjCdfRgBqR6kdwzsf6LT0ojMErgEMKusg7um0tBFz';
const VIDEO_ID = '6058360435001';

const AppHeader = (headerProps) => <Header {... headerProps} />;

export default class VideoHeader extends Component {

	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: 'Live - DVR',
			header: navigation.state.params ? navigation.state.params.header : AppHeader
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<BCPlayer
					style={styles.player}
					accountId={ACCOUNT_ID}
					policyKey={POLICY_KEY}
					videoId={VIDEO_ID}
					play={true}
					autoPlay={true}
					fullscreen={false}
					playerType={"DVR"}
					onFullScreen={isLandscape => {
						isLandscape ? this.props.navigation.setParams({
							header: null
						}) : this.props.navigation.setParams({
							header: AppHeader
						})
					}}
					onEvent={(event) => {
						console.log(event);
					}}
					rotateToFullScreen
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	player: {
		width: '100%',
		aspectRatio: 16/9,
		backgroundColor: '#000000'
	}
});
