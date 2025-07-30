import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${theme.colors.background};
    font-family: ${theme.fonts.primary};
    color: ${theme.colors.textPrimary};
  }

  * {
    box-sizing: border-box;
  }
`;
