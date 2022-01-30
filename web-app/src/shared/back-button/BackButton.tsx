import { FC } from 'react';

import { IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { BackIcon } from 'utils/Icons';

interface Props {
    parentRoute: string;
}

export const BackButton: FC<Props> = ({ parentRoute }) => {
    const navigate = useNavigate();

    return (
        <IconButton
            ml="-4"
            fontSize="xl"
            aria-label="back-button"
            variant="ghost"
            onClick={() => navigate(parentRoute)}
            icon={<BackIcon />}
        />
    );
};
