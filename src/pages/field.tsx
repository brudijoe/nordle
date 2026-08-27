// Created: 2026-08-13
import Word from '@/components/word';
import KeyboardRow from '@/components/keyboard/keyboard-row';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useGameStore from '@/store/useGameStore';
import { useSnackbarStore } from '@/store/snackbarStore';

type FieldProps = {
    // Define props here
}

export default function Field({ }: FieldProps) {
    const keyboardLetters = ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "A", "S",
        "D", "F", "G", "H", "J", "K", "L", "Y", "X", "C", "V", "B", "N", "M"];

    const state = useGameStore();
    const moveOneLetterBack = useGameStore((state) => state.moveOneLetterBack);
    const deleteWord = useGameStore((state) => state.deleteWord);
    const checkWord = useGameStore((state) => state.checkWord)

    // TODO
    // x. ZURÜCK UND BESTÄTIGEN KNÖPFE
    // 1. Wort eingeben z. B: R A S E N
    // x. Wort prüfen

    //Snackbar
    const show = useSnackbarStore((state) => state.show);

    return (
        <View style={styles.container}>
            <View style={styles.wordContainer}>
                <Word />
            </View>

            <View style={styles.keyboardContainer}>
                <KeyboardRow />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        if (state.currentWord.isWordComplete) {
                            checkWord();
                        }
                        // uncomplete word
                        if (!state.currentWord.isWordComplete) {
                            show('Vervollständige das Wort');
                        }
                    }}>
                    <Text style={styles.buttonText}>
                        Wort prüfen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        if (state.currentLetter.index >= 1 && state.currentLetter.index <= 4) {
                            if (!state.currentWord.isWordComplete) {
                                moveOneLetterBack(state.currentLetter.index);
                            }
                            if (state.currentWord.isWordComplete) {
                                show('Das Wort wurde bereits geprüft.');
                            }
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
