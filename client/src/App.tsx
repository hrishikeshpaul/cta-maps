import { FC, useState } from 'react';

import { Home } from 'home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.scss';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { LocaleProvider } from 'locale/LocaleProvider';
import { Navbar } from 'navbar/Navbar';
import { Content } from 'utils/Content';

export const App: FC = () => {
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <div className="App">
            <LocaleProvider setSystemLoading={setLoading} />
            {loading ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <Content />
            )}
        </div>
    );
};
