import useGameStore from "@/store/useGameStore";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type LetterProps = {
    index: number,
    value?: string;
    isActive: boolean;
};

export default function Letter({ index, value, isActive }: LetterProps) {

    // TODO
    // Beim Drücken auf einen Letter sollte dieser aktiviert werden
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
        },
        text: {
            color: 'white',
        },
    });

    return (
        <TouchableOpacity style={dynamicStyles.container}
            onPress={() => {
                // TODO
                // Neuer Current Letter setzen
                // Kann hier ja nicht mit 0 Arbeiten
                activateLetter(index, value, true);

            }}>
            <Text style={dynamicStyles.text}>{value}</Text>
        </TouchableOpacity>
    );
}


