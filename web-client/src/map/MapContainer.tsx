import { FunctionComponent, useEffect, useState } from 'react';

import { IconButton, useColorMode, useToast, useColorModeValue, Center, Spinner } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Polyline, PolylineProps, Marker } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import { MdMyLocation } from 'react-icons/md';

import { darkStyle, lightStyle } from 'map/Map.Styles';
import { useDataStore } from 'store/data/DataStore';
import { Point, Stop } from 'store/data/DataStore.Types';
import { useSystemStore } from 'store/system/SystemStore';
import { ColorMode } from 'store/system/SystemStore.Types';

import 'map/MapContainer.scss';

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
    const [{ dragging, settings }, { setDragging, setAllowLocation }] = useSystemStore();
    const [{ currentLocation, patterns, vehicles }, { openStop, setCurrentLocation }] = useDataStore();
    const { colorMode } = useColorMode();
    const toast = useToast({
        variant: 'solid',
        position: 'bottom',
    });
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [lines, setLines] = useState<Line[]>([]);
    const [showStops, setShowStops] = useState<boolean>(false);
    const [paths, setPaths] = useState<Point[]>([]);
    const buttonBg = useColorModeValue('white', 'gray.600');

    const mapOptions = {
        disableDefaultUI: true,
        styles: colorMode === ColorMode.Light ? lightStyle : darkStyle,
        maxZoom: 19,
        minZoom: 7,
    };

    const onGetCurrentLocation = () => {
        toast.closeAll();
        toast({ description: t('RETRIEVING_LOCATION'), status: 'info' });

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latLng = { lat: position.coords.latitude, lng: position.coords.longitude };

                setCurrentLocation(latLng);
                setAllowLocation(true);

                if (map) {
                    map.panTo(latLng);
                    map.setZoom(defaultZoom);
                }

                toast.closeAll();
                toast({ description: t('LOCATION_UPDATED'), status: 'success' });
            },
            () => {
                setAllowLocation(false);
                toast.closeAll();
                toast({
                    description: t('RETRIEVE_LOCATION_FAIL'),
                    status: 'warning',
                });
            },
        );
    };

    useEffect(() => {
        onGetCurrentLocation();
    }, []); // eslint-disable-line

    useEffect(() => {
        const lines: any[] = [];

        patterns.forEach(async (pattern) => {
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
                    {settings.allowLocation && <Marker icon="/location.svg" position={currentLocation} />}
                    {vehicles && (
                        <>
                            {vehicles.map((vehicle) => (
                                <Marker
                                    icon={VehicleIconMapper[vehicle.heading]}
                                    position={vehicle.position}
                                    key={vehicle.id}
                                    visible={map?.getBounds()?.contains(vehicle.position)}
                                    zIndex={5}
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
                                        visible={map?.getBounds()?.contains({ lat: stop.lat, lng: stop.lng })}
                                        zIndex={4}
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
