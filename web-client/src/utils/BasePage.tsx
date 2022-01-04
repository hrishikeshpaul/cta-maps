import { FunctionComponent, ReactNode } from 'react';

import { Box, Flex, Button, Avatar, useColorModeValue } from '@chakra-ui/react';
import { HiArrowRight as ArrowRight } from 'react-icons/hi';

interface Props {
    children: ReactNode;
}

export const BasePage: FunctionComponent<Props> = ({ children }) => {
    return (
        <Box>
            <Flex
                position="sticky"
                top="0"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`1px solid ${useColorModeValue('gray.300', 'gray.100')} `}
                mb="6"
                p="4"
                backgroundColor={useColorModeValue('gray.50', 'gray.900')}
            >
                <Avatar h="40px" w="40px" src="logo.svg" size="md" />
                <Button colorScheme="blue" rightIcon={<ArrowRight />}>
                    Go to Maps
                </Button>
            </Flex>
            <Box>{children}</Box>
            <Flex justifyContent="space-between" alignItems="center" boxShadow="sm" mt="12" p="4">
                Footer goes here
            </Flex>
        </Box>
    );
};
