import React, {Component} from 'react';
import {SafeAreaView, SectionList, StyleSheet, Text, View} from 'react-native';
import {Header} from 'react-navigation';
import {BCPlayer} from 'react-native-brightcove-player';

const ACCOUNT_ID = '1872491397001';
const POLICY_KEY = 'BCpkADawqM2kD-MtMQswS0cLWgf553m4yFUj8vRkvNVw6wybPb1CSVo3Y4mPyR7RQPv5zMoJbxYZpJMBeHhHJYFW4_FIfrvRvid1_xNlUCkCr8mdh35esbt0gJsqi-C_zIXH8xpXRIeiM_44';
const VIDEO_ID = '4089564165001';

const AppHeader = (headerProps) => <Header {...headerProps} />;

export default class NestedView extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: 'Nested View Example',
            header: navigation.state.params ? navigation.state.params.header : AppHeader
        }
    }

	state = {
		fullscreen: false
	}

    render() {
        return (
            <>
                <SafeAreaView/>
                <View style={[styles.videoContainer, this.state.fullscreen ? styles.videoFullscreen : null]}>
                    <BCPlayer
                        style={styles.player}
                        accountId={ACCOUNT_ID}
                        policyKey={POLICY_KEY}
                        videoId={VIDEO_ID}
                        play={true}
                        autoPlay={true}
                        fullscreen={false}
                        onFullScreen={isLandscape => {
                            isLandscape ? this.props.navigation.setParams({
                                header: null
                            }) : this.props.navigation.setParams({
                                header: AppHeader
                            })
                        }}
                    />
                </View>
                <SectionList
                    renderItem={({item, index, section}) => <Text key={index}>{item}</Text>}
                    renderSectionHeader={({section: {title}}) => (
                        <Text style={{fontWeight: 'bold'}}>{title}</Text>
                    )}
                    sections={[
                        {title: 'Title1', data: ['item1', 'item2']},
                        {title: 'Title2', data: ['item3', 'item4']},
                        {title: 'Title3', data: ['item5', 'item6']},
                        {title: 'Title1', data: ['item1', 'item2']},
                        {title: 'Title2', data: ['item3', 'item4']},
                        {title: 'Title3', data: ['item5', 'item6']},
                        {title: 'Title1', data: ['item1', 'item2']},
                        {title: 'Title2', data: ['item3', 'item4']},
                        {title: 'Title3', data: ['item5', 'item6']},
                        {title: 'Title1', data: ['item1', 'item2']},
                        {title: 'Title2', data: ['item3', 'item4']},
                        {title: 'Title3', data: ['item5', 'item6']},
                        {title: 'Title1', data: ['item1', 'item2']},
                        {title: 'Title2', data: ['item3', 'item4']},
                        {title: 'Title3', data: ['item5', 'item6']},
                        {title: 'Title1', data: ['item1', 'item2']},
                        {title: 'Title2', data: ['item3', 'item4']},
                        {title: 'Title3', data: ['item5', 'item6']},
                        {title: 'Title1', data: ['item1', 'item2']},
                        {title: 'Title2', data: ['item3', 'item4']},
                        {title: 'Title3', data: ['item5', 'item6']},
                        {title: 'Title1', data: ['item1', 'item2']},
                        {title: 'Title2', data: ['item3', 'item4']},
                        {title: 'Title3', data: ['item5', 'item6']},




                    ]}
                    keyExtractor={(item, index) => item + index}
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    scrollView: {
        backgroundColor: '#FFFFFF'
    },
    articleContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    image: {
        width: '100%',
        aspectRatio: 16 / 9,
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
        aspectRatio: 16 / 9,
        backgroundColor: '#000000'
    },
    videoContainer: {
        backgroundColor: '#000'
    },
    videoFullscreen: {
        position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		height: '100%',
		width: '100%',
		zIndex: 999
    },
});
