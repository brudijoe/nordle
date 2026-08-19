// Created: 2026-08-13
import useGameStore from '@/store/useGameStore';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

type KeyboardLetterProps = {
    // Define props here
    value?: string;
}

// TODO
// CurrentSelectedLetter einbauen
// Welcher Letter ist gerade active

export default function KeyboardLetter({ value }: KeyboardLetterProps) {
    const addLetterToWord = useGameStore((state) => state.addLetterToWord);
    const state = useGameStore();
    const isWordComplete = useGameStore((state) => state.currentWord.isWordComplete);
    const wordIsNotComplete = !isWordComplete;

    // TODO Neuen active index holen

    console.log("state.currentLetter.index: ", state.currentWord.letters);

    console.log("state.currentLetter: ", state.currentLetter);

    return (
        <TouchableOpacity
            onPress={() => {
                // Kann hier ja nicht mit 0 Arbeiten
                // 0

                if (state.currentLetter.isActive === true && state.currentLetter.index <= 4) {
                    {
                        if (wordIsNotComplete === true) {
                            addLetterToWord(state.currentLetter.index, value)
                        }
                    }

                }

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
