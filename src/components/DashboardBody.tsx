import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
import LineChart from '../Cards/LineChart';
import BarChart from '../Cards/BarChart';

interface MyComponentProps {
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
  let positionTop = 0;
  let positionLeft = 0;
  const [dragPosition, setDragPosition] = useState({ positionTop, positionLeft });
  const [dragging, setDragging] = useState(false);
  const [tiles, setTiles] = useState<JSX.Element[]>([]);

  // 타일에서 대시보드로 끌어올때
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setDragging(true);
    const { clientX, clientY } = event; // 마우스의 현재 위치 가져오기
    const tileGrid = event.currentTarget as HTMLDivElement;
    const tileGridRect = tileGrid.getBoundingClientRect();

    // 90px 간격으로 맞춤
    positionTop = Math.round((clientY - tileGridRect.top) / 90) * 90;
    positionLeft = Math.round((clientX - tileGridRect.left) / 90) * 90;
    setDragPosition({ positionTop, positionLeft });
  };

  const handleDrop = (event: DragEvent) => {
    setDragging(false);
    // setDragPosition({ positionTop, positionLeft });
    setTiles((prevTiles) => [
      ...prevTiles,
      <LineChart key={prevTiles.length} topPx={positionTop} leftPx={positionLeft} />,
    ]);
  };

  useEffect(() => {
    const tileComponent = tileGridRef.current as HTMLDivElement;

    tileComponent.addEventListener('drop', handleDrop);
    tileComponent.addEventListener('dragover', handleDragOver);

    return () => {
      tileComponent.removeEventListener('dragover', handleDragOver);
      tileComponent.removeEventListener('drop', handleDrop);
    };
  }, [dragTarget]);

  return (
    <EditDashboard>
      <TileGrid ref={tileGridRef}>
        {tiles}

        {dragging && (
          <div
            className="drag-placeholder"
            style={{
              width: '535px',
              height: '355px',
              backgroundColor: 'rgba(0,0,0,0.3)',
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
