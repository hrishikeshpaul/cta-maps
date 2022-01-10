import { FC } from 'react';

import { Box } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from 'home/Home';
import { Navbar } from 'navbar/Navbar';

export const Content: FC = () => {
    return (
        <>
            <Box pt="80px" h="100%" w="100%">
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                    </Routes>
                </BrowserRouter>
            </Box>
        </>
    );
};
