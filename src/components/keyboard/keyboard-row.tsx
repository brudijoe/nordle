// Created: 2026-08-13
import { View, Text, StyleSheet } from 'react-native';
import KeyboardLetter from './keyboard-letter';

type KeyboardRowProps = {
    // Define props here
}

export default function KeyboardRow({ }: KeyboardRowProps) {
    return (
        <View style={styles.container}>
            <KeyboardLetter value='Q' />
            <KeyboardLetter value='W' />
            <KeyboardLetter value='E' />
            <KeyboardLetter value='R' />
            <KeyboardLetter value='T' />
            <KeyboardLetter />
            <KeyboardLetter />
            <KeyboardLetter />
            <KeyboardLetter />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '2px',
    },
});
