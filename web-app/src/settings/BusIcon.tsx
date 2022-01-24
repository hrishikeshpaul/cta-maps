import { FC } from 'react';

import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue } from '@chakra-ui/react';

import { CircleIcon, DownIcon, LocationArrowIcon } from 'utils/Icons';
import { useSystemStore } from 'store/system/SystemStore';
import { BusIconType } from 'store/system/SystemStore.Types';

const menuItemClass = { alignItems: 'center', justifyContent: 'space-between', display: 'flex' };

export const BusIcon: FC = () => {
    const [{ settings }, { setBusIcon }] = useSystemStore();
    const selectedBg = useColorModeValue('blue.100', 'blue.400');
    const bg = useColorModeValue('gray.50', 'gray.600');

    const setBg = (icon: BusIconType): string => (settings.busIcon === icon ? selectedBg : 'inherit');

    return (
        <Menu isLazy autoSelect={false}>
            <MenuButton
                as={Button}
                bg="transparent"
                transition="all 0.2s"
                borderRadius="md"
                borderWidth="1px"
                fontWeight="500"
                _active={{ bg }}
                rightIcon={<DownIcon />}
            >
                <Text d="flex" alignItems="center" textTransform="capitalize">
                    {settings.busIcon}
                </Text>
            </MenuButton>
            <MenuList>
                <MenuItem
                    {...menuItemClass}
                    bg={setBg(BusIconType.Circle)}
                    onClick={() => setBusIcon(BusIconType.Circle)}
                >
                    Circle <CircleIcon size="16pt" />
                </MenuItem>
                <MenuItem
                    {...menuItemClass}
                    bg={setBg(BusIconType.Arrow)}
                    onClick={() => setBusIcon(BusIconType.Arrow)}
                >
                    Pointer <LocationArrowIcon size="16pt" />
                </MenuItem>
            </MenuList>
        </Menu>
    );
};
