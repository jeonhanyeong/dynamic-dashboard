import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mainColor: string;
    bgColor: string;
    textColor: string;
    subColor: string;
    hoverColor: string;
    borderColor: string;
    navHoverColor: string;
    scrollColor: string;
  }
}
