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

const ResizePlaceHolder = styled.div`
  z-index: 1;
  position: absolute;
  background-color: gray;
  box-sizing: border-box;
  opacity: 0.5;
  cursor: se-resize;
`;

const TestDiv = styled.div`
  border: 1px solid #e1dfdd;
  border-radius: 2px;
  z-index: 2;
  position: absolute;
  background-color: white;
  box-sizing: border-box;
  min-height: 90px;
  min-width: 90px;
`;

const ResizeHandle = styled.div`
  height: 10px;
  width: 10px;
  bottom: 5px;
  display: block;
  right: 5px;
  position: absolute;
  cursor: se-resize;
  z-index: 999;
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
`;
interface ComponentPosition {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  display: string;
}

interface resizePosition {
  top: number | undefined;
  left: number | undefined;
  width: number | undefined;
  height: number | undefined;
  display: string;
}

const MIN_SIZE = 90; // 카드 사이즈 조절 최소값
const DashboardBody = ({ dragTarget }: MyComponentProps) => {
  let draggingTop = 0;
  let draggingLeft = 0;
  let ww: number | undefined = 0;
  let hh: number | undefined = 0;
  let finalResizeWidth = 0;
  let finalResizeHeight = 0;
  const tileGridRef = useRef<HTMLDivElement>(null);
  const dragPlaceholderRef = useRef<HTMLDivElement>(null);
  const resizeCardRef = useRef<HTMLDivElement>(null);

  const [componentPositions, setComponentPositions] = useState<ComponentPosition[]>([]);

  const [placeholderPosition, setPlaceholderPosition] = useState({ positionTop: 0, positionLeft: 0 });

  const [dragging, setDragging] = useState(false);

  const [resizingComponents, setResizingComponents] = useState<resizePosition>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    display: 'none',
  });

  const [resizePlaceholder, setResizePlaceholder] = useState<resizePosition>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    display: 'none',
  });

  // 타일을 대시보드로 끌어올 때
  const handleTileDragOver = (event: DragEvent) => {
    event.preventDefault();
    const { clientX, clientY } = event; // 마우스의 현재 위치 가져오기
    const tileGrid = event.currentTarget as HTMLDivElement;
    const tileGridRect = tileGrid.getBoundingClientRect();
    // 90px 간격으로 맞춤
    draggingTop = Math.round((clientY - tileGridRect.top) / 90) * 90;
    draggingLeft = Math.round((clientX - tileGridRect.left) / 90) * 90;
    // 회색배경(placeholder)포지션
    setPlaceholderPosition((prevDragPosition) => ({
      ...prevDragPosition,
      positionTop: draggingTop,
      positionLeft: draggingLeft,
    }));
    setDragging(true);
  };

  // 타일을 대시보드에 놓았을 때
  const handleTileDrop = (event: DragEvent) => {
    // event.preventDefault();
    setDragging(false);
    setComponentPositions((prevComponentPositions) => [
      ...prevComponentPositions,
      {
        id: `line-${prevComponentPositions.length}`,
        top: draggingTop,
        left: draggingLeft,
        width: 535,
        height: 355,
        display: 'block',
      },
    ]);
    console.log('되냐?');
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
  const handleMouseDown = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const cardInDashboard = target.parentElement as HTMLDivElement;

    if (target?.className.includes('Card-Cover')) {
      // 드래그오버
      const handleCardDragOver = (moveEvent: DragEvent) => {
        moveEvent.preventDefault();
        draggingLeft = Math.round((moveEvent.clientX - event.clientX) / 90) * 90;
        draggingTop = Math.round((moveEvent.clientY - event.clientY) / 90) * 90;
        cardInDashboard.style.opacity = '0.6';
      };
      // 드래그리브
      const handleCardDragLeave = () => {
        event.preventDefault();
      };
      // 드랍
      const handleCardDrop = (upEvent: DragEvent) => {
        const upComponent = target.parentElement as HTMLDivElement;
        const updatedComponentPositions = componentPositions.map((com) => {
          if (upComponent.className.includes(com.id)) {
            return { ...com, top: com.top + draggingTop, left: com.left + draggingLeft };
          }
          return com;
        });

        cardInDashboard.style.opacity = '1';
        setComponentPositions(updatedComponentPositions);
        document.removeEventListener('dragover', handleCardDragOver);
        document.removeEventListener('dragleave', handleCardDragLeave);
        document.removeEventListener('drop', handleCardDrop);
      };
      document.addEventListener('dragover', handleCardDragOver);
      document.addEventListener('dragleave', handleCardDragLeave);
      document.addEventListener('drop', handleCardDrop);
    }

    // 리사이즈 핸들일때
    else if (target?.className.includes('resizeHandle')) {
      const downEventClientX = event.clientX;
      const downEventClientY = event.clientY;
      const resizeHandle = event.target as HTMLDivElement;
      const resizeCard = resizeHandle.parentNode as HTMLDivElement;

      const filteredComponent = componentPositions.find((com) => resizeCard.className.includes(com.id));

      setComponentPositions(
        componentPositions.map((com) => {
          if (resizeCard.className.includes(com.id)) {
            return { ...com, display: 'none' };
          }
          return com;
        }),
      );

      setResizingComponents((prevSize) => ({
        ...prevSize,
        width: filteredComponent?.width,
        height: filteredComponent?.height,
        top: filteredComponent?.top,
        left: filteredComponent?.left,
        display: 'block',
      }));

      setResizePlaceholder((prevSize) => ({
        ...prevSize,
        width: filteredComponent?.width,
        height: filteredComponent?.height,
        top: filteredComponent?.top,
        left: filteredComponent?.left,
        display: 'block',
      }));

      ww = filteredComponent?.width;
      hh = filteredComponent?.height;

      const resizeMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        const updatedWidth = Math.round(moveEvent.clientX - downEventClientX);
        const updatedHeight = Math.round(moveEvent.clientY - downEventClientY);
        finalResizeWidth = (ww as number) + updatedWidth;
        finalResizeHeight = (hh as number) + updatedHeight;
        // useState는 가장 최신의 값만 저장
        setResizingComponents((prevSize) => ({
          ...prevSize,
          width: finalResizeWidth,
          height: finalResizeHeight,
        }));
      };

      const resizeMouseUp = () => {
        setComponentPositions(
          componentPositions.map((com) => {
            if (resizeCard.className.includes(com.id)) {
              return {
                ...com,
                width: Math.round(finalResizeWidth / 90) * 90 - 3,
                height: Math.round(finalResizeHeight / 90) * 90 - 3,
                display: 'block',
              };
            }
            return com;
          }),
        );

        setResizingComponents((prevSize) => ({
          ...prevSize,
          display: 'none',
        }));

        setResizePlaceholder((prevSize) => ({
          ...prevSize,
          display: 'none',
        }));

        document.removeEventListener('mousemove', resizeMouseMove);
        document.removeEventListener('mouseup', resizeMouseUp);
      };

      document.addEventListener('mousemove', resizeMouseMove);

      document.addEventListener('mouseup', resizeMouseUp);
    }
    // event.preventDefault();
    else event.preventDefault();
  };

  // 마운트 + dragTarget 변경될 때 마다 실행됨
  useEffect(() => {
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

  // 대시보드 안의 컴포넌트들
  const dashboardComponents = componentPositions.map((com) => (
    <LineChart
      key={com.id}
      name={com.id}
      topPx={com.top}
      leftPx={com.left}
      widthPx={com.width}
      heightPx={com.height}
      displayState={com.display}
    />
  ));
  return (
    <EditDashboard>
      <TileGrid ref={tileGridRef} onMouseDown={handleMouseDown}>
        {dashboardComponents}

        <TestDiv ref={resizeCardRef} style={resizingComponents}>
          <ResizeHandle />
        </TestDiv>
        <ResizePlaceHolder style={resizePlaceholder} />
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
              top: placeholderPosition.positionTop,
              left: placeholderPosition.positionLeft,
            }}
          />
        )}
      </TileGrid>
    </EditDashboard>
  );
};

export default DashboardBody;
