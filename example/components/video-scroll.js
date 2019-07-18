import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import { BCPlayer, ScrollView } from 'react-native-brightcove-player';

const ACCOUNT_ID = '1872491397001';
const POLICY_KEY = 'BCpkADawqM2kD-MtMQswS0cLWgf553m4yFUj8vRkvNVw6wybPb1CSVo3Y4mPyR7RQPv5zMoJbxYZpJMBeHhHJYFW4_FIfrvRvid1_xNlUCkCr8mdh35esbt0gJsqi-C_zIXH8xpXRIeiM_44';
const VIDEO_ID = '4089564165001';

export default class VideoScroll extends Component {

	static navigationOptions = {
		header: null
	}

	render() {

		return (
			<ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>

				<BCPlayer
					accountId={ACCOUNT_ID}
					policyKey={POLICY_KEY}
					videoId={VIDEO_ID}
					play={true}
					fullscreen={false}
					autoPlay={false}
					style={styles.player}
					rotateToFullScreen
				/>

				<View style={styles.articleContainer}>
					<Text style={styles.h1}>Island wants to become world’s first time-free zone</Text>

					<Text style={styles.text}>Residents of a Norwegian island where the sun doesn't set for 69 days of the year want to go "time-free" and have more flexible school and working hours to make the most of their long summer days.</Text>

					<Text style={styles.text}>People on the island of Sommaroey are pushing to get rid of traditional business hours and "conventional time-keeping" during the midnight sun period that lasts from May 18 to July 26, resident Kjell Ove Hveding said on Wednesday.</Text>

					<Text style={styles.text}>Mr Hveding met with a Norwegian lawmaker this month to present a petition signed by dozens of islanders in support of declaring a "time-free zone", and to discuss any practical and legal obstacles to basically ignoring what clocks say about day and night.</Text>

					<Text style={styles.text}>"It's a bit crazy, but at the same it is pretty serious," he said.</Text>


					<Image
						source={{uri: 'https://s.yimg.com/lo/api/res/1.2/wMZjvpod0eEfcJoYIau5rQ--/YXBwaWQ9YXBlY21lZGlhO3NtPTE7dz04MDA-/https://media-mbst-pub-ue1.s3.amazonaws.com/creatr-uploaded-images/2019-06/dfeb56b0-92e1-11e9-bffe-ae4f44a20cb5'}}
						style={styles.image}
					/>
					<Text style={styles.text}>Sommaroey, which lies north of the Arctic Circle, stays dark from November to January. The idea behind the time-free zone is that disregarding timepieces would make it easier for residents, especially students, employers and workers, to make the most of the precious months when the opposite is true.</Text>

					<Text style={styles.text}>Going off the clock "is a great solution but we likely won't become an entirely time-free zone as it will be too complex," Hveding said. "But we have put the time element on the agenda, and we might get more flexibility ... to adjust to the daylight."</Text>

					<Text style={styles.text}>"The idea is also to chill out. I have seen people suffering from stress because they were pressed by time," he said.</Text>

					<Image
						source={{uri: 'https://thumbs-prod.si-cdn.com/Vcpvjd2_enozl9LJsRfMINN0e2Y=/800x600/filters:no_upscale():focal(3251x1664:3252x1665)/https://public-media.si-cdn.com/filer/a7/15/a715942a-2893-427e-aaf5-89003e9d9af6/gettyimages-559296039.jpg'}}
						style={styles.image}
					/>

					<Text style={styles.text}>Sitting west of Tromsoe, the island has a population of 350. Fishery and tourism are the main industries.</Text>

					<Text style={styles.text}>Finland last year lobbied for the abolition of European Union daylight savings time after a citizens' initiative collected more than 70,000 signatures.</Text>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: '#FFFFFF'
	},
	articleContainer: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	image: {
		width: '100%',
		aspectRatio: 16/9,
	},
	h1: {
		fontWeight: 'bold',
		fontSize: 25,
		margin: 10
	},
	text: {
		margin: 10,
		fontSize: 18
	},
	player: {
		width: '100%',
		aspectRatio: 16/9,
		backgroundColor: '#000000'
	}
});
