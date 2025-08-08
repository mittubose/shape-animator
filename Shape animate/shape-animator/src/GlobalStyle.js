import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.colors.background};
    font-family: ${({ theme }) => theme.fonts.primary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  * {
    box-sizing: border-box;
  }
`;
