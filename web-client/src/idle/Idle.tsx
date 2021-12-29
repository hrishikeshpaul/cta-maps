import { FunctionComponent, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
                    <ModalHeader>{t('INACTIVITY')}</ModalHeader>
                    <ModalBody>
                        {time ? (
                            <>
                                {t('INACTIVE_TIMER_MESSAGE')}{' '}
                                <Text as="span" fontWeight="bold">
                                    {time} {t('SECONDS')}.
                                </Text>
                            </>
                        ) : (
                            <>{t('INACTIVE_MESSAGE')}</>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button w="100%" colorScheme="green" mr={3} onClick={closeIdleAlert}>
                            {time ? t('STILL_HERE') : t('I_BACK')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
