import { FunctionComponent, useState, useEffect } from 'react';

import { Box, PresenceTransition } from 'native-base';
import { useDataStore } from '../store/data/DataStore';
import { useSystemStore } from '../store/system/SystemStore';

interface Props {
    show: boolean;
}

export const Overlay: FunctionComponent<Props> = ({ show }) => {
    return (
        <PresenceTransition
            visible={show}
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 0.4,
                transition: {
                    duration: 250,
                },
            }}
            style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                zIndex: show ? 100 : -1,
            }}
        >
            <Box w="100%" h="100%" bg="gray.900" />
        </PresenceTransition>
    );
};
