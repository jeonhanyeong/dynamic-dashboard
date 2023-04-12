import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import SearchBox from './SearchBox';
import TileCard from './TileCard';

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
const iconStyle = {
  cursor: 'pointer',
};

const buttonStyle = {
  margin: '20px',
};

const TileGallery = () => {
  const [isCloseTile, setIsCloseTile] = useState(false);
  const handleClose = () => {
    setIsCloseTile(true);
  };

  return (
    <TileGalleryContents style={{ display: isCloseTile ? 'none' : 'block' }}>
      <TileGalleryHeader>
        <h2>타일 갤러리</h2>
        <CloseIcon style={iconStyle} onClick={handleClose} />
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
