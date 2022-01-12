import { FC } from 'react';

import { IconButton } from '@chakra-ui/react';

import { HeartFillIcon, HeartIcon } from 'utils/Icons';

interface Props {
    isFav: boolean;
    ariaLabel: string;
    onClick: () => void;
}

export const FavoriteIcon: FC<Props> = ({ isFav, ariaLabel, onClick }) => {
    return <IconButton aria-label={ariaLabel} icon={isFav ? <HeartFillIcon /> : <HeartIcon />} onClick={onClick} />;
};
