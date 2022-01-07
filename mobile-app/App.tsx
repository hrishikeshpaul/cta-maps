import { FunctionComponent, useState } from 'react';
import { StyleSheet } from 'react-native';

import { NativeBaseProvider, Box, useColorModeValue, Center, Spinner } from 'native-base';

import { Map } from './src/map/Map';
import { DataStoreProvider, useDataStore } from './src/store/data/DataStore';
import { SystemStoreProvider, useSystemStore } from './src/store/system/SystemStore';
import { Nav } from './src/nav/Nav';
import { RouteSelect } from './src/route-select/RouteSelect';
import { LocaleProvider } from './src/i18n/LocaleProvider';
import { Overlay } from './src/shared/Overlay';
import { SocketProvider } from './src/utils/SockerProvider';
import { FontProvider } from './src/theme/Font';
import { theme } from './src/theme/Theme';

export default function App() {
    const AppWrapper: FunctionComponent = () => {
        const [{ systemLoading }] = useSystemStore();

        return !systemLoading ? (
            <Box style={styles.container}>
                <SocketProvider />
                <Nav />
                <Overlay />
                <Map />
                <RouteSelect />
            </Box>
        ) : (
            <Center flex="1">
                <Spinner />
            </Center>
        );
    };

    const Providers: FunctionComponent = ({ children }) => {
        return (
            <NativeBaseProvider theme={theme}>
                <SystemStoreProvider>
                    <DataStoreProvider>
                        <FontProvider />
                        <LocaleProvider />
                        {children}
                    </DataStoreProvider>
                </SystemStoreProvider>
            </NativeBaseProvider>
        );
    };

    return (
        <Providers>
            <AppWrapper />
        </Providers>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
});
