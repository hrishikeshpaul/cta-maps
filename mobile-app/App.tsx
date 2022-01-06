import { REACT_APP_MAPS_API_KEY } from "@env";
import MapView from "react-native-maps";

import { StyleSheet, Text, View } from "react-native";

import { NativeBaseProvider, Box } from "native-base";
import * as Location from "expo-location";

export default function App() {
  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        {/* <MapView
          style={{ height: "100%", width: "100%" }}
          key={REACT_APP_MAPS_API_KEY}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        /> */}
      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
