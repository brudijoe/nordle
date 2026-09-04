import useGameStore, { Letter as LetterProps } from "@/store/useGameStore";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Letter({ index, value, isActive, status }: LetterProps) {
    const activateLetter = useGameStore((state) => state.activateLetter);

    const dynamicStyles = StyleSheet.create({
        container: {
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: isActive ? 'red' : 'white',
            borderWidth: 2,
            borderRadius: 5,
            backgroundColor:
                status === 'unchecked' ? 'transparent'
                    : status === 'match' ? 'green'
                        : status === 'noMatch' ? 'gray'
                            : status === 'matchInOtherPlace' ? 'yellow'
                                : 'transparent',
        },
        text: { color: 'white' },
    });

    return (
        <View>
            <TouchableOpacity
                style={dynamicStyles.container}
                onPress={() => activateLetter(index, value, true)}
            >
                <Text style={dynamicStyles.text}>{value}</Text>
            </TouchableOpacity>
        </View>
    );
}