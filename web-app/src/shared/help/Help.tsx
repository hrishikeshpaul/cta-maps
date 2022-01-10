import { FunctionComponent } from 'react';

import { Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow } from '@chakra-ui/react';
import { GoInfo as InfoIcon } from 'react-icons/go';

interface Props {
    label: string;
}
export const Help: FunctionComponent<Props> = ({ label }) => {
    return (
        <Popover isLazy lazyBehavior="unmount">
            <PopoverTrigger>
                <span>
                    <InfoIcon />
                </span>
            </PopoverTrigger>
            <PopoverContent boxShadow="xl">
                <PopoverArrow />
                <PopoverBody>{label}</PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
