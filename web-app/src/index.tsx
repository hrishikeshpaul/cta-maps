import React from 'react';

import ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme, theme as ChakraTheme, ThemeConfig, ColorModeScript } from '@chakra-ui/react';

import { App } from 'App';
import { LocaleProvider } from 'i18n/LocaleProvider';
import { DataStoreProvider } from 'store/data/DataStore';
import { SystemStoreProvider } from 'store/system/SystemStore';

import reportWebVitals from './reportWebVitals';

import './index.scss';

const theme = extendTheme({
    config: {
        cssVarPrefix: 'trackcta',
    } as ThemeConfig,
    shadows: {
        ...ChakraTheme.shadows,
        outline: 'none',
    },
    components: {
        Alert: {
            variants: {
                toast: (P: any) => {
                    return {
                        container: {
                            ...P.theme.components.Alert.variants.solid(P).container,
                            bottom: '64px',
                        },
                    };
                },
            },
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <SystemStoreProvider>
                <DataStoreProvider>
                    <>
                        <LocaleProvider />
                        <App />
                    </>
                </DataStoreProvider>
            </SystemStoreProvider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
