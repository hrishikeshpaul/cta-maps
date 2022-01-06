import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { REACT_APP_MAPS_API_KEY } from '@env';
import * as Location from 'expo-location';
import { Box, View, useToast } from 'native-base';
import MapView, { Marker } from 'react-native-maps';

import { useDataStore } from '../store/data/DataStore';
import LocationMarker from '../../assets/markers/Location';

export const Map = () => {
    const [{ currentLocation }, { setCurrentLocation }] = useDataStore();
    const toast = useToast();

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                toast.show({ description: 'Location could not be retrieved...', status: 'warning' });
                return;
            }

            const {
                coords: { latitude, longitude },
            } = await Location.getCurrentPositionAsync({});

            setCurrentLocation({ lat: latitude, lng: longitude });
            toast.show({ description: 'Location updated...', status: 'success' });
        })();
    }, []);

    return (
        <Box style={styles.mapContainer}>
            <MapView
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
        </Box>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    map: {
        height: '100%',
        width: '100%',
    },
});
