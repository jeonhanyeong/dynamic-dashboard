import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useState, useEffect, useRef, HTMLAttributes, useCallback } from 'react';
import LineChart from '../Cards/LineChart';
import BarChart from '../Cards/BarChart';

interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  dragTarget: HTMLDivElement | null;
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
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [clicked, setClicked] = useState(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [mouseDownTarget, setMouseDownTarget] = useState<HTMLDivElement | null>(null);
  const [timerId, setTimerId] = useState<number | undefined>(undefined);

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
  // 타일 안에 있는 카드 드래그해서 이동시키기
  // 이거 해결해야함 무조건

  const handleCardMouseDown = (event: React.MouseEvent) => {
    //  event.preventDefault(); // 기본 기능 막기(?)
    const target = event.target as HTMLElement;
    const cardInDashboard = target.parentElement as HTMLDivElement;
    if (cardInDashboard?.className.includes('Card')) {
      setClicked(true);
      setOffset({ x: event.clientX, y: event.clientY });
      setMouseDownTarget(cardInDashboard);
    } else event.preventDefault();
  };

  const handleCardDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (clicked && mouseDownTarget?.className.includes('Card')) {
      const x = Math.round((event.clientX - offset.x) / 90) * 90;
      const y = Math.round((event.clientY - offset.y) / 90) * 90;
      mouseDownTarget.style.opacity = '0.6';
      setPosition({ x, y });

      window.clearTimeout(timerId);
      setTimerId(undefined);
      const timer = window.setTimeout(() => {
        const cardInDashboardTop = mouseDownTarget.style.top;
        const cardInDashboardLeft = mouseDownTarget.style.left;
        mouseDownTarget.style.top = `${parseInt(cardInDashboardTop, 10) + position.y}px`;
        mouseDownTarget.style.left = `${parseInt(cardInDashboardLeft, 10) + position.x}px`;
        mouseDownTarget.style.opacity = '1';
      }, 100);
      setTimerId(timer);
    }
  };

  const handleCardDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setClicked(false);
  };

  const handleCardDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    console.log(event.relatedTarget);
  };

  // 마운트 + dragTarget 변경될 때 마다 실행됨
  useEffect(() => {
    console.log(dragTarget);

    const tileComponent = tileGridRef.current as HTMLDivElement;

    if (dragTarget?.className.includes('Tile')) {
      tileComponent.addEventListener('dragover', handleTileDragOver);
      tileComponent.addEventListener('drop', handleTileDrop);
      tileComponent.addEventListener('dragleave', handleTileDragLeave);
    }

    // Clean Up
    return () => {
      tileComponent.removeEventListener('dragover', handleTileDragOver);
      tileComponent.removeEventListener('drop', handleTileDrop);
      tileComponent.removeEventListener('dragleave', handleTileDragLeave);
    };
  }, [dragTarget]);

  return (
    <EditDashboard>
      <TileGrid
        ref={tileGridRef}
        onMouseDown={handleCardMouseDown}
        onDragOver={handleCardDragOver}
        onDrop={handleCardDrop}
        onDragLeave={handleCardDragLeave}
      >
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
