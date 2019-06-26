import Home from './components/Home';
import BrightcoveScroll from './components/video-scroll';
import BrightcoveHeader from './components/video-header';
import { createStackNavigator, createAppContainer } from 'react-navigation';

const MainNavigator = createStackNavigator({
	Home: { screen: Home },
	BrightcoveHeader: { screen: BrightcoveHeader },
	BrightcoveScroll: { screen: BrightcoveScroll }
});

const App = createAppContainer(MainNavigator);

export default App;


