import React, { Component } from 'react';
import { StyleSheet, View, Text, SectionList } from 'react-native';
import NavigationUtil from '../../utils/NavigationUtil';
import NavigationBar from '../../navigator/NavigationBar';

import { connect } from 'react-redux';
import {
    loadDecentraliedDetail
} from '../../redux/houseDetail';
import Toaster from '../../components/common/Toaster';


class DecentraliedDetailPage extends Component {

    componentWillMount() {
        const { loadDecentraliedDetail } = this.props;
        const { houseId, isFullRent } = this.props.navigation.state.params;

        loadDecentraliedDetail(houseId, error => Toaster.autoDisapperShow(error));
    }

    render() {
        const { decentraliedDetail } = this.props;
        console.log(decentraliedDetail);
        return (
            <View style={styles.container}>
                <NavigationBar
                    backOrClose='back'
                    backOrCloseHandler={() => NavigationUtil.goBack()}
                    title='房间详情'
                    showDividingLine={true}
                    navBarStyle={{ position: 'absolute' }}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    decentraliedDetail: state.decentraliedDetail
});

const mapDispatchToProps = dispatch => ({
    loadDecentraliedDetail: (houseId, callBack) =>
        dispatch(loadDecentraliedDetail(houseId, callBack)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DecentraliedDetailPage);

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