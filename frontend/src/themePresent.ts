import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const ThemePresent = definePreset(Aura, {
    semantic: {
        primary: {
            0: '#ffffff',
            50: '#F7F2EE',
            100: '#E7D9CF',
            200: '#D8C1B0',
            300: '#C9A992',
            400: '#BA9173',
            500: '#AB7854',
            600: '#8C6345',
            700: '#6F4E37',
            800: '#4F3727',
            900: '#302218',
            950: '#110C08',
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#EDEAE9',
                    100: '#DBD6D3',
                    200: '#CAC2BD',
                    300: '#B9AEA8',
                    400: '#A89B93',
                    500: '#473124',
                    600: '#3B291F',
                    700: '#2F211A',
                    800: '#231A15',
                    900: '#19120E',
                    950: '#0B0705',
                }
            },
        }

    }
});

export default ThemePresent;