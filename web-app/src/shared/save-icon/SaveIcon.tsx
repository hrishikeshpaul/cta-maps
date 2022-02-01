import { FC } from 'react';

import { Button, ButtonProps, IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { HeartFillIcon, HeartIcon } from 'utils/Icons';

export enum ButtonMode {
    Full,
    Icon,
}

interface Props extends ButtonProps {
    mode?: ButtonMode;
    isFav: boolean;
}

export const SaveIcon: FC<Props> = ({ isFav, mode = ButtonMode.Icon, onClick }) => {
    const { t } = useTranslation();

    return mode === ButtonMode.Icon ? (
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
