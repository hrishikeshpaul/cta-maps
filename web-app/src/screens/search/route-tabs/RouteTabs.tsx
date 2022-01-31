import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react';

import {
    Tabs as ChakraTabs,
    TabList,
    TabsProps,
    TabPanels,
    Tab as ChakraTab,
    TabPanel,
    useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSystemStore } from 'store/system/SystemStore';
import { SCROLL_THRESHOLD } from 'utils/Constants';

interface RouteTabProps {
    name: string;
    children: ReactNode;
}

export const Tab: FC<RouteTabProps> = ({ children }) => {
    return <>{children}</>;
};

interface RouteTabsProps extends TabsProps {
    children: ReactElement<typeof Tab> | Array<ReactElement<typeof Tab>>;
}

export const Tabs: FC<RouteTabsProps> = ({ children, ...props }) => {
    const { t } = useTranslation();
    const [
        {
            ui: { scrollTop },
        },
    ] = useSystemStore();
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [tabs, setTabs] = useState<Array<ReactElement<typeof Tab>>>([]);
    const bg = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        if (scrollTop > SCROLL_THRESHOLD) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }, [scrollTop]);

    useEffect(() => {
        if (Array.isArray(children)) {
            setTabs(children);
        } else {
            setTabs([children]);
        }
    }, [children]);

    return (
        <ChakraTabs isFitted position="relative" {...props}>
            <TabList
                position="fixed"
                top={!scrolled ? '140px' : '110px'}
                w="100%"
                zIndex={1}
                backgroundColor={bg}
                transition="top 0.2s ease-in-out"
                left="50%"
                transform="translate(-50%)"
                maxW="container.sm"
            >
                {tabs.map(({ props: { name } }) => (
                    <ChakraTab fontSize="sm" fontWeight="600" key={`tab-${name}`}>
                        {t(name)}
                    </ChakraTab>
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
