import { StyleSheet, View } from "react-native";
import Letter from "./letter";
import useGameStore from "@/store/useGameStore";

export default function Word() {
    const state = useGameStore();

    return (
        <View style={styles.container}>
            {state.currentWord.letters.map((letter, indexLetter) => {
                return <Letter
                    key={indexLetter}
                    index={letter.index}
                    value={letter.value}
                    isActive={letter.isActive}
                    status={letter.status}
                />
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
});
