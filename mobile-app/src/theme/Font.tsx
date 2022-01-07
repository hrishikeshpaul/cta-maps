import { useFonts } from 'expo-font';

const fontImports = {
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
};

export const fontConfig = {
    Inter: {
        400: {
            normal: 'Inter-Regular',
            italic: 'Inter-Italic',
        },
        500: {
            normal: 'Inter-Medium',
        },
        600: {
            normal: 'Inter-Medium',
            italic: 'Inter-MediumItalic',
        },
        700: {
            normal: 'Inter-SemiBold',
        },
        800: {
            normal: 'Inter-Bold',
            italic: 'Inter-BoldItalic',
        },
        900: {
            normal: 'Inter-Bold',
            italic: 'Inter-BoldItalic',
        },
    },
};

export const fonts = {
    heading: 'Inter',
    body: 'Inter',
    mono: 'Inter',
};

export const FontProvider = () => {
    const [loaded] = useFonts(fontImports);

    return <></>;
};
