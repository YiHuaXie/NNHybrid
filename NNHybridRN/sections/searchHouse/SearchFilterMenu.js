import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';

const FilterMenu = requireNativeComponent('FHTFilterMenu', SearchFilterMenu);

export default class SearchFilterMenu extends Component {

    render() {
        return (
            <FilterMenu {...this.props} />
        );
    }
}