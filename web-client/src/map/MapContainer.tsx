import React, { FunctionComponent, useEffect, useState } from 'react';

import { GoogleMap, LoadScript, Polyline, PolylineProps, Marker } from '@react-google-maps/api';

import { useStore } from '../store/Store';
import { Point, Stop, Vehicle } from '../store/Store.Types';

import './MapContainer.scss';
import { getVehicles } from '../store/Service';

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
    const [{ patterns }, { setDragging }] = useStore();
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [lines, setLines] = useState<Line[]>([]);
    const [showStops, setShowStops] = useState<boolean>(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [intervalTimer, setIntervalTimer] = useState<NodeJS.Timer | null>(null);

    useEffect(() => {
        const lines: any[] = [];
        const routes: Set<string> = new Set();

        if (intervalTimer) clearInterval(intervalTimer);

        patterns.forEach((pattern) => {
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

        if (Array.from(routes).length) {
            (async () => {
                const vehicles = await getVehicles(Array.from(routes));
                setVehicles(vehicles);
            })();

            setIntervalTimer(
                setInterval(async () => {
                    const vehicles = await getVehicles(Array.from(routes));
                    setVehicles(vehicles);
                }, 5000),
            );
        } else {
            setVehicles([]);
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
                    {lines.map((line: Line) => (
                        <div key={line.id}>
                            <Polyline path={line.paths} options={{ ...line }} />
                            {showStops &&
                                line.stops.map((stop) => (
                                    <Marker
                                        icon="/stop.svg"
                                        position={{ lat: stop.lat, lng: stop.lng }}
                                        key={`stop-${stop.id}`}
                                    />
                                ))}
                        </div>
                    ))}
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
                </GoogleMap>
            </LoadScript>
        </div>
    );
};
