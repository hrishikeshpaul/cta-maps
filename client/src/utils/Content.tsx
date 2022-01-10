import { FC, useState } from 'react';

import { Box, Center, Spinner } from '@chakra-ui/react';

import { Navbar } from 'navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from 'home/Home';

export const Content: FC = () => {
    return (
        <>
            <Navbar />

            <Box pt="80px" h="100%" w="100%" bg="teal">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </Box>
        </>
    );
};
