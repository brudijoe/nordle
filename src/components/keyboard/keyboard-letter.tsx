// Created: 2026-08-13
import useGameStore from '@/store/useGameStore';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

type KeyboardLetterProps = {
    // Define props here
    value?: string;
}

export default function KeyboardLetter({ value }: KeyboardLetterProps) {
    const addLetterToCurrentAttempt = useGameStore((state) => state.addLetterToCurrentAttempt);
    // TODO aktuellen Attempt holen
    const currentAttempt = useGameStore((state) => state.currentGame.attempts[state.currentGame.currentAttempt]);
    const state = useGameStore();

    return (
        <TouchableOpacity
            onPress={() => {
                addLetterToCurrentAttempt(currentAttempt, state.currentLetter.index, value);
            }}
            style={styles.container}
        >
            <Text style={styles.text}>{value}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 5,
    },
    text: {
        color: 'white',
    }
});
