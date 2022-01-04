import { FunctionComponent } from 'react';

import i18next from 'i18next';

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

const faqData = [
    {
        q: 'Q1',
        a: 'A1',
    },
];

export const FAQ: FunctionComponent = () => {
    const { t } = useTranslation('faq');

    return (
        <BasePage>
            <Container height="5000px">
                <Heading>{t('FAQ', { ns: 'common' })}</Heading>
                {/* {loading ? (
                    <Center pt="6">
                        <Spinner />
                    </Center>
                ) : null} */}

                <Accordion mt="6" allowMultiple>
                    {faqData.map((data) => (
                        <AccordionItem key={data.q}>
                            <AccordionButton>
                                <Box flex="1" textAlign="left" fontWeight="600">
                                    {t(data.q)}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>{t(data.a)}</AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Container>
        </BasePage>
    );
};
