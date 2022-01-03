import { FunctionComponent, useEffect, useState } from 'react';

import { Avatar, Center, Text, Fade, Spinner } from '@chakra-ui/react';

import { getVersion } from 'store/system/SystemService';

export const Landing: FunctionComponent = () => {
    const [version, setVersion] = useState<string>('');

    useEffect(() => {
        (async () => {
            try {
                const data = await getVersion();
                setVersion(data);
            } catch (err: any) {
                console.log(err.response);
            }
        })();
    }, []);
    
    return (
        <>
            <Center h="100%" w="100%" flexDirection="column" textAlign="center">
                <Fade in={true}>
                    <Avatar src="/logo.svg" size="xl" />
                    <Text fontSize="xl" pt="2" fontWeight="bold">
                        CTA Maps
                    </Text>
                        <Text fontSize="sm">{version}</Text>
                    <Spinner mt="4" size="md" color="blue.300" />
                </Fade>
            </Center>
        </>
    );
};
