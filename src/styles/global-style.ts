import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Open Sans', sans-serif;
    margin: 0;
  }

  .os-theme-dark {
    --os-handle-bg: #9278D3;
    --os-handle-bg-hover: #B499E5;
    --os-handle-bg-active: #75BDAE;
  }

`
