// Created: 2026-08-13
import Word from '@/components/word';
import KeyboardRow from '@/components/keyboard/keyboard-row';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useGameStore from '@/store/useGameStore';
import { useSnackbarStore } from '@/store/snackbarStore';
import Letter from '@/components/letter';

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
    const currentAttempt = useGameStore((state) => state.currentGame.attempts[state.currentGame.currentAttempt]);
    const activeWord = currentAttempt.word;

    //Snackbar
    const show = useSnackbarStore((state) => state.show);

    const game = useGameStore((state) => state.currentGame);
    const gameStatus = useGameStore((state) => state.currentGame.status);

    console.log("game finished? :", game.status);

    const gs = 'lose';

    // TODO Lösungswort anzeigen bei game.status === 'lose'
    // Beim verlieren müsste ich das Backend anfragen

    // TODO Lösungswort hinzufügen, wenn man verloren hat
    const answerWord = ['W', 'E', 'R', 'T', 'E']; // kommt später vom Backend

    return (
        <View style={styles.container}>
            <View style={styles.wordContainer}>
                {game.attempts.map((attempt, index) => {
                    return <Word
                        key={index}
                        index={attempt.index}
                        isCurrentAttempt={attempt.isCurrentAttempt}
                        word={attempt.word}
                    />
                })}
            </View>
            {/* TODO Eigene page */}
            <View style={styles.loseContainer}>
                {gameStatus === 'lose' &&
                    answerWord.map((letter, indexLetter) => {
                        return <Letter
                            key={indexLetter}
                            index={0}
                            value={letter}
                            isActive={false}
                            status={'unchecked'}
                        />
                    })
                }
            </View>

            {/* Game is finished */}
            {gameStatus === 'win' ?
                <View style={styles.gameStatusContainer}>
                    <Text style={styles.buttonText}>Gewonnen!</Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Weiter</Text>
                    </TouchableOpacity>
                </View>
                :
                gameStatus === 'lose' ?
                    <>
                        <View style={styles.gameStatusContainer}>
                            <Text style={styles.buttonText}>Verloren!</Text>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Weiter!</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                    <>
                        <View style={styles.keyboardContainer}>
                            <KeyboardRow />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    // TODO Check if there benefits to make it global
                                    if (activeWord.status === 'unfinished') {
                                        show('Vervollständige das Wort');
                                        return;
                                    }

                                    if (activeWord.status === 'filled') {
                                        checkWord(currentAttempt.word.letters);
                                    }
                                }}>
                                <Text style={styles.buttonText}>
                                    Wort prüfen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}
                                onPress={() => {
                                    moveOneLetterBack(state.currentLetter.index);
                                }}>
                                <Text style={styles.buttonText}>Zurück</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text
                                    style={styles.buttonText}
                                    onPress={deleteWord}>
                                    Wort löschen
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    wordContainer: {
        flexDirection: 'column',
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
    gameStatusContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loseContainer: {
        flexDirection: 'row',
        gap: '2px',
        marginBottom: 2,
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
