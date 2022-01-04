import { FunctionComponent, useEffect } from 'react';

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

export const FAQ: FunctionComponent = () => {
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            i18next.loadNamespaces('faq', (err, t) => {
                console.log(t);
            });
        })();
    }, []);

    return (
        <BasePage>
            <Container height="5000px">
                <Heading>{t('FAQ')}</Heading>
                <Accordion mt="6" allowMultiple>
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left" fontWeight="600">
                                    Section 1 title
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat.
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Container>
        </BasePage>
    );
};
