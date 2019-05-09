import React, { Component } from 'react';
import { StyleSheet, View, Text, requireNativeComponent } from 'react-native';
import AppUtil from '../../utils/AppUtil';

const HouseDetailTitleCell = requireNativeComponent('HouseDetailTitleCell', HouseDetailTitleCell);

export default class HouseDetailInfoCell extends Component {

    static defaultProps = {
        centraliedHouse: {},
        decentraliedHouse: {}
    };

    state = { houseTitleHeight: 0 };

    _updateCellHeight(event) {
        this.setState({
            houseTitleHeight: event.nativeEvent.layout.height
        });
    }

    _renderHouseTitle() {
        const { decentraliedHouse, centraliedHouse } = this.props;
        let title = '';
        if (!AppUtil.isEmptyObject(decentraliedHouse)) {
            title = decentraliedHouse.houseName;
        } else {
            title = `${centraliedHouse.estateName}.${centraliedHouse.styleName}`;
        }

        return (
            <Text style={styles.houseTitle} numberOfLines={2} onLayout={e => this._updateCellHeight(e)}>
                {title}
            </Text>
        );
    }

    render() {
        const { decentraliedHouse, centraliedHouse } = this.props;

        if (AppUtil.isEmptyObject(decentraliedHouse) && AppUtil.isEmptyObject(centraliedHouse)) return null;

        let hasTags =
            !AppUtil.isEmptyArray(decentraliedHouse.showTagList) ||
            !AppUtil.isEmptyArray(centraliedHouse.showTagList);

        return (
            <View style={{ height: this.state.houseTitleHeight + (hasTags ? 105 : 75) + 10 }} >
                {this._renderHouseTitle()}
                < HouseDetailTitleCell style={{ height: hasTags ? 105 : 75, marginBottom: 10 }} {... this.props} />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    houseTitle: {
        // backgroundColor: 'red',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
    }
})