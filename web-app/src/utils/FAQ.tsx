import { FunctionComponent } from 'react';

import {
    Box,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Link,
    Text,
} from '@chakra-ui/react';

import { BasePage } from 'utils/BasePage';
import { useTranslation } from 'react-i18next';

const faqData = [1, 2, 3, 4, 5, 6, 7, 8];

export const FAQ: FunctionComponent = () => {
    const { t } = useTranslation('faq');

    return (
        <BasePage>
            <Heading fontWeight="bold">{t('FAQ', { ns: 'common' })}</Heading>
            <Accordion mt="8" allowMultiple>
                {faqData.map((data) => (
                    <AccordionItem key={data}>
                        <AccordionButton py="5">
                            <Box flex="1" textAlign="left" fontWeight="600" fontSize="lg">
                                {t(`Q${data}`)}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>{t(`A${data}`)}</AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
            <Text mt="6">
                Please reach out to us{' '}
                <Link fontWeight="bold" colorScheme="blue">
                    here
                </Link>{' '}
                if you have any further questions.
            </Text>
        </BasePage>
    );
};
