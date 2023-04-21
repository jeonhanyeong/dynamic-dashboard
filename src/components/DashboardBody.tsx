import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useState, useEffect, useRef, HTMLAttributes, useCallback } from 'react';
import LineChart from '../Cards/LineChart';
import BarChart from '../Cards/BarChart';

interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  dragTarget: string;
}

const EditDashboard = styled.div`
  z-index: 990;
  width: 100%;
  height: 100%;
  padding: 16px 40px;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
  display: block;
  flex: 1 1 auto;
  box-sizing: border-box;
`;

const TileGrid = styled.div`
  display: block;

  background-image: url(https://portal.azure.com/Content/Static//MsPortalImpl/General/FlowLayout_gridShadow.png);
  background-attachment: scroll;
  width: 3865px;
  height: 2155px;
  min-width: 3865px;
  min-height: 2155px;
  padding-bottom: 25px;
  padding-right: 25px;
  position: relative;
  background-clip: border-box;
  background-origin: padding-box;
  background-position-x: 0%;
  background-position-y: 0%;
  background-size: auto;
`;

const DashboardBody = ({ dragTarget }: MyComponentProps) => {
  const tileGridRef = useRef<HTMLDivElement>(null);
  const dragPlaceholderRef = useRef<HTMLDivElement>(null);
  let positionTop = 0;
  let positionLeft = 0;
  const [dragPosition, setDragPosition] = useState({ positionTop, positionLeft });
  const [dragging, setDragging] = useState(false);
  const [tiles, setTiles] = useState<JSX.Element[]>([]);

  // 타일을 대시보드로 끌어올 때
  const handleTileDragOver = (event: DragEvent) => {
    event.preventDefault();
    const { clientX, clientY } = event; // 마우스의 현재 위치 가져오기
    const tileGrid = event.currentTarget as HTMLDivElement;
    const tileGridRect = tileGrid.getBoundingClientRect();
    // 90px 간격으로 맞춤
    positionTop = Math.round((clientY - tileGridRect.top) / 90) * 90;
    positionLeft = Math.round((clientX - tileGridRect.left) / 90) * 90;
    setDragPosition({ positionTop, positionLeft });
    setDragging(true);
  };

  // 타일을 대시보드에 놓았을 때
  const handleTileDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    setTiles((prevTiles) => [
      ...prevTiles,
      <LineChart key={prevTiles.length} topPx={positionTop} leftPx={positionLeft} />,
    ]);
  };

  // 타일이 대시보드 밖으로 나갈 때
  const handleTileDragLeave = (event: DragEvent) => {
    event.preventDefault();
    // 드래그가 벗어난 위치의 컴포넌트가 dragPlaceholder와 tileGrid가 아닐 때
    if (event.relatedTarget !== dragPlaceholderRef.current && event.relatedTarget !== tileGridRef.current) {
      setDragging(false);
    }
  };

  const handleCardDragStart = (event: MouseEvent) => {
    console.log('이거');
  };

  const handleCardDrag = (event: MouseEvent) => {
    console.log('해야');
  };

  const handleCardDragEnd = (event: MouseEvent) => {
    console.log('돼 정신차려');
  };

  // 마운트 + dragTarget 변경될 때 마다 실행됨
  useEffect(() => {
    const tileComponent = tileGridRef.current as HTMLDivElement;
    if (dragTarget.includes('Tile')) {
      tileComponent.addEventListener('drop', handleTileDrop);
      tileComponent.addEventListener('dragover', handleTileDragOver);
      tileComponent.addEventListener('dragleave', handleTileDragLeave);
      console.log('타일 드래그');
    } else if (dragTarget.includes('Card')) {
      tileComponent.addEventListener('mousedown', handleCardDragStart);
      tileComponent.addEventListener('mouseup', handleCardDragEnd);
      tileComponent.addEventListener('mousemove', handleCardDrag);

      console.log('카드 드래그');
    } else console.log(dragTarget);

    // Clean Up
    return () => {
      if (dragTarget.includes('Tile')) {
        tileComponent.removeEventListener('dragover', handleTileDragOver);
        tileComponent.removeEventListener('drop', handleTileDrop);
        tileComponent.removeEventListener('dragleave', handleTileDragLeave);
        console.log('타일 드래그 리턴');
      } else {
        tileComponent.removeEventListener('mousedown', handleCardDragStart);
        tileComponent.removeEventListener('mouseup', handleCardDragEnd);
        tileComponent.removeEventListener('mousemove', handleCardDrag);
        console.log('카드 드래그 리턴');
      }
    };
  }, [dragTarget]);

  return (
    <EditDashboard>
      <TileGrid ref={tileGridRef}>
        {tiles}

        {dragging && (
          <div
            ref={dragPlaceholderRef}
            className="drag-placeholder"
            style={{
              width: '535px',
              height: '355px',
              backgroundColor: 'rgba(0,0,0,0.125)',
              boxSizing: 'border-box',
              position: 'absolute',
              top: dragPosition.positionTop,
              left: dragPosition.positionLeft,
            }}
          />
        )}
      </TileGrid>
    </EditDashboard>
  );
};

export default DashboardBody;
