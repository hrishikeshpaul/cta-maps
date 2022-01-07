import { useState, useEffect, useRef, FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';

import { REACT_APP_MAPS_API_KEY } from '@env';
import * as Location from 'expo-location';
import { Box, View, useToast, useColorMode } from 'native-base';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, MapPolylineProps, Polyline, LatLng } from 'react-native-maps';

import { useDataStore } from '../store/data/DataStore';
import LocationMarker from '../../assets/markers/LocationMarker';
import { Toast } from '../shared/Toast';
import { Point, Stop } from '../store/data/DataStore.Types';
import { useSystemStore } from '../store/system/SystemStore';
import { ColorMode } from '../store/system/SystemStore.Types';

import { darkStyle, lightStyle } from './Map.Styles';
import StopMarker from '../../assets/markers/StopMarker';

import RBush, { BBox } from 'rbush';

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

class MyRBush extends RBush<Stop> {
    toBBox([x, y]: any) {
        return { minX: x, minY: y, maxX: x, maxY: y };
    }
    compareMinX(a: any, b: any) {
        return a.x - b.x;
    }
    compareMinY(a: any, b: any) {
        return a.y - b.y;
    }
}

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
    const [tree, setTree] = useState<MyRBush>([] as any);
    const [viewPort, setViewPort] = useState<Point[]>([]);
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
        const stops: Stop[] = [];

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
                stops.push(...pattern.stops);
            }
        });
        const t = new RBush<Stop>();
        t.load(stops);
        setTree(t);
        setLines(lines);
    }, [patterns]);

    useEffect(() => {
        if (map) {
            map.current?.fitToCoordinates(paths, { animated: true });
        }
    }, [paths]); // eslint-disable-line

    const isInside = (x: number, y: number, z1: number, z2: number, z3: number, z4: number) => {
        const x1 = Math.min(z1, z3);
        const x2 = Math.max(z1, z3);
        const y1 = Math.min(z2, z4);
        const y2 = Math.max(z2, z4);
        if (x1 <= x && x <= x2 && y1 <= y && y <= y2) {
            return true;
        } else {
            return false;
        }
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
                onRegionChangeComplete={(region) => {
                    if (region.latitudeDelta !== deltas.latitudeDelta) {
                        const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
                        if (zoom! >= 15) {
                            setShowStops(true);
                            setViewPort([
                                {
                                    latitude: region.latitude + region.latitudeDelta / 2,
                                    longitude: region.longitude - region.longitudeDelta / 2,
                                },
                                {
                                    latitude: region.latitude - region.latitudeDelta / 2,
                                    longitude: region.longitude + region.longitudeDelta / 2,
                                },
                            ]);
                        } else setShowStops(false);
                    }
                }}
            >
                {lines.map((line: Line) => (
                    <Box key={line.id}>
                        <Polyline coordinates={line.paths} strokeColor={line.strokeColor} strokeWidth={6} zIndex={9} />
                        {showStops &&
                            line.stops.map((stop) => {
                                const [topLeft, bottomRight] = viewPort;
                                if (
                                    isInside(
                                        stop.latitude,
                                        stop.longitude,
                                        topLeft.latitude,
                                        topLeft.longitude,
                                        bottomRight.latitude,
                                        bottomRight.longitude,
                                    )
                                ) {
                                    return (
                                        <Marker
                                            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                                            key={`stop-${stop.id}-${line.id}`}
                                            // onClick={() => openStop(stop)}
                                            zIndex={10}
                                        >
                                            {/* <View>
                                                <StopMarker />
                                            </View> */}
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
