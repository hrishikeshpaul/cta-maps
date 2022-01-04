import { FunctionComponent } from 'react';

import {
    Box,
    Container,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react';

import { BasePage } from './BasePage';
import { useTranslation } from 'react-i18next';

const faqData = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const FAQ: FunctionComponent = () => {
    const { t } = useTranslation('faq');

    return (
        <BasePage>
            <Container>
                <Heading>{t('FAQ', { ns: 'common' })}</Heading>
                <Accordion mt="6" allowMultiple>
                    {faqData.map((data) => (
                        <AccordionItem key={data}>
                            <AccordionButton py="5">
                                <Box flex="1" textAlign="left" fontWeight="600">
                                    {t(`Q${data}`)}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>{t(`A${data}`)}</AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Container>
        </BasePage>
    );
};
