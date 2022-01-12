import { FC } from 'react';

import { Badge, Box, Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { BottomSheet } from 'shared/bottom-sheet/BottomSheet';
import { useDataStore } from 'store/data/DataStore';
import { DownIcon } from 'utils/Icons';

interface VehicleInfoProps {
    label: string;
    data: string;
}

export const VehicleDrawer: FC = () => {
    const { t } = useTranslation();
    const [{ vehicle }, { closeVehicle }] = useDataStore();

    const VehicleInfo: FC<VehicleInfoProps> = ({ data, label }) => {
        return (
            <Box>
                <Text fontSize="sm" fontWeight="700" opacity={0.8}>
                    {label}
                </Text>
                <Text fontSize="md" fontWeight="600" pt="2">
                    {data}
                </Text>
            </Box>
        );
    };

    return (
        <BottomSheet.Wrapper isOpen={!!vehicle} onClose={closeVehicle} zIndex={1500}>
            <BottomSheet.Header>
                <Flex justifyContent="space-between" alignItems="center">
                    <Flex alignItems="center">
                        <Text fontWeight="bold" fontSize="2xl">
                            {vehicle?.id}
                        </Text>
                        <Badge ml="3" colorScheme={vehicle?.delayed ? 'orange' : 'green'}>
                            {vehicle?.delayed ? t('DELAYED') : t('ON_TIME')}
                        </Badge>
                    </Flex>

                    <IconButton
                        variant="ghost"
                        fontSize="2xl"
                        aria-label="close"
                        mr="-3"
                        onClick={closeVehicle}
                        icon={<DownIcon />}
                    />
                </Flex>
            </BottomSheet.Header>
            <BottomSheet.Body>
                <Stack spacing="4" p="4">
                    <VehicleInfo label={t('ROUTE')} data={vehicle?.route || ''} />
                    <VehicleInfo label={t('DESTINATION')} data={vehicle?.destination || ''} />
                </Stack>
            </BottomSheet.Body>
        </BottomSheet.Wrapper>
    );
};
