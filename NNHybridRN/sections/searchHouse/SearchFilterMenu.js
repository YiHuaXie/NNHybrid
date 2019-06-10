import React, { Component } from 'react';
import { requireNativeComponent, NativeModules, findNodeHandle } from 'react-native';

const FilterMenu = requireNativeComponent('FHTFilterMenu', SearchFilterMenu);
const filterMenuManager = NativeModules.FHTFilterMenuManager;

export const FilterMenuType = {
    NONE: 'None',
    ENTIRERENT: 'EntireRent',
    SHAREDRENT: 'SharedRent',
    APARTMENT: 'Apartment',
    BELOWTHOUSAND: 'BelowThousand',
    PAYMONTHLY: 'PayMonthly',
    VR: 'VR'
}

export default class SearchFilterMenu extends Component {

    showSubMenuOnView(container) {
        const filterMenuTag = findNodeHandle(this.refs.filterMenu);
        const containerTag = findNodeHandle(container);
        if (filterMenuTag && containerTag) {
            filterMenuManager.showFilterMenuOnView(containerTag, filterMenuTag);
        }
    }

    render() {
        return <FilterMenu ref='filterMenu' {...this.props} />;
    }
}