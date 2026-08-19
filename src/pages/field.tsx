// Created: 2026-08-13
import Word from '@/components/word';
import KeyboardRow from '@/components/keyboard/keyboard-row';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useGameStore from '@/store/useGameStore';

type FieldProps = {
    // Define props here
}

export default function Field({ }: FieldProps) {
    const keyboardLetters = ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "A", "S",
        "D", "F", "G", "H", "J", "K", "L", "Y", "X", "C", "V", "B", "N", "M"];

    const state = useGameStore();
    const moveOneLetterBack = useGameStore((state) => state.moveOneLetterBack);
    const deleteWord = useGameStore((state) => state.deleteWord);

    // TODO
    // x. ZURÜCK UND BESTÄTIGEN KNÖPFE
    // 1. Wort eingeben z. B: R A S E N
    // x. Wort prüfen

    return (
        <View style={styles.container}>
            <View style={styles.wordContainer}>
                <Word />
            </View>

            <View style={styles.keyboardContainer}>
                <KeyboardRow />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Wort prüfen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        if (state.currentLetter.index >= 1 && state.currentLetter.index <= 4) {
                            moveOneLetterBack(state.currentLetter.index);
                        }
                    }}>
                    <Text style={styles.buttonText}>Zurück</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}
                        onPress={deleteWord}>
                        Wort löschen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    wordContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '2px',
        marginBottom: 2,
    },
    keyboardContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '2px',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white'
    }
});
