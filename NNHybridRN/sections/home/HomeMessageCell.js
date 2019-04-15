import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import AppUtil from '../../utils/AppUtil';

export default class HomeMessageCell extends Component {

    _renderMessageItem() {
        const { messages } = this.props;
        const tmpMessages = [];

        for (const i in messages) {
            tmpMessages.push(
                <TouchableWithoutFeedback
                    key={i}
                    onPress={() => {

                    }}>
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>
                            {messages[i].title}
                        </Text>
                        <Image
                            style={styles.itemImage}
                            source={require('../../resource/images/arrow/right_gray_arrow.png')}
                        />
                    </View>
                </TouchableWithoutFeedback>
            );
        }

        return tmpMessages;
    }

    render() {
        const { messages } = this.props;

        if (!messages || !messages.length) return null;

        return (
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={require('../../resource/images/home_page_message_title.png')}
                />
                <Swiper
                    autoplay={true}
                    autoplayTimeout={3.0}
                    autoplayDirection={true}
                    horizontal={false}
                    containerStyle={styles.swiper}
                    showsPagination={false}
                >
                    {this._renderMessageItem()}
                </Swiper>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        marginBottom: 10,
        flexDirection: 'row',
    },
    image: {
        marginLeft: 10,
        marginTop: 8,
        width: 85,
        height: 28,
        resizeMode: 'contain'
    },
    swiper: {
        marginLeft: 15,
        marginRight: 15,
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemImage: {
        width: 20,
        height: 20,
        resizeMode: 'center',
    },
    itemText: {
        width: AppUtil.windowWidth - 140,
        fontSize: 12,
        color: AppUtil.app_black,
        textAlign: 'left'
    },
});
