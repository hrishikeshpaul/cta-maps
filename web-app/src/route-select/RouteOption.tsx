import { Box, Center, Divider, Flex, Switch, Text, useColorModeValue } from '@chakra-ui/react';
import { ChangeEvent, FunctionComponent } from 'react';
import { useDataStore } from 'store/data/DataStore';
import { Route } from 'store/data/DataStore.Types';
import { useSystemStore } from 'store/system/SystemStore';

export interface RouteExtended extends Route {
    selected: boolean;
}

interface Props {
    routes: RouteExtended[];
    currentRoute: RouteExtended;
    onChange: (routes: RouteExtended[]) => void;
    setInspectorData: (route: Route) => void;
}

export const RouteOption: FunctionComponent<Props> = ({
    currentRoute: { route, name, color, selected },
    routes,
    onChange,
    setInspectorData,
}) => {
    const [, { setRoute, removeRoute }] = useDataStore();
    const [, { openInspector }] = useSystemStore();
    const routeCardBg = useColorModeValue('#ececec', '#4A5568');

    const onToggle = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const computedRouteIdx = routes.findIndex((r) => r.route === route);

        if (!selected) {
            setRoute({ route, name, color });
            if (computedRouteIdx !== -1) {
                const old = [...routes];

                old[computedRouteIdx].selected = true;
                onChange([...old]);
            }
        } else {
            removeRoute(route);
            if (computedRouteIdx !== -1) {
                const old = [...routes];

                old[computedRouteIdx].selected = false;
                onChange([...old]);
            }
        }
    };

    return (
        <Box px="4" _active={{ bg: routeCardBg }}>
            <Flex justifyContent="space-between" alignItems="center" py="3">
                <Flex
                    alignItems="center"
                    overflow="hidden"
                    w="100%"
                    onClick={() => {
                        setInspectorData({ route, color, name });
                        openInspector();
                    }}
                >
                    <Center h="40px" w="40px" bg={color} borderRadius="md">
                        <Text color="white" fontWeight="bold">
                            {route}
                        </Text>
                    </Center>
                    <Text px="4" isTruncated fontWeight={500}>
                        {name}
                    </Text>
                </Flex>
                <Switch name="switch" size="lg" isChecked={selected} onChange={onToggle} />
            </Flex>
            <Divider />
        </Box>
    );
};
