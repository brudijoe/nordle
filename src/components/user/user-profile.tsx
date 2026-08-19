import { View, Text, Image, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../../api/user";

export function UserProfile() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
    });

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    if (isError) {
        return <Text>Fehler: {error.message}</Text>;
    }

    return (
        <View style={{ alignItems: "center", padding: 16 }}>
            <Image
                source={{ uri: data!.avatarUrl }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 8 }}>
                {data!.name}
            </Text>
            <Text style={{ color: "gray" }}>{data!.email}</Text>
        </View>
    );
}