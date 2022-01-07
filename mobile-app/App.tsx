import { FunctionComponent, useState } from 'react';
import { StyleSheet } from 'react-native';

import { NativeBaseProvider, Box, extendTheme, useColorModeValue, Center, Spinner } from 'native-base';
import { useFonts } from 'expo-font';

import { Map } from './src/map/Map';
import { DataStoreProvider, useDataStore } from './src/store/data/DataStore';
import { SystemStoreProvider, useSystemStore } from './src/store/system/SystemStore';
import { Nav } from './src/nav/Nav';
import { RouteSelect } from './src/route-select/RouteSelect';
import { LocaleProvider } from './src/i18n/LocaleProvider';

const theme = extendTheme({
    fontConfig: {
        Inter: {
            100: {
                normal: 'Inter-Light',
                italic: 'Inter-LightItalic',
            },
            200: {
                normal: 'Inter-Light',
                italic: 'Inter-LightItalic',
            },
            300: {
                normal: 'Inter-Light',
                italic: 'Inter-LightItalic',
            },
            400: {
                normal: 'Inter-Regular',
                italic: 'Inter-Italic',
            },
            500: {
                normal: 'Inter-Medium',
            },
            600: {
                normal: 'Inter-Medium',
                italic: 'Inter-MediumItalic',
            },
            700: {
                normal: 'Inter-SemiBold',
            },
            800: {
                normal: 'Inter-Bold',
                italic: 'Inter-BoldItalic',
            },
            900: {
                normal: 'Inter-Bold',
                italic: 'Inter-BoldItalic',
            },
        },
    },

    fonts: {
        heading: 'Inter',
        body: 'Inter',
        mono: 'Inter',
    },
});

export default function App() {
    const [loaded] = useFonts({
        'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
        'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
        'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
        'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    });

    if (!loaded) {
        return null;
    }

    const AppWrapper: FunctionComponent = () => {
        const [{ stop }, { onIdle, onActive }] = useDataStore();
        const [{ systemLoading, routeSelectOpen }] = useSystemStore();
        const color = useColorModeValue('gray.700', 'gray.200');

        return !systemLoading ? (
            <Box style={styles.container}>
                <Nav />
                <Map />
                <RouteSelect />
            </Box>
        ) : (
            <Center>
                <Spinner />
            </Center>
        );
    };

    return (
        <>
            <NativeBaseProvider theme={theme}>
                <SystemStoreProvider>
                    <DataStoreProvider>
                        <LocaleProvider />
                        <AppWrapper />
                    </DataStoreProvider>
                </SystemStoreProvider>
            </NativeBaseProvider>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
});
