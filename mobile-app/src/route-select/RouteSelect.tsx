import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import { View, Text } from 'native-base';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSystemStore } from '../store/system/SystemStore';
import { useDataStore } from '../store/data/DataStore';
import { Route } from '../store/data/DataStore.Types';

export const RouteSelect: FunctionComponent = () => {
    const [{ routes: currentRoutes }, { getRoutes }] = useDataStore();
    const [{ routeSelectOpen }, { closeRouteSelect }] = useSystemStore();
    const [routes, setRoutes] = useState<Route[]>([]);
    const refRBSheet = useRef<any>(null);

    useEffect(() => {
        if (routeSelectOpen) {
            refRBSheet.current.open();
            (async () => {})();
        }
    }, [routeSelectOpen]);

    return (
        <View shadow="9">
            <RBSheet
                ref={refRBSheet}
                animationType="slide"
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={600}
                onClose={() => closeRouteSelect()}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'transparent',
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },
                }}
            >
                <Text>hello</Text>
            </RBSheet>
        </View>
    );
};
