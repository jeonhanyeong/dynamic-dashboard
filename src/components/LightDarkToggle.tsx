import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
// 테마 설정
const darkTheme = {
  backgroundColor: 'black',
  textColor: 'white',
};

const lightTheme = {
  backgroundColor: 'white',
  textColor: 'black',
};

// 스타일링된 컴포넌트
const StyledButton = styled.button`
  color: ${(props) => props.theme.textColor};
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  display: flex;
  align-items: center; /* 아이콘과 텍스트를 수직 가운데 정렬 */
  transition: background-color 0.3s ease;
`;

const LightDarkToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // 다크 모드 상태를 저장하는 상태 변수

  // 테마 토글 함수
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev); // 이전 상태의 반대로 토글
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <StyledButton onClick={toggleTheme}>{isDarkMode ? <Brightness4Icon /> : <Brightness7Icon />}</StyledButton>
    </ThemeProvider>
  );
};

export default LightDarkToggle;
