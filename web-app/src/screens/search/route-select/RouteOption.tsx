import { ChangeEvent, FunctionComponent } from 'react';

import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Center,
    Divider,
    Flex,
    Switch,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

import { useDataStore } from 'store/data/DataStore';
import { Route, RouteType } from 'store/data/DataStore.Types';

export interface RouteExtended extends Route {
    selected: boolean;
}

interface Props {
    routes: RouteExtended[];
    currentRoute: RouteExtended;
    onChange: (routes: RouteExtended[]) => void;
}

export const RouteOption: FunctionComponent<Props> = ({
    currentRoute: { route, name, color, selected, type, routes: routeDirections },
    routes,
    onChange,
}) => {
    const [, { setRoute, removeRoute }] = useDataStore();
    const routeCardBg = useColorModeValue('#ececec', '#4A5568');

    const onToggle = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const computedRouteIdx = routes.findIndex((r) => r.route === route);

        if (!selected) {
            setRoute({ route, name, color, type });
            if (computedRouteIdx !== -1) {
                const old = [...routes];

                old[computedRouteIdx].selected = true;
                onChange([...old]);
            }
        } else {
            removeRoute(route, type as RouteType);
            if (computedRouteIdx !== -1) {
                const old = [...routes];

                old[computedRouteIdx].selected = false;
                onChange([...old]);
            }
        }
    };

    return (
        <AccordionItem w="100%" borderTop="none" borderBottom="none">
            <AccordionButton as={Box} p="0" justifyContent="space-between" w="100%">
                <Box px="4" pr="2" _active={{ bg: routeCardBg }} w="100%">
                    <Flex justifyContent="space-between" alignItems="center" py="3">
                        <Flex alignItems="center" overflow="hidden" w="100%">
                            <Center h="40px" w="40px" bg={color} borderRadius="md" flexShrink="0">
                                {type === RouteType.Bus && (
                                    <Text color="white" fontWeight="bold">
                                        {route}
                                    </Text>
                                )}
                            </Center>
                            <Text px="4" isTruncated fontWeight={500}>
                                {name}
                            </Text>
                        </Flex>
                        <Switch
                            flexShrink="0"
                            colorScheme="red"
                            name="switch"
                            size="lg"
                            isChecked={selected}
                            onChange={onToggle}
                        />
                        <AccordionIcon opacity="0.75" ml="2" flexShrink="0" />
                    </Flex>
                </Box>
            </AccordionButton>
            <AccordionPanel>Hello</AccordionPanel>
            <Divider opacity="0.1" />
        </AccordionItem>
    );
};
