import { StyleSheet } from 'react-native';

import { NativeBaseProvider, Box, Button } from 'native-base';
import { Map } from './src/map/Map';
import { DataStoreProvider } from './src/store/data/DataStore';
import { SystemStoreProvider } from './src/store/system/SystemStore';

export default function App() {
    return (
        <NativeBaseProvider>
            <SystemStoreProvider>
                <DataStoreProvider>
                    <Box style={styles.container}>
                        <Map />
                    </Box>
                </DataStoreProvider>
            </SystemStoreProvider>
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
});
