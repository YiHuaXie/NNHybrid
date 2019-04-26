import React, { Component } from 'react';
import { StyleSheet, View, Text, SectionList } from 'react-native';
import NNImage from './NNImage';
import AppUtil from '../../utils/AppUtil';

const TagType = {
    Text: 'text',
    Image: 'image',
};

// export class LabelStyleLayoutView extends Component {
//     static propTypes = {
//         contentInset: PropTypes.object,
//     };

//     static viewHeight({ data, contentWidth, contentInset, itemSizeBlock }) {
//         let viewHeight = 0.0;
//         if (AppUtil.isEmptyArray(data)) return viewHeight;

//         for (const i in data) {

//         }
//     }
// }

class TagItem extends Component {

    constructor(props) {
        super(props);

        this.itemSize = { width: 0, height: 0 };
    }

    _textLayout = event => {
        this.textHeight = event.nativeEvent.layout.height
        this.getItemHeight(this.titleHeight, this.textHeight)
    }

    _renderTextTag = tag => {
        return (
            <Text
                ref='textTag'
                onLayout={event => {
                    let width = event.nativeEvent.layout.width;
                    let height = event.nativeEvent.layout.height;

                    width = originalW < 46 ? 46 : originalW;
                    width = width > 65 ? 65 : width;

                    this.itemSize = { width, height };
                }}>

            </Text>
        );
    }

    render() {
        const { type } = this.props;
        return (
            <View style={{ flexDirection: 'row' }}>
                {type == TagType.Text ? <Text ref='textTag'></Text> : <NNImage ref='imageTag' />}

            </View>
        );
    }
}

export default class TagLayoutView extends Component {
    static propTypes = {
        contentInset: PropTypes.object,
        contentWidth: PropTypes.number,
        data: PropTypes.array,

        // textFieldStyle: PropTypes.object,
        // leftView: PropTypes.element,
        // leftViewStyle: PropTypes.object,
        // rightView: PropTypes.element,
        // rightViewStyle: PropTypes.object,
        // textInput: PropTypes.element,
        // textInputStyle: PropTypes.object,
    };

    _renderTags() {
        const { allTags } = this.state;
        const tmpTags = [];

        for (const i in allTags) {
            const obj = allTags[i]
            if (obj.tagIcon) {
                tmpTags.push(
                    <NNImage key={i}
                        style={{ width: obj.iconWidth, height: 16, marginRight: 5 }}
                        source={{ uri: obj.tagIcon }}
                    />
                );
            } else {
                tmpTags.push(
                    <Text
                        style={{
                            ...styles.tagText,
                            color: obj.tagColor,
                            backgroundColor: obj.backgroundColor,
                            borderColor: obj.borderColor
                        }}
                        key={i}
                    >
                        {obj.tagName}
                    </Text>
                );
            }
        }

    }
    render() {
        return (
            <View>

            </View>
        );
    }
}
