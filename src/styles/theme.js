import test from '../assets/images/darkBackgroundImage.png';

export const lightTheme = {
  mainColor: '#1976d2',
  bgColor: '#fff',
  textColor: '#000',
  subColor: '#4EBEF0',
  hoverColor: '#f1f3f5',
  borderColor: 'lightgray',
  navHoverColor: '#3aa0f3',
  scrollColor: '#1976d2',
  backImage: 'url(https://portal.azure.com/Content/Static//MsPortalImpl/General/FlowLayout_gridShadow.png)',
};

export const darkTheme = {
  mainColor: '#252423',
  bgColor: '#1E1F20',
  textColor: '#EDECEB',
  subColor: '#4EBEF0',
  hoverColor: '#3e3d3c',
  borderColor: '#605e5c',
  navHoverColor: '#3e3d3c',
  scrollColor: 'rgba(0, 0, 0, 0.3)',
  backImage: `url(${test})`,
};

export const theme = {
  lightTheme,
  darkTheme,
};

export default theme;
