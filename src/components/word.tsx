import { StyleSheet, View } from "react-native";
import Letter from "./letter";
import useGameStore, { Attempt as AttemptProps } from "@/store/useGameStore";

export default function Word({ index, isCurrentAttempt, word }: AttemptProps) {
    return (
        <View style={styles.container}>
            {word.letters.map((letter, indexLetter) => {
                return <Letter
                    key={indexLetter}
                    index={letter.index}
                    value={letter.value}
                    isActive={letter.isActive}
                    status={letter.status}
                />
                // TODO isCurrentAttempt === true ist nicht richtig
                if (isCurrentAttempt === true || word.isWordChecked) {
                    return <Letter
                        key={indexLetter}
                        index={letter.index}
                        value={letter.value}
                        isActive={letter.isActive}
                        status={letter.status}
                    />
                } else {
                    return (
                        <View key={indexLetter}>
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
