import React, { Component } from 'react';
import { StyleSheet,View, Text, SectionList } from 'react-native';
import NavigationUtil from '../../utils/NavigationUtil';

import { connect } from 'react-redux';
import {
    loadCentraliedDetail
} from '../../redux/houseDetail';


class CentraliedDetailPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>HouseDetailPage</Text>
            </View>
        );
    }
}

const mapStateToProps = state => ({ centraliedDetail: state.centraliedDetail });

const mapDispatchToProps = dispatch => ({
    loadCentraliedDetail: cityId =>
        dispatch(loadData(cityId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CentraliedDetailPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});