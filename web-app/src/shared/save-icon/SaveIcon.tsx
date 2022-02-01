import { FC } from 'react';

import { Button, ButtonProps, IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { HeartFillIcon, HeartIcon } from 'utils/Icons';

export enum SaveIconMode {
    Full,
    Icon,
}

interface Props extends ButtonProps {
    mode?: SaveIconMode;
    isFav: boolean;
}

export const SaveIcon: FC<Props> = ({ isFav, mode = SaveIconMode.Icon, onClick }) => {
    const { t } = useTranslation();

    return mode === SaveIconMode.Icon ? (
        <IconButton
            fontSize="lg"
            aria-label="save-icon-button"
            icon={isFav ? <HeartFillIcon /> : <HeartIcon />}
            onClick={onClick}
        />
    ) : (
        <Button fontSize="lg" rightIcon={isFav ? <HeartFillIcon /> : <HeartIcon />} onClick={onClick}>
            {isFav ? t('SAVED') : t('SAVE')}
        </Button>
    );
};
