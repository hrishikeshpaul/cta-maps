import { FC, lazy, useEffect } from 'react';

import { Box } from '@chakra-ui/react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { FAQ } from 'faq/FAQ';
// import { Home } from 'home/Home';
import { Navbar } from 'navbar/Navbar';

const Home = lazy(() => import('home/Home').then((module) => ({ default: module.Home })));

export const Content: FC = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [location]);

    return (
        <>
            <Box pt="80px" h="100%" w="100%">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/faq" element={<FAQ />}></Route>
                </Routes>
            </Box>
        </>
    );
};
