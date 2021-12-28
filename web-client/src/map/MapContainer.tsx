import React, { FunctionComponent, useEffect, useState } from 'react';

import { IconButton, useColorMode, useToast } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Polyline, PolylineProps, Marker } from '@react-google-maps/api';
import { MdMyLocation } from 'react-icons/md';

import { darkStyle, lightStyle } from './Map.Styles';
import { getSingleVehicle, getVehicles } from '../store/Service';
import { useStore } from '../store/Store';
import { Point, Stop, Vehicle, ColorMode } from '../store/Store.Types';

import './MapContainer.scss';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const basePolylineOptions = {
    strokeOpacity: 0.9,
    strokeWeight: 4,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1,
};

const VehicleIconMapper = {
    N: '/bus-north.svg',
    S: '/bus-south.svg',
    W: '/bus-west.svg',
    E: '/bus-east.svg',
};

interface Line extends PolylineProps {
    paths: Point[];
    stops: Stop[];
    id: string;
}

export const MapContainer: FunctionComponent = () => {
    const [
        { currentLocation, patterns, vehicleRoutes, dragging },
        { setDragging, openStop, setCurrentLocation, setVehicleRoutes },
    ] = useStore();
    const { colorMode } = useColorMode();
    const toast = useToast({
        variant: 'solid',
        position: 'bottom',
    });
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [lines, setLines] = useState<Line[]>([]);
    const [showStops, setShowStops] = useState<boolean>(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [intervalTimer, setIntervalTimer] = useState<NodeJS.Timer | null>(null);
    const [paths, setPaths] = useState<Point[]>([]);

    const mapOptions = {
        disableDefaultUI: true,
        styles: colorMode === ColorMode.Light ? lightStyle : darkStyle,
    };

    useEffect(() => {
        onGetCurrentLocation();
    }, []);

    useEffect(() => {
        if (vehicleRoutes.size) {
            if (intervalTimer) clearInterval(intervalTimer);

            setIntervalTimer(
                setInterval(async () => {
                    const vehicles = await getVehicles(Array.from(vehicleRoutes));
                    setVehicles(vehicles);
                }, 5000),
            );
        }
    }, [vehicleRoutes]);

    useEffect(() => {
        const lines: any[] = [];
        const routes: Set<string> = new Set();
        const updatedVehicles: Vehicle[] = [];

        setVehicles([]);

        patterns.forEach(async (pattern) => {
            routes.add(pattern.route);
            const newLine = {
                ...basePolylineOptions,
                paths: pattern.paths,
                strokeColor: pattern.strokeColor,
                id: pattern.pid,
                stops: pattern.stops,
            };

            setPaths([...paths, ...pattern.paths]);
            lines.push(newLine);
        });

        if (routes.size) {
            routes.forEach(async (route) => {
                try {
                    const currentVehicles = await getSingleVehicle(route);

                    updatedVehicles.push(...currentVehicles);
                    setVehicleRoutes(new Set([...Array.from(vehicleRoutes), route]));
                } catch (err: any) {
                    toast.closeAll();
                    toast({ description: err.response.data, status: 'error' });
                }
            });

            setVehicles(updatedVehicles);
        } else {
            setVehicles([]);
            setVehicleRoutes(new Set());
            if (intervalTimer) clearInterval(intervalTimer);
        }

        setLines(lines);
    }, [patterns]);

    useEffect(() => {
        if (map) {
            const bounds = new google.maps.LatLngBounds();
            paths.forEach((path) => {
                bounds.extend({ lat: path.lat, lng: path.lng });
            });
            map.fitBounds(bounds);
        }
    }, [paths]);

    const onGetCurrentLocation = () => {
        toast({
            description: 'Retrieving current location...',
            status: 'warning',
        });

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latLng = { lat: position.coords.latitude, lng: position.coords.longitude };

                setCurrentLocation(latLng);

                if (map) {
                    map.panTo(latLng);
                }

                toast.closeAll();
                toast({ description: 'Current location updated', status: 'success' });
            },
            () => {
                toast.closeAll();
                toast({
                    description: 'Could not retrieve location',
                    status: 'error',
                });
            },
        );
    };

    return (
        <div className="map-container">
            <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY!}>
                <GoogleMap
                    onLoad={(map) => {
                        if (map) setMap(map);
                    }}
                    mapContainerStyle={containerStyle}
                    center={currentLocation}
                    zoom={13}
                    options={mapOptions}
                    clickableIcons={false}
                    onDragStart={() => setDragging(true)}
                    onDragEnd={() => setDragging(false)}
                    onZoomChanged={() => {
                        if (map) {
                            const zoom = map.getZoom();
                            if (zoom! >= 15) setShowStops(true);
                            else setShowStops(false);
                        }
                    }}
                >
                    {currentLocation && <Marker icon="/location.svg" position={currentLocation} />}
                    {vehicles && (
                        <>
                            {vehicles.map((vehicle) => (
                                <Marker
                                    icon={VehicleIconMapper[vehicle.heading]}
                                    position={vehicle.position}
                                    key={vehicle.id}
                                />
                            ))}
                        </>
                    )}
                    {lines.map((line: Line) => (
                        <div key={line.id}>
                            <Polyline path={line.paths} options={{ ...line }} />
                            {showStops &&
                                line.stops.map((stop) => (
                                    <Marker
                                        icon="/stop.svg"
                                        position={{ lat: stop.lat, lng: stop.lng }}
                                        key={`stop-${stop.id}`}
                                        onClick={() => openStop(stop)}
                                    ></Marker>
                                ))}
                        </div>
                    ))}
                </GoogleMap>
            </LoadScript>
            <IconButton
                aria-label="my-location"
                icon={<MdMyLocation />}
                position="fixed"
                top="72px"
                right="16px"
                bg="white"
                boxShadow="lg"
                _hover={{ bg: 'white' }}
                onClick={onGetCurrentLocation}
                opacity={dragging ? '0.25' : '1'}
            />
        </div>
    );
};
