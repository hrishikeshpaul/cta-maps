import Svg, { Path, G, Rect } from 'react-native-svg';
import { StyleSheet } from 'react-native';
import Arrow from './Arrow';

interface Props {
    direction?: number;
}

export default function BusMarker({ direction }: Props) {
    const y = 28.566 + 15.09 / 2;
    const x = 25.614 + 19.066 / 2;
    return (
        <Svg id="n" width="25.614" height="28.566" viewBox="0 0 25.614 28.566">
            <Rect
                id="Rectangle_5"
                data-name="Rectangle 5"
                width="19.066"
                height="15.09"
                transform="translate(3.274 1.562)"
                fill="#cafcfa"
            />
            <Path
                id="Path_4"
                data-name="Path 4"
                d="M1.9,114.495v5.646H.664a.739.739,0,0,1-.664-.8v-4.053a.739.739,0,0,1,.664-.8Z"
                transform="translate(0 -107.003)"
                fill="#2c6bc3"
            />
            <Path
                id="Path_5"
                data-name="Path 5"
                d="M382.022,115.291v4.053a.739.739,0,0,1-.664.8H380.12v-5.646h1.238A.739.739,0,0,1,382.022,115.291Z"
                transform="translate(-356.408 -107.003)"
                fill="#2c6bc3"
            />
            <Path
                id="Path_17"
                data-name="Path 17"
                d="M0,0H1.809V2.131H0Z"
                transform="translate(20.531 18.461)"
                fill="#ffb180"
            />
            <Rect
                id="Rectangle_7"
                data-name="Rectangle 7"
                width="1.809"
                height="2.131"
                transform="translate(3.274 18.461)"
                fill="#ffb180"
            />
            <Path
                id="Path_6"
                data-name="Path 6"
                d="M272.188,261.175v2.131H268.4a2.352,2.352,0,0,1,.521-1.507,1.639,1.639,0,0,1,1.257-.624Z"
                transform="translate(-251.657 -242.714)"
                fill="#fff"
            />
            <Path
                id="Path_7"
                data-name="Path 7"
                d="M85.278,263.306H81.49v-2.131H83.5A1.979,1.979,0,0,1,85.278,263.306Z"
                transform="translate(-76.407 -242.714)"
                fill="#fff"
            />
            <Path
                id="Path_8"
                data-name="Path 8"
                d="M166.368,350.035v.339a1.383,1.383,0,0,1-1.243,1.49h-4.042a1.383,1.383,0,0,1-1.243-1.49v-.339Z"
                transform="translate(-149.869 -324.929)"
                fill="#4d4d4d"
            />
            <Path
                id="Path_9"
                data-name="Path 9"
                d="M317.038,350.035v2.795a.618.618,0,0,1-.555.665h-2.127a.617.617,0,0,1-.555-.665v-2.795Z"
                transform="translate(-294.225 -324.929)"
                fill="#393634"
            />
            <Path
                id="Path_10"
                data-name="Path 10"
                d="M48.157,350.035v2.795a.617.617,0,0,1-.555.665H45.475a.617.617,0,0,1-.555-.665v-2.795Z"
                transform="translate(-42.118 -324.929)"
                fill="#393634"
            />
            <Path
                id="Path_11"
                data-name="Path 11"
                d="M38.422,319.366h0a1.106,1.106,0,0,1-.994,1.191h-21.8a1.106,1.106,0,0,1-.994-1.191h0a1.106,1.106,0,0,1,.994-1.191h21.8A1.106,1.106,0,0,1,38.422,319.366Z"
                transform="translate(-13.72 -295.452)"
                fill="#ccc"
            />
            <Path
                id="Path_12"
                data-name="Path 12"
                d="M52.3,27.443v9.585H30.49V17.473A2.941,2.941,0,0,1,33.132,14.3H49.658A2.941,2.941,0,0,1,52.3,17.473v9.97ZM50.928,34.9V32.766H47.109a1.639,1.639,0,0,0-1.257.624,2.352,2.352,0,0,0-.521,1.507h5.6Zm0-3.939V17.473a1.415,1.415,0,0,0-1.27-1.523H33.132a1.415,1.415,0,0,0-1.27,1.523V30.958ZM33.671,34.9H37.46a1.979,1.979,0,0,0-1.778-2.131h-3.82V34.9Z"
                transform="translate(-28.588 -14.305)"
                fill="#3d7fd9"
            />

            <G id="arrow" transform="translate(4.8 0.026)">
                <Arrow direction={direction || 0} />
                {/* <Path
                    id="Path_18"
                    data-name="Path 18"
                    d="M18,15.662V7.5"
                    transform="translate(-14.595 -7.5)"
                    fill="none"
                    stroke="#c84a44"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                />
                <Path
                    id="Path_19"
                    data-name="Path 19"
                    d="M7.5,11.581,10.9,7.5l3.4,4.081"
                    transform="translate(-7.5 -7.5)"
                    fill="none"
                    stroke="#c84a44"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                /> */}
            </G>
        </Svg>
    );
}
