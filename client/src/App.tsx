import { FC, useState } from 'react';

import { Home } from 'home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.scss';
import { Center, Spinner } from '@chakra-ui/react';
import { LocaleProvider } from 'locale/LocaleProvier';

export const App: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <div className="App">
            <LocaleProvider setSystemLoading={setLoading} />
            {loading ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            )}
        </div>
    );
};
