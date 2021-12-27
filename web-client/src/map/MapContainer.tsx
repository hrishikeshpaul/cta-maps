import React, { FunctionComponent, useEffect, useState } from 'react';

import { useToast } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Polyline, PolylineProps, Marker, InfoWindow } from '@react-google-maps/api';

import { getSingleVehicle, getVehicles } from '../store/Service';
import { useStore } from '../store/Store';
import { Point, Stop, Vehicle } from '../store/Store.Types';

import './MapContainer.scss';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 41.88,
    lng: -87.65,
};

const mapOptions = {
    disableDefaultUI: true,
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
        { currentLocation, patterns, vehicleRoutes },
        { setDragging, openStop, setCurrentLocation, setVehicleRoutes },
    ] = useStore();
    const toast = useToast();
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [lines, setLines] = useState<Line[]>([]);
    const [showStops, setShowStops] = useState<boolean>(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [intervalTimer, setIntervalTimer] = useState<NodeJS.Timer | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            },
            () => {
                toast({ description: 'Cannot retrieve your location', status: 'error' });
            },
        );
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
        const okRoutes: Set<string> = new Set();
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
            lines.push(newLine);
        });

        if (routes.size) {
            routes.forEach(async (route) => {
                try {
                    const currentVehicles = await getSingleVehicle(route);

                    updatedVehicles.push(...currentVehicles);
                    setVehicleRoutes(new Set([...Array.from(vehicleRoutes), route]));
                } catch (err: any) {
                    toast({ description: err.response.data, status: 'error' });
                }
            });

            setVehicles(updatedVehicles);
            setVehicleRoutes(okRoutes);
        } else {
            setVehicles([]);
            setVehicleRoutes(new Set());
        }

        setLines(lines);
    }, [patterns]);

    return (
        <div className="map-container">
            <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY!}>
                <GoogleMap
                    onLoad={(map) => {
                        if (map) setMap(map);
                    }}
                    mapContainerStyle={containerStyle}
                    center={center}
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
        </div>
    );
};
