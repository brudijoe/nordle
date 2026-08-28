import { StyleSheet, View } from "react-native";
import Letter from "./letter";
import useGameStore, { Game as GameProps } from "@/store/useGameStore";

export default function Word({ attempt }) {
    const state = useGameStore();

    // Wenn das game nicht finished ist, dann kann der Benutzer einen weiteren Attempt machen

    console.log(attempt);

    return (
        <View style={styles.container}>
            {/* Das gehört am Anfang zum ersten Versuch */}
            {/* Attempt müssten die letters enthalten, das hier ist sonst unlogisch */}
            {attempt.word.letters.map((letter, indexLetter) => {
                if (attempt.currentAttempt === true) {
                    return <Letter
                        key={indexLetter}
                        index={letter.index}
                        value={letter.value}
                        isActive={letter.isActive}
                        status={letter.status}
                    />
                } else {
                    return (
                        <View>
                            <View style={styles.emptyLetter} />
                        </View>
                    );
                }
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 2,
    },
    emptyLetter: {
        height: 50,
        width: 50,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: 'transparent',
    }
});
