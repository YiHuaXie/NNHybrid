import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';

export default class TextField extends Component {

    static propTypes = {
        leftView: PropTypes.element,
        letViewStyle: PropTypes.object,
        rightView: PropTypes.element,
        rightViewStyle: PropTypes.object,
        textFieldStyle: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = { text: '测试一下' };
    }

    render() {
        return (
            <View style={[styles.container, this.props.textFieldStyle]}>
                <View style={this.props.letViewStyle}>
                    {this.props.leftView}
                </View>
                <TextInput style={{borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({ text })}
                    clearButtonMode={'while-editing'}
                    value={this.state.text}>

                </TextInput>
                <View style={this.props.rightViewStyle}>
                    {this.props.rightView}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    defaultLeftView: {

    },
    defaultRightView: {

    }
});