import React from 'react';
import {Button, Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import renderIf from "./renderIf";
import {vibrate} from './utils';


let iter = 0
const styles = StyleSheet.create({
    appContainerStyle: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    textStyle: {
        fontSize: 30,
    },
    buttonStyle: {
        width: 170,
        backgroundColor: 'red',
        marginTop: 20,
    },
    pictureStyle: {
        width: 300,
        height: 300,
        resizeMode: 'stretch',
        backgroundColor: 'transparent',
    },

})

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timerCount: 10,
            isMounted: true,
            showAlertAboutBreak: false,
            isPauseToggled: false,
        }
    }

    breakComponent = () => {
        return (
            <View>
                <Image
                    style={styles.pictureStyle}
                    source={require('./assets/breakpicture.png')}/>
                <Text style={{alignItems: 'center'}}>
                    {"Its Break time"}
                </Text>
            </View>
        )

    }

    workComponent = () => {
        return (
            <View>
                <Image
                    style={styles.pictureStyle}
                    source={require('./assets/workpicture.png')}/>
                <Text style={{alignItems: 'center'}}>
                    {"Work, work, work!"}
                </Text>
            </View>
        )

    }


    updateTimerCount = () => {
        this.setState((prevState) => ({
            timerCount: prevState.timerCount - 1
        }))
    }

    alertToTakeABreak = () => {
        if (this.state.timerCount === 0 && this.state.showAlertAboutBreak === false) {
            this.setState(() => ({
                showAlertAboutBreak: true,
                timerCount: 5,
            }))
            vibrate()
        }

        if (this.state.timerCount === 0 && this.state.showAlertAboutBreak === true) {
            this.setState(() => ({
                showAlertAboutBreak: false,
                timerCount: 10,
            }))
            vibrate()
        }
    }

    pauseTimer = () => {
        this.setState((prevState) => ({
            isPauseToggled: !prevState.isPauseToggled
        }))
    }

    resetTimer = () => {
        this.setState(() => ({
            timerCount: 10,
            isPauseToggled: false,
        }))
    }

    secondsToMinutes(timerCount) {
        return `${Math.floor(timerCount / 60)}:${timerCount % 60 < 10 ? `0${timerCount % 60}` : timerCount % 60}`
    }


    componentDidMount() {
        setInterval(() => {this.state.isPauseToggled ? () => {} : this.updateTimerCount()}, 1000)
        this.setState(() => ({
            isMounted: true
        }))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.alertToTakeABreak()
    }


    componentWillUnmount() {
        this.setState(() => ({
            isMounted: false
        }))
        clearInterval(this.interval)
    }


    render() {
        return (
            <View style={styles.appContainerStyle}>
                <View>
                    {renderIf(this.state.showAlertAboutBreak, this.breakComponent(), this.workComponent())}
                </View>
                <View>
                    <Text style={styles.textStyle}>
                        {this.secondsToMinutes(this.state.timerCount)}
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Button
                        title={'Reset'}
                        onPress={this.resetTimer}
                    />
                    <Button title={
                        this.state.isPauseToggled ? 'Start' : 'Pause'
                    }
                            onPress={this.pauseTimer}
                    />
                </View>
            </View>
        );
    }
}

