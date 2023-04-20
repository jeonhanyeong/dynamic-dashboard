import ReactDOM, { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import React, { useState, useEffect, useRef, DragEventHandler } from 'react';
import LineChart from '../Cards/LineChart';

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

const div = document.createElement('div'); // 새로운 div 엘리먼트 생성
div.id = 'dragBackground';
div.style.width = '535px';
div.style.height = '355px';
div.style.backgroundColor = 'rgba(0,0,0,0.3)';
div.style.boxSizing = 'border-box';
div.style.position = 'absolute';

const DashboardBody = () => {
  const tileGridRef = useRef<HTMLDivElement>(null);

  let top = 0;
  let left = 0;
  // 타일에서 대시보드로 끌어올때
  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const tileComponent = tileGridRef.current as HTMLDivElement;
    const { clientX, clientY } = event; // 마우스의 현재 위치 가져오기

    const tileGrid = event.currentTarget as HTMLDivElement;
    const tileGridRect = tileGrid.getBoundingClientRect();

    // 90px 간격으로 맞추고, 마우스 위치와 div 위치를 좀 더 겹치게 하기 위해 90을 빼줌
    top = Math.round((clientY - tileGridRect.top) / 90) * 90;
    left = Math.round((clientX - tileGridRect.left) / 90) * 90;
    div.style.top = `${top}px`; // div의 top 스타일 값을 업데이트
    div.style.left = `${left}px`; // div의 left 스타일 값을 업데이트
    tileComponent.appendChild(div); // drag 할때, div를 body에 추가
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const tileComponent = tileGridRef.current as HTMLDivElement;
    const dragBackground = document.getElementById('dragBackground');
    if (dragBackground !== null) {
      tileComponent.removeChild(dragBackground);
    }

    const chartElement = <LineChart topPx={top} leftPx={left} />;
    ReactDOM.createPortal(chartElement, tileComponent);
    // ReactDOM.render(chartElement, tileComponent);
    // createRoot(tileGridRef).render(<LineChart topPx={0} leftPx={0} />);
    console.log(`Top: ${top}px, Left: ${left}px `);
  };

  return (
    <EditDashboard>
      <TileGrid ref={tileGridRef} onDragOver={handleDragOver} onDrop={handleDrop}>
        <LineChart topPx={405} leftPx={0} />
        <LineChart topPx={top} leftPx={left} />
        <LineChart topPx={top} leftPx={left} />
      </TileGrid>
    </EditDashboard>
  );
};

export default DashboardBody;
