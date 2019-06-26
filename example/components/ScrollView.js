import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView as RNScrollView } from 'react-native';

class ScrollView extends Component {

	constructor(props) {
		super(props);

		// This variable will hold the current position of the scroll view
		this.scrollPos = 0;

		// The state of
		this.state = {
			fullscreen: false,
			key: 0
		}
	}

	/**
	 * Method that controls the state of the fullscreen inside the ScrollView and when exited from it
	 * return the scrollview to the position before going to fullscreen
	 * @param {Boolean} fullscreen - if it entered or exited from fullscreen
	 * @param {Number} key - the index of the element
	 */
	onFullScreenChange(fullscreen, key) {
		this.setState({ fullscreen, key }, () => {
			if (!fullscreen) {
				setTimeout(this.scrollBackToPosition.bind(this), 0);
			}
		});
	}

	/**
	 * Scroll the Scrollview container back to its previous position
	 */
	scrollBackToPosition() {
		if (this.scroll) {
			this.scroll.scrollTo({ y: this.scrollPos, animated: false });
		}
	}

	/**
	 * Clone the Brightcove player and rewrite the onEnterFullscreen and onExitFullscreen properties
	 * and add the onFullScreenChange method to control the state inside the ScrollView
	 * @param {*} component - The brightcove component
	 * @param {*} key
	 */
	cloneBrightcovePlayer(component, key) {
		if (this.state.fullscreen && key !== this.state.key) {
			return null;
		}

		// Clone the component and replace the new properties
		return React.cloneElement(component, {
			onEnterFullscreen: (event) => {
				console.log('Enter full screen');
				component.props.onEnterFullscreen && component.props.onEnterFullscreen(event);
				this.onFullScreenChange(true, key);
			},
			onExitFullscreen: (event) => {
				console.log('Exit full screen');
				component.props.onExitFullscreen && component.props.onExitFullscreen(event);
				this.onFullScreenChange(false, key);
			}
		})
	}

	/**
	 * Render the children inside the ScrollView based on the fullscreen state.
	 * If on fullscreen, then it hides all the content inside of it, otherwise, it just return it.
	 * But for the BrightcovePlayer, make sure it makes the right fixes to it before rendering it to the page.
	 * @param {*} children - Children from the ScrollView components
	 */
	renderChildren(children) {
		return React.Children.map(children, (child, key) => {

			const elementName = child && child.type && child.type.name || null;
			const isBrightcovePlayer = elementName === 'BrightcovePlayer' || elementName === 'BCPlayer';

			switch (true) {
				case isBrightcovePlayer:
					return this.cloneBrightcovePlayer(child, key);
				case (this.state.fullscreen && !isBrightcovePlayer):
					return null;
				default:
					return child;
			}
		});
	}

	render() {
		const { fullscreen } = this.state;
		const {
			bounces,
			children,
			onScroll,
			scrollEventThrottle,
			...scrollProps
		} = this.props;

		let allChildren = this.renderChildren(children);

		return (
			<RNScrollView
				{...scrollProps}
				ref={(scroll) => { this.scroll = scroll }}
				bounces={fullscreen ? !fullscreen : bounces}
				onScroll={(event) => {
				if (!fullscreen) this.scrollPos = event.nativeEvent.contentOffset.y;
				onScroll(event);
				}}
				scrollEventThrottle={scrollEventThrottle}
			>
				{allChildren}
			</RNScrollView>
		);
	}
}

ScrollView.propTypes = {
	children: PropTypes.node.isRequired,
	scrollEventThrottle: PropTypes.number,
	onScroll: PropTypes.func,
	bounces: PropTypes.bool
}

ScrollView.defaultProps = {
	scrollEventThrottle: 16,
	onScroll: () => {},
	bounces: false
}

module.exports = ScrollView;