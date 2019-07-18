import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Header } from 'react-navigation';
import { BCPlayer } from 'react-native-brightcove-player';

const ACCOUNT_ID = '1872491397001';
const POLICY_KEY = 'BCpkADawqM2kD-MtMQswS0cLWgf553m4yFUj8vRkvNVw6wybPb1CSVo3Y4mPyR7RQPv5zMoJbxYZpJMBeHhHJYFW4_FIfrvRvid1_xNlUCkCr8mdh35esbt0gJsqi-C_zIXH8xpXRIeiM_44';
const VIDEO_ID = '4089564165001';

const AppHeader = (headerProps) => <Header {... headerProps} />;

export default class Video extends Component {

	static navigationOptions = ({ navigation }) => {
		return {
			header: navigation.state.params ? navigation.state.params.header : AppHeader,
			headerTitle: 'Video',
			headerLeft: null,
			headerRight:
				<TouchableOpacity onPress={()=>{navigation.navigate('Article')}}>
					<Text style={styles.close}>X Close</Text>
				</TouchableOpacity>
		}
	};

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
					onFullScreen={isLandscape => {
						console.log('onFullScreen')
						isLandscape ? this.props.navigation.setParams({
							header: null
						}) : this.props.navigation.setParams({
							header: AppHeader
						})
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
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000000'
	},
	player: {
		width: '100%',
		aspectRatio: 16/9,
		backgroundColor: '#000000'
	},
	close: {
		paddingRight: 20
	}
});
