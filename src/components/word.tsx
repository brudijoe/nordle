import { StyleSheet, View } from "react-native";
import Letter from "./letter";
import useGameStore from "@/store/useGameStore";

export default function Word() {
    const state = useGameStore();

    return (
        <View style={styles.container}>
            {/* Map Letter */}
            <Letter index={state.currentWord.letters[0].index} value={state.currentWord.letters[0].value} isActive={state.currentWord.letters[0].isActive} />
            <Letter index={state.currentWord.letters[1].index} value={state.currentWord.letters[1].value} isActive={state.currentWord.letters[1].isActive} />
            <Letter index={state.currentWord.letters[2].index} value={state.currentWord.letters[2].value} isActive={state.currentWord.letters[2].isActive} />
            <Letter index={state.currentWord.letters[3].index} value={state.currentWord.letters[3].value} isActive={state.currentWord.letters[3].isActive} />
            <Letter index={state.currentWord.letters[4].index} value={state.currentWord.letters[4].value} isActive={state.currentWord.letters[4].isActive} />
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
