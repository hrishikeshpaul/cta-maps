import React from 'react';

import ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme, theme as ChakraTheme, ThemeConfig, ColorModeScript } from '@chakra-ui/react';

import { App } from './App';
import './i18n/Config';

import reportWebVitals from './reportWebVitals';
import './index.scss';

const theme = extendTheme({
    config: {
        cssVarPrefix: 'cta-maps',
        // initialColorMode: localStorage.getItem('colorMode') || 'light',
    } as ThemeConfig,
    shadows: {
        ...ChakraTheme.shadows,
        outline: 'none',
    },
    components: {
        Button: {
            baseStyle: {
                _focus: {
                    boxShadow: 'lg',
                },
            },
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
