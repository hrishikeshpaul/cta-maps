import { FC, useState } from 'react';

import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';

import { CircleIcon, DownIcon, LocationArrowIcon } from 'utils/Icons';
import { useSystemStore } from 'store/system/SystemStore';
import { BusIconType } from 'store/system/SystemStore.Types';

const menuItemClass = { alignItems: 'center', justifyContent: 'space-between', display: 'flex' };

export const BusIcon: FC = () => {
    const [{ settings }, { setBusIcon }] = useSystemStore();

    const setBg = (icon: BusIconType): string => (settings.busIcon === icon ? 'blue.400' : 'inherit');

    return (
        <Menu isLazy autoSelect={false}>
            <MenuButton
                as={Button}
                bg="transparent"
                transition="all 0.2s"
                borderRadius="md"
                borderWidth="1px"
                fontWeight="500"
                _focus={{ boxShadow: 'outline' }}
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
