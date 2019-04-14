import Toast from 'react-native-root-toast';

export default class Toaster {

    static autoDisapperShow(text, animation = true, delay = 1500) {
        const toast = Toast.show(text, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: animation,
            hideOnPress: true,
            delay: 0,
        });

        setTimeout(() => Toast.hide(toast), delay);
    }
}