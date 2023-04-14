import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import SearchBox from './SearchBox';
import TileCard from './TileCard';

type MyComponentProps = {
  handleGalleryVisible: () => void;
};

const TileGalleryContents = styled.div`
  /* 스타일 작성 */
  background-color: #fff;
  color: #000;
  padding: 10px;
  width: 20%;
  height: 100%;
  position: absolute;
  right: 0;
  border-left: 1px solid lightgray;
  padding: 0;
  z-index: 998;
`;

const TileGalleryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 10px;
`;

const TileGalleryBody = styled.ul`
  margin: 0;
  padding: 0;
  width: 90%;
  height: 70%;

  overflow-y: auto;
`;

const buttonStyle = {
  margin: '20px',
};

const Close = styled(CloseIcon)(({ theme }) => ({
  cursor: 'pointer',
  backgroundColor: '#fff',
  color: '#000',
  '&:hover': {
    backgroundColor: '#a52121',
    color: '#fff',
    transition: 'background-color 0.3s ease-in-out',
    cursor: 'pointer',
  },
  padding: '5px',
}));

const TileGallery = ({ handleGalleryVisible }: MyComponentProps) => {
  // 창 닫는 이벤트
  const handleGalleryClose = () => {
    handleGalleryVisible();
  };

  return (
    <TileGalleryContents>
      <TileGalleryHeader>
        <h1>타일 갤러리</h1>
        <Close onClick={handleGalleryClose} />
      </TileGalleryHeader>
      <p style={{ fontSize: '12px', padding: '0 15px' }}>타일을 끌어서 놓거나 선택한 후 추가를 클릭하세요.</p>
      <SearchBox />
      <TileGalleryBody>
        <TileCard />
        <TileCard />
        <TileCard />
        <TileCard />
        <TileCard />
        <TileCard />
        <TileCard />
        <TileCard />
        <TileCard />
      </TileGalleryBody>
      <Button style={buttonStyle} variant="contained" size="small" color="primary">
        추가
      </Button>
    </TileGalleryContents>
  );
};

export default TileGallery;
