import React, { Component } from 'react';
import { StyleSheet, Dimensions, TouchableHighlight, Image, Text, ScrollView } from 'react-native';

import HTML from 'react-native-render-html';

const ACCOUNT_ID = '1872491397001';
const POLICY_KEY = 'BCpkADawqM2kD-MtMQswS0cLWgf553m4yFUj8vRkvNVw6wybPb1CSVo3Y4mPyR7RQPv5zMoJbxYZpJMBeHhHJYFW4_FIfrvRvid1_xNlUCkCr8mdh35esbt0gJsqi-C_zIXH8xpXRIeiM_44';
const VIDEO_ID = '4089564165001';

const htmlContent = `
	<img src="https://s.yimg.com/lo/api/res/1.2/wMZjvpod0eEfcJoYIau5rQ--/YXBwaWQ9YXBlY21lZGlhO3NtPTE7dz04MDA-/https://media-mbst-pub-ue1.s3.amazonaws.com/creatr-uploaded-images/2019-06/dfeb56b0-92e1-11e9-bffe-ae4f44a20cb5" />
	<h1 style="margin: 12px;">Island wants to become world’s first time-free zone</h1>
	<div style="font-size: 18px">
		<p style="margin: 12px;">Residents of a Norwegian island where the sun doesn't set for 69 days of the year want to go "time-free" and have more flexible school and working hours to make the most of their long summer days.</p>
		<p style="margin: 12px;">People on the island of Sommaroey are pushing to get rid of traditional business hours and "conventional time-keeping" during the midnight sun period that lasts from May 18 to July 26, resident Kjell Ove Hveding said on Wednesday.</p>
		<p style="margin: 12px;">Mr Hveding met with a Norwegian lawmaker this month to present a petition signed by dozens of islanders in support of declaring a "time-free zone", and to discuss any practical and legal obstacles to basically ignoring what clocks say about day and night.</p>
		<p style="margin: 12px;">"It's a bit crazy, but at the same it is pretty serious," he said.</p>
		<p style="margin: 12px;">Sommaroey, which lies north of the Arctic Circle, stays dark from November to January. The idea behind the time-free zone is that disregarding timepieces would make it easier for residents, especially students, employers and workers, to make the most of the precious months when the opposite is true.</p>
		<test videoId="${VIDEO_ID}" accountId="${ACCOUNT_ID}" thumbnail="https://bcsecure01-a.akamaihd.net/5/1872491397001/201906/689/1872491397001_6052783783001_4089564165001-vs.jpg?pubId=1872491397001&videoId=4089564165001"></test>
		<p style="margin: 12px;">Going off the clock "is a great solution but we likely won't become an entirely time-free zone as it will be too complex," Hveding said. "But we have put the time element on the agenda, and we might get more flexibility ... to adjust to the daylight."</p>
		<p style="margin: 12px;">"The idea is also to chill out. I have seen people suffering from stress because they were pressed by time," he said.</p>
		<img src="https://thumbs-prod.si-cdn.com/Vcpvjd2_enozl9LJsRfMINN0e2Y=/800x600/filters:no_upscale():focal(3251x1664:3252x1665)/https://public-media.si-cdn.com/filer/a7/15/a715942a-2893-427e-aaf5-89003e9d9af6/gettyimages-559296039.jpg" />
		<p style="margin: 12px;">Sitting west of Tromsoe, the island has a population of 350. Fishery and tourism are the main industries.</p>
		<p style="margin: 12px;">Finland last year lobbied for the abolition of European Union daylight savings time after a citizens' initiative collected more than 70,000 signatures.</p>
	</div>
`;


export default class VideoHTML extends Component {

	static navigationOptions = {
		headerTitle: 'Article'
	}

	constructor(props) {
		super(props);

		this.onThumbnailClick = this.onThumbnailClick.bind(this);
		this.videoRenderer = this.videoRenderer.bind(this);
	}

	onThumbnailClick() {
		this.props.navigation.navigate('Video');
		console.log('onThumbnailClick');
	}

	videoRenderer({ accountid, videoid, thumbnail }) {
		return (
			<TouchableHighlight key={Math.random()} onPress={ this.onThumbnailClick }>
				<Image
					style={styles.image}
					source={{uri: thumbnail}} />
			</TouchableHighlight>
		);
	}

	get renderers() {
		return {
			test: this.videoRenderer
		}
	}

	render() {

		return (
			<ScrollView style={styles.scrollView} contentContainerStyle={{flexGrow:1}}>
 				<HTML debug={true} html={htmlContent} renderers={this.renderers} imagesMaxWidth={Dimensions.get('window').width} />
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
	}
});
