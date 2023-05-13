import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import SearchBox from './SearchBox';
import TileCard from './TileCard';

interface MyComponentProps {
  handleGalleryVisible: () => void;
  tileTypes: Array<string>;
  handleAddComponentByClick: (sel: string) => void;
}

interface TileProps {
  selected: boolean;
}

const Tile = styled.li<TileProps>`
  display: flex;
  font-size: 13px;
  margin: 0;
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? 'rgba(0, 0, 0, 0.12)' : 'white')};
  &:hover {
    background-color: ${(props) => (!props.selected ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.12)')};
  }
`;

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

const TileGallery = ({ handleGalleryVisible, tileTypes, handleAddComponentByClick }: MyComponentProps) => {
  const [selected, setSelected] = useState<number>(-1);
  // 창 닫는 이벤트
  const handleGalleryClose = () => {
    handleGalleryVisible();
  };

  const handleTileClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const index = parseInt(event.currentTarget.getAttribute('data-index') || '0', 10);

    setSelected(index);
  };

  const handleButtonClick = () => {
    if (selected >= 0) {
      const selectedTileType = tileTypes[selected];
      handleAddComponentByClick(selectedTileType);
    }
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
        {tileTypes.map((tileType, index) => (
          <Tile
            key={tileType}
            className={tileType}
            selected={selected === index}
            onClick={handleTileClick}
            data-index={index}
          >
            <TileCard key={tileType} type={tileType} />
          </Tile>
        ))}
      </TileGalleryBody>
      <Button onClick={handleButtonClick} style={buttonStyle} variant="contained" size="small" color="primary">
        추가
      </Button>
    </TileGalleryContents>
  );
};

export default TileGallery;
