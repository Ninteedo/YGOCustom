import {Theme, ThemeConfig} from "react-select";

export const customSelectTheme: ThemeConfig = (theme: Theme) => ({
  ...theme,
  colors: {
    ...theme.colors,

    // Primary colors
    primary25: '#2A2A35',  // Lightest primary (background highlight)
    primary50: '#3B3B4D',  // Lighter primary (selected item background)
    primary75: '#4D4D66',  // Darker primary (hover state)
    primary: '#5E5E80',    // Primary (interactive elements)

    // Neutral colors
    neutral0: '#1B1B22',   // Background
    neutral5: '#2B2B35',   // Slightly lighter background
    neutral10: '#3C3C48',  // Input background or subtle borders
    neutral20: '#4D4D5A',  // Borders and dividers
    neutral30: '#5E5E70',  // Placeholder text or disabled elements
    neutral40: '#6F6F85',  // Secondary text
    neutral50: '#808098',  // Primary text or icons
    neutral80: '#ECECF1',  // High contrast text (e.g., for light text on dark background)
  },
});
