import Field from "@/pages/field";
import { useSnackbarStore } from "@/store/snackbarStore";
import { View, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

export default function Index() {
  const { visible, message, hide } = useSnackbarStore();

  return (
    <View style={styles.container}>
      <Field />
      <Snackbar
        visible={visible}
        onDismiss={hide}
        action={{
          label: 'Ok',
        }}
      >
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'black',
  },
});
