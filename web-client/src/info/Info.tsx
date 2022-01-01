import { FunctionComponent } from 'react';

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
    useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiChevronRight } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';

import { useSystemStore } from 'store/system/SystemStore';

import './Info.scss';

export const Info: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ infoOpen }, { closeInfoDrawer }] = useSystemStore();

    const onBugReport = () => {
        window.open('https://github.com/hrishikeshpaul/cta-maps/issues/new', '_blank');
    };

    const onContribute = () => {
        window.open('https://github.com/hrishikeshpaul/cta-maps/', '_blank');
    };
    return (
        <Drawer isOpen={infoOpen} placement="left" size="md" onClose={closeInfoDrawer} autoFocus={false}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader px="4">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontWeight="bold">CTA Maps</Text>
                        <IconButton
                            variant="ghost"
                            fontSize="3xl"
                            aria-label="close"
                            mr="-3"
                            onClick={closeInfoDrawer}
                            icon={<IoIosClose />}
                        />
                    </Flex>
                </DrawerHeader>

                <DrawerBody px="0" pt="0" className="info">
                    <Flex flexDir="column" alignItems="center" px="4">
                        <Avatar src="/logo.svg" size="xl" />
                        <Text color="gray.400" pt="2" textAlign="center" fontSize="xs">
                            v1.0.0
                        </Text>
                        <Text
                            color={useColorModeValue('gray.600', 'gray.200')}
                            textAlign="center"
                            fontSize="sm"
                            fontWeight="medium"
                        >
                            {t('DESCRIPTION')}
                        </Text>
                    </Flex>
                    <Box mt="8" className="info-box">
                        <Flex p="4" className="item" _active={{ bg: useColorModeValue('gray.200', 'gray.500') }}>
                            <Text className="item-text">{t('USAGE_MANUAL')}</Text>
                            <FiChevronRight />
                        </Flex>
                        <Flex p="4" className="item" _active={{ bg: useColorModeValue('gray.200', 'gray.500') }}>
                            <Text className="item-text">{t('FAQ')}</Text>
                            <FiChevronRight />
                        </Flex>
                        <Flex
                            p="4"
                            className="item"
                            onClick={onBugReport}
                            _active={{ bg: useColorModeValue('gray.200', 'gray.500') }}
                        >
                            <Text className="item-text">{t('REPORT_BUG')}</Text>
                            <FiChevronRight />
                        </Flex>
                    </Box>
                </DrawerBody>
                <DrawerFooter justifyContent="flex-start" flexDir="column" px="4">
                    <Text fontSize="sm">
                        {t('CONTRIBUTE')}{' '}
                        <Link
                            fontWeight="bold"
                            color={useColorModeValue('blue.500', 'blue.200')}
                            onClick={onContribute}
                        >
                            {t('START_HERE')}
                        </Link>
                        .
                    </Text>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.200')}>
                        © 2021 CTA Maps. All rights reserved.
                    </Text>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
