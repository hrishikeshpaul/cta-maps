import { FunctionComponent, useEffect, useState } from 'react';

import { IconButton, useColorMode, useToast, useColorModeValue, Center, Spinner } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Polyline, PolylineProps, Marker } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import { MdMyLocation } from 'react-icons/md';

import { darkStyle, lightStyle } from './Map.Styles';
import { getSingleVehicle, getVehicles } from '../store/Service';
import { useStore } from '../store/Store';
import { Point, Stop, Vehicle, ColorMode } from '../store/Store.Types';

import './MapContainer.scss';

const defaultZoom = 13;

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
    N: 'bus/n.svg',
    NE: 'bus/ne.svg',
    NW: 'bus/nw.svg',
    S: 'bus/s.svg',
    SE: 'bus/se.svg',
    SW: 'bus/sw.svg',
    W: 'bus/w.svg',
    E: 'bus/e.svg',
};

interface Line extends PolylineProps {
    paths: Point[];
    stops: Stop[];
    id: string;
}

export const MapContainer: FunctionComponent = () => {
    const { t } = useTranslation();
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
    const buttonBg = useColorModeValue('white', 'gray.600');

    const mapOptions = {
        disableDefaultUI: true,
        styles: colorMode === ColorMode.Light ? lightStyle : darkStyle,
    };

    const onGetCurrentLocation = () => {
        toast.closeAll();
        toast({ description: t('RETRIEVING_LOCATION'), status: 'info' });

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latLng = { lat: position.coords.latitude, lng: position.coords.longitude };

                setCurrentLocation(latLng);

                if (map) {
                    map.panTo(latLng);
                    map.setZoom(defaultZoom);
                }

                toast.closeAll();
                toast({ description: t('LOCATION_UPDATED'), status: 'success' });
            },
            () => {
                toast.closeAll();
                toast({
                    description: t('RETRIEVE_LOCATION_FAIL'),
                    status: 'error',
                });
            },
        );
    };

    useEffect(() => {
        onGetCurrentLocation();
    }, []); // eslint-disable-line

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
    }, [vehicleRoutes]); // eslint-disable-line

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

            setPaths((p) => [...p, ...pattern.paths]);
            lines.push(newLine);
        });

        console.log({ routes });

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
    }, [paths]); // eslint-disable-line

    return (
        <div className="map-container">
            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY!}
                loadingElement={
                    <Center h="100%">
                        <Spinner color="blue.300" />
                    </Center>
                }
            >
                <GoogleMap
                    onLoad={(map) => {
                        if (map) setMap(map);
                    }}
                    mapContainerStyle={containerStyle}
                    center={currentLocation}
                    zoom={defaultZoom}
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
                                    zIndex={5}
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
                                        zIndex={4}
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
                bg={buttonBg}
                boxShadow="lg"
                onClick={onGetCurrentLocation}
                opacity={dragging ? '0.25' : '1'}
            />
        </div>
    );
};
