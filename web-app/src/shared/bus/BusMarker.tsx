import React from 'react';

export default class BusMarker extends React.Component {
    render() {
        return (
            <svg>
                <circle cx={50} cy={50} r={10} fill="red" />
            </svg>
        );
    }
}
