import Home from './components/Home';
import BrightcoveHeader from './components/video-header';
import BrightcoveScroll from './components/video-scroll';
import ArticleScreen from './components/article';
import VideoScreen from './components/video';
import { createStackNavigator, createAppContainer, getActiveChildNavigationOptions } from 'react-navigation';

const ArticleStack = createStackNavigator(
	{
		Article: {
			screen: ArticleScreen
		},
		Video: {
			screen: VideoScreen
		}
	},
	{
		mode: 'modal',
		headerMode: 'none',
		navigationOptions: ({ navigation, screenProps }) => {
			return {
				title: 'Article',
				...getActiveChildNavigationOptions(navigation, screenProps),
			}
		}
	}
);

const MainNavigator = createStackNavigator({
	Home: { screen: Home },
	BrightcoveHeader: { screen: BrightcoveHeader },
	BrightcoveScroll: { screen: BrightcoveScroll },
	ArticleStack: { screen: ArticleStack }
});

const App = createAppContainer(MainNavigator);

export default App;


