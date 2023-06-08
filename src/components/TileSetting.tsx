import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import SearchBox from './SearchBox';

interface MyComponentProps {
  isDarkMode: boolean;
  handleTileSettingVisible: () => void;
}

const TileGalleryContents = styled.div`
  /* 스타일 작성 */
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 10px;
  width: 20%;
  height: 100%;
  position: absolute;
  right: 0;
  border-left: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
  padding: 0;
  z-index: 998;
`;

const TileGalleryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 0 10px;
`;

const TileGalleryBody = styled.div`
  margin: 0;
  padding: 0;
  width: 90%;
  height: 70%;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  overflow-y: auto;
`;

const Close = styled(CloseIcon)(({ theme }) => ({
  cursor: 'pointer',
  backgroundColor: theme.bgColor,
  color: theme.textColor,
  '&:hover': {
    backgroundColor: '#a52121',
    color: '#EDECEB',
    transition: 'background-color 0.1s ease-in-out',
    cursor: 'pointer',
  },
  padding: '5px',
}));

const buttonStyle = {
  margin: '20px',
};

const TileSetting = ({ isDarkMode, handleTileSettingVisible }: MyComponentProps) => {
  // 창 닫는 이벤트
  const handleGalleryClose = () => {
    handleTileSettingVisible();
  };

  const handleButtonClick = () => {
    console.log('변경 사항 저장');
  };

  return (
    <TileGalleryContents>
      <TileGalleryHeader>
        <h1>타일 설정</h1>
        <Close onClick={handleGalleryClose} />
      </TileGalleryHeader>
      <p style={{ fontSize: '12px', padding: '0 15px' }}>서버 시간대 변경</p>
      <TileGalleryBody />
      <Button onClick={handleButtonClick} style={buttonStyle} variant="contained" size="small" color="primary">
        변경 사항 저장
      </Button>
    </TileGalleryContents>
  );
};

export default TileSetting;
