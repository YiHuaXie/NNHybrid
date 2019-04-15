import React, { Component } from 'react';
import { SectionList, StyleSheet, View, Text } from 'react-native';
import AppUtil from '../../utils/AppUtil';

class CityLocationCell extends Component {
    render() {
        <View style={locationCellStyles.container}>
        </View>
    }
}

export default class CityListHeader extends Component {

    _renderSectionHeader(data) {
        console.log(data);
        return (
            <View style={{ height: 35 }}>
                <Text style={{ fontSize: 15, color: AppUtil.app_gray }}>测试一下</Text>
            </View>
        );
    }

    _renderItem() {

    }

    render() {
        const { locationCity } = this.props;
        return (
            <SectionList
                // contentContainerStyle={{
                //     flexDirection: 'row',//设置横向布局
                //     flexWrap: 'wrap',
                //     justifyContent: 'space-between',
                // }}
                // ListHeaderComponent={() => this._renderTableHeader()}
                renderSectionHeader={this._header}
                renderItem={this.renderItem}

                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}

                //滑动
                // stickySectionHeadersEnabled={false}
                keyExtractor={item => item.title}
                sections={
                    [{ key: 's1', data: this.state.order_list.items }]
                }
            />
        )
    }
}

const locationCellStyles = StyleSheet.create({
    container: {
        height: 80,
        flexDirection: 'row',
        just
    }
});

const styles = StyleSheet.create({
    sectionHeader: {
        height: 35
    }

});