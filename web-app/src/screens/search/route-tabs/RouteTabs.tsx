import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react';

import {
    Tabs as ChakraTabs,
    TabList,
    TabPanels,
    Tab as ChakraTab,
    TabPanel,
    useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface RouteTabProps {
    name: string;
    children: ReactNode;
}

export const Tab: FC<RouteTabProps> = ({ children }) => {
    return <>{children}</>;
};

interface RouteTabsProps {
    children: ReactElement<typeof Tab> | Array<ReactElement<typeof Tab>>;
}

export const Tabs: FC<RouteTabsProps> = ({ children }) => {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [tabs, setTabs] = useState<Array<ReactElement<typeof Tab>>>([]);
    const bg = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const scrolled = document.scrollingElement?.scrollTop;
            if (scrolled) {
                if (scrolled > 20) {
                    setScrolled(true);
                } else {
                    setScrolled(false);
                }
            }
        });
    }, []);

    useEffect(() => {
        if (Array.isArray(children)) {
            setTabs(children);
        } else {
            setTabs([children]);
        }
    }, [children]);

    return (
        <ChakraTabs isFitted position="relative">
            <TabList
                position="fixed"
                top={!scrolled ? '144px' : '110px'}
                w="100%"
                zIndex={1}
                backgroundColor={bg}
                transition="all 0.25s ease-in-out"
            >
                {tabs.map((tab) => (
                    <ChakraTab key={`tab-${tab.props.name}`}>{t(tab.props.name)}</ChakraTab>
                ))}
            </TabList>

            <TabPanels px="0" pt="40px">
                {tabs.map(({ props }: any) => (
                    <TabPanel px="0" key={`tab-panel-${props.name}`}>
                        {props.children}
                    </TabPanel>
                ))}
            </TabPanels>
        </ChakraTabs>
    );
};

export const RouteTabs = {
    Tabs,
    Tab,
};
