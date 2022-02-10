import { FunctionComponent, useEffect, useState, useMemo } from 'react';

import { useToast } from '@chakra-ui/react';
import { Polyline, PolylineProps, Marker } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import tinycolor from 'tinycolor2';

import { Map } from 'shared/map/Map';
import { useDataStore } from 'store/data/DataStore';
import { Point, RouteType, Stop } from 'store/data/DataStore.Types';
import { useSystemStore } from 'store/system/SystemStore';
import { ColorMode } from 'store/system/SystemStore.Types';
import { TRAIN_NAME_MAP } from 'utils/Constants';

import './MapContainer.scss';

const defaultZoom = 13;

const basePolylineOptions = {
    strokeOpacity: 0.9,
    strokeWeight: 4,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1,
};

interface Line extends PolylineProps {
    paths: Point[];
    stops: Stop[];
    id: string;
}

export const MapContainer: FunctionComponent = () => {
    const { t } = useTranslation();
    const [{ settings, onCurrentLocationPress }, { setDragging, setAllowLocation, onLocationButtonPress }] =
        useSystemStore();
    const [
        { routes: currentRoutes, currentLocation, patterns, vehicles },
        { openStop, openVehicle, setCurrentLocation },
    ] = useDataStore();
    const toast = useToast();
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [lines, setLines] = useState<Line[]>([]);
    const [showStops, setShowStops] = useState<boolean>(false);
    const [paths, setPaths] = useState<Point[]>([]);

    const vehicleIcon = useMemo<Record<any, any>>(
        () => ({
            [RouteType.Bus]: {
                scale: 12,
                labelOrigin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0),
            },
            [RouteType.Train]: {
                scale: 12,
                labelOrigin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0),
            },
        }),
        [],
    );

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
        if (settings.allowLocation && !Object.keys(currentRoutes).length) {
            onGetCurrentLocation();
        }

        return () => {
            setMap(null);
        };
    }, []); // eslint-disable-line

    useEffect(() => {
        if (onCurrentLocationPress) {
            onGetCurrentLocation();
            onLocationButtonPress(false);
        }
    }, [onCurrentLocationPress]); // eslint-disable-line

    useEffect(() => {
        const lines: any[] = [];

        patterns.forEach(async (pattern) => {
            const newLine = {
                ...basePolylineOptions,
                paths: pattern.paths,
                strokeColor: pattern.strokeColor,
                id: pattern.id,
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

    const getMarkerLabelSize = (label: string) => {
        switch (label.length) {
            case 1:
                return '12px';
            case 2:
                return '11px';
            default:
                return '10px';
        }
    };

    return (
        <div className="map-container">
            <Map
                defaultZoom={defaultZoom}
                onLoad={(map) => {
                    if (map) {
                        setMap(map);
                    }
                }}
                center={currentLocation}
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
                        {vehicles.map((vehicle) => {
                            return (
                                <Marker
                                    onClick={() => openVehicle(vehicle)}
                                    label={{
                                        text:
                                            vehicle.type === RouteType.Train
                                                ? TRAIN_NAME_MAP[vehicle.route]
                                                : vehicle.route,
                                        fontWeight: 'bold',
                                        fontSize: getMarkerLabelSize(vehicle.route),
                                        fontFamily: 'Inter',
                                        color: 'white',
                                    }}
                                    icon={{
                                        path: google.maps.SymbolPath.CIRCLE,
                                        strokeColor:
                                            settings.colorMode === ColorMode.Light
                                                ? tinycolor(vehicle.color).darken(20).toString()
                                                : tinycolor(vehicle.color).lighten(26).toString(),
                                        strokeWeight: 2,
                                        fillOpacity: 1,
                                        fillColor: vehicle.color,
                                        rotation: vehicle.heading,
                                        scale: vehicleIcon[vehicle.type].scale,
                                        anchor: vehicleIcon[vehicle.type].anchor,
                                        labelOrigin: vehicleIcon[vehicle.type].labelOrigin,
                                    }}
                                    position={vehicle.position}
                                    key={vehicle.id}
                                    visible={map?.getBounds()?.contains(vehicle.position)}
                                    zIndex={5}
                                />
                            );
                        })}
                    </>
                )}
                {lines.map((line: Line) => (
                    <div key={line.id}>
                        <Polyline path={line.paths} options={{ ...line }} />
                        {showStops &&
                            line.stops.map((stop) => (
                                <Marker
                                    icon={{
                                        path: google.maps.SymbolPath.CIRCLE,
                                        strokeColor: 'gray',
                                        strokeWeight: 3,
                                        fillColor: 'black',
                                        scale: 6,
                                        fillOpacity: 1,
                                    }}
                                    position={{ lat: stop.lat, lng: stop.lng }}
                                    key={`stop-${stop.id}`}
                                    onClick={() => openStop(stop)}
                                    visible={map?.getBounds()?.contains({ lat: stop.lat, lng: stop.lng })}
                                    zIndex={4}
                                ></Marker>
                            ))}
                    </div>
                ))}
            </Map>
        </div>
    );
};
