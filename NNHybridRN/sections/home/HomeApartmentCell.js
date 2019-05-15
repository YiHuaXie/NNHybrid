import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableWithoutFeedback
} from 'react-native';
import AppUtil from '../../utils/AppUtil';
import NNImage from '../../components/common/NNImage';

const cellHeight = 230;
const itemSize = { width: 240, height: 190 };

export default class HomeApartmentCell extends Component {

    _renderApartmentItem(item, index) {
        console.log(item);
        const marginLeft = index === 0 ? 15 : 10;
        const marginRight = index < this.props.apartments.length - 1 ? 0 : 15;
        return (
            <TouchableWithoutFeedback
            onPress={() => {
                this.props.itemClick(item.estateId, item.talent);
            }}>
            <View style={{
                ...styles.itemContainer,
                marginLeft: marginLeft,
                marginRight: marginRight
            }}>
                <View style={styles.itemImageContainer}>
                    <NNImage
                        style={styles.itemImage}
                        source={{ uri: item.imageUrl }}
                    />
                </View>
                <Text style={styles.itemTitle}>{item.estateName}</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 10
                }}>
                    <Text style={styles.itemPirce}>
                        {`¥${item.minPrice}`}
                        <Text style={{ ...styles.itemPirce, fontSize: 10 }}>/月</Text>
                    </Text>
                    <Text style={styles.itemCount}>
                        {item.roomCount <= 0 ? '已满房' : `${item.roomCount}套`}
                    </Text>
                </View>
            </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        const { apartments } = this.props;

        return !AppUtil.isEmptyArray(apartments) ?
            <View style={styles.container}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={apartments}
                    horizontal={true}
                    keyExtractor={item => `${item.estateId}`}
                    // contentInset只支持iOS
                    renderItem={({ item, index }) => this._renderApartmentItem(item, index)}
                />
                <View style={styles.dividingLine} />
            </View> : null;
    }
}

const styles = StyleSheet.create({
    container: {
        height: cellHeight,
    },
    itemContainer: {
        width: itemSize.width,
        height: itemSize.height,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginTop: 15,
    },
    itemImageContainer: {
        width: itemSize.width,
        height: 120,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        overflow: 'hidden',//like clipToBounds
    },
    itemImage: {
        width: itemSize.width,
        height: 120,
    },
    itemTitle: {
        marginLeft: 15,
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    itemPirce: {
        color: AppUtil.app_theme,
        fontSize: 18,
        fontWeight: '500',
    },
    itemCount: {
        color: AppUtil.app_gray,
        fontSize: 10,
    },
    dividingLine: {
        height: 10,
        backgroundColor: AppUtil.app_dividing_line
    }
});