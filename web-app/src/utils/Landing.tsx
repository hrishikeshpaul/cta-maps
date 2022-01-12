import { FunctionComponent } from 'react';

import { Avatar, Center, Text, Fade, Spinner } from '@chakra-ui/react';

export const Landing: FunctionComponent = () => {
    return (
        <>
            <Center h="100%" w="100%" flexDirection="column" textAlign="center">
                <Fade in={true}>
                    <Avatar src="/logo.svg" size="xl" />
                    <Text fontSize="xl" pt="2" fontWeight="bold">
                        trackCTA
                    </Text>
                    <Text fontSize="sm">v1.4.0-alpha</Text>
                    <Spinner mt="4" size="md" color="blue.300" />
                </Fade>
            </Center>
        </>
    );
};
