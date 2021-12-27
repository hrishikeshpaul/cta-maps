import React, { FunctionComponent } from 'react';

import {
    Avatar,
    Box,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerFooter,
    Text,
    IconButton,
    Flex,
    Link,
} from '@chakra-ui/react';
import { FiChevronRight } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';

import { useStore } from '../store/Store';

import './Info.scss';

export const Info: FunctionComponent = () => {
    const [{ infoOpen }, { closeInfo }] = useStore();

    const onBugReport = () => {
        window.open('https://github.com/hrishikeshpaul/cta-maps/issues/new', '_blank');
    };

    const onContribute = () => {
        window.open('https://github.com/hrishikeshpaul/cta-maps/', '_blank');
    };
    return (
        <Drawer isOpen={infoOpen} placement="right" size="md" onClose={closeInfo} autoFocus={false}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader px="4">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text>Info</Text>
                        <IconButton
                            variant="ghost"
                            fontSize="3xl"
                            aria-label="close"
                            mr="-3"
                            onClick={closeInfo}
                            icon={<IoIosClose />}
                        />
                    </Flex>
                </DrawerHeader>

                <DrawerBody px="4" pt="0" className="info">
                    <Flex flexDir="column" alignItems="center">
                        <Avatar src="/logo.svg" size="xl" />
                        <Text fontSize="lg" fontWeight="bold" pt="2">
                            CTA Maps
                        </Text>
                        <Text color="gray.400" textAlign="center" fontSize="xs">
                            v1.0.0
                        </Text>
                        <Text color="gray.600" textAlign="center">
                            An application to track CTA busses, so that you are not waiting at the bus stop forever.
                        </Text>
                    </Flex>
                    <Box mt="8" className="info-box">
                        <Flex p="4" className="item">
                            <Text fontWeight="medium">Usage Manual</Text>
                            <FiChevronRight />
                        </Flex>
                        <Flex p="4" className="item">
                            <Text fontWeight="medium">Frequently Asked Questions</Text>
                            <FiChevronRight />
                        </Flex>
                        <Flex p="4" className="item" onClick={onBugReport}>
                            <Text fontWeight="medium">Report Bug</Text>
                            <FiChevronRight />
                        </Flex>
                    </Box>
                </DrawerBody>
                <DrawerFooter justifyContent="flex-start">
                    <Text fontSize="sm">
                        Want to contribute? {' '}
                        <Link fontWeight="bold" color="blue.500" onClick={onContribute}>
                           Start here
                        </Link>
                        .
                    </Text>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
