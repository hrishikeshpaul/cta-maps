import { useState, useEffect, useRef, FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';

import { REACT_APP_MAPS_API_KEY } from '@env';
import * as Location from 'expo-location';
import { Box, View, useToast, useColorMode } from 'native-base';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, MapPolylineProps, Polyline } from 'react-native-maps';

import { useDataStore } from '../store/data/DataStore';
import LocationMarker from '../../assets/markers/LocationMarker';
import { Toast } from '../shared/Toast';
import { Point, Stop } from '../store/data/DataStore.Types';
import { useSystemStore } from '../store/system/SystemStore';
import { ColorMode } from '../store/system/SystemStore.Types';

import { darkStyle, lightStyle } from './Map.Styles';

const basePolylineOptions = {
    strokeOpacity: 0.9,
    strokeWeight: 4,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1,
};

interface Line extends MapPolylineProps {
    paths: Point[];
    stops: Stop[];
    id: string;
}

const defaultZoom = 14;

export const Map: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ settings, onCurrentLocationPress }, { setDragging, setAllowLocation, onLocationButtonPress }] =
        useSystemStore();
    const [{ currentLocation, patterns, vehicles }, { openStop, setCurrentLocation }] = useDataStore();
    const { colorMode } = useColorMode();
    const map = useRef<MapView | null>(null);
    const [lines, setLines] = useState<Line[]>([]);
    const [showStops, setShowStops] = useState<boolean>(false);
    const [paths, setPaths] = useState<Point[]>([]);
    const toast = useToast();

    const mapOptions = {
        customMapStyle: colorMode === ColorMode.Light ? lightStyle : darkStyle,
        maxZoomLevel: 19,
        minZoomLevel: 10,
    };

    const onGetCurrentLocation = async () => {
        toast.closeAll();
        toast.show({ description: t('RETRIEVING_LOCATION'), status: 'info' });

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            toast.show({
                render: () => <Toast description={t('RETRIEVE_LOCATION_FAIL')} status="warning" />,
            });
            return;
        }

        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({});

        if (map) {
            map.current?.animateCamera({
                center: {
                    latitude,
                    longitude,
                },
                zoom: defaultZoom,
                pitch: 0,
                heading: 0,
            });
        }

        setCurrentLocation({ lat: latitude, lng: longitude });
        toast.show({ render: () => <Toast description={t('LOCATION_UPDATED')} status="success" /> });
    };

    useEffect(() => {
        (async () => {
            await onGetCurrentLocation();
        })();
    }, []);

    return (
        <Box style={styles.mapContainer}>
            <MapView
                {...mapOptions}
                ref={map}
                style={styles.map}
                key={REACT_APP_MAPS_API_KEY}
                initialRegion={{
                    latitude: currentLocation.lat,
                    longitude: currentLocation.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker coordinate={{ latitude: currentLocation.lat, longitude: currentLocation.lng }}>
                    <View>
                        <LocationMarker />
                    </View>
                </Marker>
            </MapView>
            {/*  */}
        </Box>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        height: '100%',
        width: '100%',
        zIndex: 2,
    },
    map: {
        height: '100%',
        width: '100%',
    },
});
