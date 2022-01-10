import { FC } from 'react';

import { Box } from '@chakra-ui/react';

import { Navbar } from 'navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from 'home/Home';

export const Content: FC = () => {
    return (
        <>
            <Box pt="80px" h="100%" w="100%">
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <Navbar />
                                    <Home />
                                </>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </Box>
        </>
    );
};
