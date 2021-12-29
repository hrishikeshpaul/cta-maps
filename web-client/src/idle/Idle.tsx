import { FunctionComponent, useEffect, useState } from 'react';

import { useIdleTimer } from 'react-idle-timer';

import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Text,
    useInterval,
} from '@chakra-ui/react';

import { useStore } from '../store/Store';

const ROUTES_RESET_TIME = 120; // in seconds
const IDLE_TIME = 1000 * 60 * 3; // 3 minutes
const DEBOUNCE_TIME = 500; // ms

export const IdleAlert: FunctionComponent = () => {
    const [{ vehicleRoutes, idleAlertOpen }, { closeIdleAlert, openIdleAlert, removeAllRoutes }] = useStore();
    const [start, setStart] = useState<boolean>(false);
    const [time, setTime] = useState<number>(ROUTES_RESET_TIME);
    const { reset, pause, resume } = useIdleTimer({
        timeout: IDLE_TIME,
        onIdle: () => {
            openIdleAlert();
            setStart(true);
        },
        onAction: () => {
            setStart(false);
            setTime(ROUTES_RESET_TIME);
            reset();
        },
        debounce: DEBOUNCE_TIME,
    });

    useInterval(
        () => {
            setTime(time - 1);
        },
        time > 0 ? (start ? 1000 : null) : null,
    );

    useEffect(() => {
        if (time === 0) {
            removeAllRoutes();
        }
    }, [time]); // eslint-disable-line

    useEffect(() => {
        if (vehicleRoutes.size === 0) {
            pause();
        } else {
            resume();
        }
    }, [vehicleRoutes]); // eslint-disable-line

    return (
        <>
            <Modal size="sm" isCentered isOpen={idleAlertOpen} onClose={closeIdleAlert}>
                <ModalOverlay />
                <ModalContent mx="4">
                    <ModalHeader>You've been idle for too long</ModalHeader>
                    <ModalBody>
                        {time ? (
                            <>
                                Due to inactivity, your selected routes will be reset in{' '}
                                <Text as="span" fontWeight="bold">
                                    {time} seconds.
                                </Text>
                            </>
                        ) : (
                            <>Due to inactivity, your selected routes have been reset.</>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button w="100%" colorScheme="green" mr={3} onClick={closeIdleAlert}>
                            {time ? 'Still here' : "I'm back"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
