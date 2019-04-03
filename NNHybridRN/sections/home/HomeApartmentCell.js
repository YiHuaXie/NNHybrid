import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    FlatList,
    Text,
} from 'react-native';
import AppUtil from '../../utils/AppUtil';

const cellHeight = 250;
const headerViewHeight = 30;
const itemSize = { width: 240, height: 190 };

export default class HomeApartmentCell extends Component {

    _headerView() {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLine} />
                <Text style={styles.headerTitle}>品牌公寓</Text>
                <TouchableWithoutFeedback>
                    <Text style={styles.headerMore}>查看更多</Text>
                </TouchableWithoutFeedback>

            </View>
        );
    }

    _renderApartmentItem(item, index) {
        const marginLeft = index === 0 ? 15 : 10;
        const marginRight = index < this.props.apartments.length - 1 ? 0 : 15;
        return (
            <View style={{
                ...styles.itemContainer,
                marginLeft: marginLeft,
                marginRight: marginRight
            }}>
                <View style={styles.itemImageContainer}>
                    <Image
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
        );
    }

    render() {
        const { apartments } = this.props;

        return apartments.length ?
            <View style={styles.container}>
                {this._headerView()}
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={apartments}
                    horizontal={true}
                    keyExtractor={item => `${item.estateId}`}
                    // contentInset只支持iOS
                    renderItem={({ item, index }) => this._renderApartmentItem(item, index)}
                />
            </View> : null;
    }
}

const styles = StyleSheet.create({
    container: {
        height: cellHeight,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: headerViewHeight,
        alignItems: 'flex-end',
    },
    headerLine: {
        backgroundColor: AppUtil.app_theme,
        width: 3,
        height: 17,
        marginLeft: 15,
    },
    headerTitle: {
        width: AppUtil.windowWidth - 95,
        color: AppUtil.app_black,
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    headerMore: {
        color: AppUtil.app_gray,
        fontSize: 12,
        marginRight: 15
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
    
});