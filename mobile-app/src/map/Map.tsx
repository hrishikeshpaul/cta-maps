import { useState, useEffect, useRef, FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';

import { REACT_APP_MAPS_API_KEY } from '@env';
import * as Location from 'expo-location';
import { Box, View, useToast, useColorMode } from 'native-base';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';

import { useDataStore } from '../store/data/DataStore';
import { Toast } from '../shared/Toast';
import { Point, Stop } from '../store/data/DataStore.Types';
import { useSystemStore } from '../store/system/SystemStore';
import { ColorMode } from '../store/system/SystemStore.Types';

import { darkStyle, lightStyle } from './Map.Styles';
import StopMarker from '../../assets/markers/StopMarker';
import BusMarker from '../../assets/markers/BusMarker';

interface Line {
    paths: Point[];
    stops: Stop[];
    id: number;
    strokeColor: string;
}

const defaultZoom = 14;
const deltas = {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export const Map: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ settings, onCurrentLocationPress }, { setDragging, setAllowLocation, onLocationButtonPress }] =
        useSystemStore();
    const [{ currentLocation, patterns, vehicles }, { openStop, setCurrentLocation }] = useDataStore();
    const { colorMode } = useColorMode();
    const [lines, setLines] = useState<Line[]>([]);
    const [showStops, setShowStops] = useState<boolean>(false);
    const [paths, setPaths] = useState<Point[]>([]);
    const [viewPort, setViewPort] = useState<Point[]>([]);
    const map = useRef<MapView | null>(null);

    const toast = useToast();

    const mapOptions = {
        customMapStyle: colorMode === ColorMode.Light ? lightStyle : darkStyle,
        maxZoomLevel: 19,
        minZoomLevel: 10,
    };

    const onGetCurrentLocation = async () => {
        toast.closeAll();
        toast.show({
            render: () => <Toast description={t('RETRIEVING_LOCATION')} status="warning" />,
        });

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

        setCurrentLocation({ latitude, longitude });
        toast.show({ render: () => <Toast description={t('LOCATION_UPDATED')} status="success" /> });
    };

    useEffect(() => {
        (async () => {
            await onGetCurrentLocation();
        })();
    }, []); // eslint-disable-line

    useEffect(() => {
        if (onCurrentLocationPress) {
            onGetCurrentLocation();
            onLocationButtonPress(false);
        }
    }, [onCurrentLocationPress]);

    useEffect(() => {
        const lines: Line[] = [];

        patterns.forEach(async (pattern) => {
            if (pattern.paths) {
                const newLine: Line = {
                    paths: pattern.paths,
                    strokeColor: pattern.strokeColor,
                    id: pattern.pid,
                    stops: pattern.stops,
                };

                setPaths((p) => [...p, ...pattern.paths]);
                lines.push(newLine);
            }
        });
        setLines(lines);
    }, [patterns]);

    useEffect(() => {
        if (map) {
            map.current?.fitToCoordinates(paths, { animated: true });
        }
    }, [paths]); // eslint-disable-line

    const isInside = (x: number, y: number, northEast: LatLng, southWest: LatLng) => {
        const { latitude: neX, longitude: neY } = northEast;
        const { latitude: swX, longitude: swY } = southWest;

        return Math.min(neX, swX) <= x && x <= Math.max(neX, swX) && Math.min(neY, swY) <= y && y <= Math.max(neY, swY);
    };

    return (
        <Box style={styles.mapContainer}>
            <MapView
                {...mapOptions}
                ref={map}
                style={styles.map}
                key={REACT_APP_MAPS_API_KEY}
                initialRegion={{
                    ...currentLocation,
                    ...deltas,
                }}
                showsMyLocationButton={false}
                showsCompass={false}
                showsUserLocation
                followsUserLocation
                onRegionChangeComplete={async (region) => {
                    if (map) {
                        const { northEast, southWest } = await map.current!.getMapBoundaries();

                        setViewPort([northEast, southWest]);
                    }

                    if (region.latitudeDelta !== deltas.latitudeDelta) {
                        const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
                        if (zoom! >= 15) {
                            setShowStops(true);
                        } else setShowStops(false);
                    }
                }}
            >
                {vehicles && (
                    <>
                        {vehicles.map((vehicle) => {
                            const [northEast, southWest] = viewPort;
                            const { latitude, longitude } = vehicle.position;
                            return (
                                northEast &&
                                southWest &&
                                isInside(latitude, longitude, northEast, southWest) && (
                                    <Marker coordinate={vehicle.position} key={vehicle.id} zIndex={11}>
                                        <View>
                                            <BusMarker direction={vehicle.headingNum} />
                                        </View>
                                    </Marker>
                                )
                            );
                        })}
                    </>
                )}

                {lines.map((line: Line) => (
                    <Box key={line.id}>
                        <Polyline coordinates={line.paths} strokeColor={line.strokeColor} strokeWidth={6} zIndex={9} />
                        {showStops &&
                            line.stops.map((stop) => {
                                const [northEast, southWest] = viewPort;
                                if (
                                    northEast &&
                                    northEast &&
                                    isInside(stop.latitude, stop.longitude, northEast, southWest)
                                ) {
                                    return (
                                        <Marker
                                            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                                            key={`stop-${stop.id}-${line.id}`}
                                            onPress={() => openStop(stop)}
                                            zIndex={10}
                                        >
                                            <View>
                                                <StopMarker />
                                            </View>
                                        </Marker>
                                    );
                                }
                            })}
                    </Box>
                ))}
            </MapView>
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
