import styled from 'styled-components';
import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';
import LineChart from '../Cards/LineChart';
import BarChart from '../Cards/BarChart';

interface ComponentPosition {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  display: string;
}

interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  dragTarget: HTMLDivElement | null;
  dragTargetType: string | undefined;
  backgroudVisible: boolean;
  isPreview: boolean;
  selectedTileType: {
    clickedTile: string;
    clickedCount: number;
  };
  handleEditingDashboard: (data: ComponentPosition[]) => void;
}

interface TileGridProps {
  backgroundImage: string | null;
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

const TileGrid = styled.div<TileGridProps>`
  display: block;

  // background-image: url(https://portal.azure.com/Content/Static//MsPortalImpl/General/FlowLayout_gridShadow.png);
  background-image: ${(props) => (props.backgroundImage ? `url(${props.backgroundImage})` : 'none')};
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
  min-height: 89px;
  min-width: 89px;
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

interface resizePosition {
  top: number | undefined;
  left: number | undefined;
  width: number | undefined;
  height: number | undefined;
  display: string;
}

const MIN_SIZE = 90; // 카드 사이즈 조절 최소값
const EditDashboardBody = ({
  dragTarget,
  dragTargetType,
  backgroudVisible,
  isPreview,
  selectedTileType,
  handleEditingDashboard,
}: MyComponentProps) => {
  let draggingTop = 0;
  let draggingLeft = 0;
  let finalResizeWidth = 0;
  let finalResizeHeight = 0;
  const tileGridRef = useRef<HTMLDivElement>(null);
  const dragPlaceholderRef = useRef<HTMLDivElement>(null);
  const resizeCardRef = useRef<HTMLDivElement>(null);

  const [componentPositions, setComponentPositions] = useState<ComponentPosition[]>([]);
  const [placeholderPosition, setPlaceholderPosition] = useState({
    positionTop: 0,
    positionLeft: 0,
    positionWidth: 534,
    positionHeight: 356,
  });
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

  // 랜덤 id(key) 생성
  const generateId = () => {
    const randomString = Math.random().toString(36).substring(2, 7);
    const timestamp = Date.now().toString(36).substring(2, 7);
    return randomString + timestamp;
  };

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
      positionHeight: 355,
      positionWidth: 535,
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
        id: `${generateId()}-${dragTargetType}`,
        top: draggingTop,
        left: draggingLeft,
        width: 535,
        height: 355,
        display: 'block',
      },
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
  const handleMouseDown = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

    const cardInDashboard = target.parentElement as HTMLDivElement;
    const initialTop = parseInt(cardInDashboard.style.top, 10);
    const initialLeft = parseInt(cardInDashboard.style.left, 10);
    const initialWidth = parseInt(cardInDashboard.style.width, 10);
    const initialHeight = parseInt(cardInDashboard.style.height, 10);

    if (target.classList.contains('Card-Cover')) {
      setDragging(true);
      // 드래그오버
      const handleCardDragOver = (moveEvent: DragEvent) => {
        moveEvent.preventDefault();
        draggingLeft = Math.round((moveEvent.clientX - event.clientX) / 90) * 90;
        draggingTop = Math.round((moveEvent.clientY - event.clientY) / 90) * 90;
        cardInDashboard.style.opacity = '0.6';

        const finalTop = initialTop + draggingTop;
        const finalLeft = initialLeft + draggingLeft;
        setPlaceholderPosition((prevDragPosition) => ({
          ...prevDragPosition,
          positionTop: finalTop > 0 ? finalTop : 0,
          positionLeft: finalLeft > 0 ? finalLeft : 0,
          positionWidth: initialWidth,
          positionHeight: initialHeight,
        }));
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
            return {
              ...com,
              top: com.top + draggingTop > 0 ? com.top + draggingTop : 0,
              left: com.left + draggingLeft > 0 ? com.left + draggingLeft : 0,
            };
          }
          return com;
        });
        setDragging(false);
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
    else if (target.classList.contains('resizeHandle')) {
      setDragging(true);

      const downEventClientX = event.clientX;
      const downEventClientY = event.clientY;

      // 기존 카드 display = none
      setComponentPositions(
        componentPositions.map((com) => {
          if (cardInDashboard.className.includes(com.id)) {
            return { ...com, display: 'none' };
          }
          return com;
        }),
      );

      // 라이브프리뷰카드 display: none,
      setResizingComponents((prevSize) => ({
        ...prevSize,
        width: initialWidth,
        height: initialHeight,
        top: initialTop,
        left: initialLeft,
        display: 'block',
      }));
      setPlaceholderPosition((prevDragPosition) => ({
        ...prevDragPosition,
        positionTop: initialTop,
        positionLeft: initialLeft,
        positionWidth: initialWidth,
        positionHeight: initialHeight,
      }));

      const resizeMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        const updatedWidth = Math.round(moveEvent.clientX - downEventClientX);
        const updatedHeight = Math.round(moveEvent.clientY - downEventClientY);
        finalResizeWidth = initialWidth + updatedWidth;
        finalResizeHeight = initialHeight + updatedHeight;

        setResizingComponents((prevSize) => ({
          ...prevSize,
          width: finalResizeWidth,
          height: finalResizeHeight,
        }));

        // 이거 계산해야함
        setPlaceholderPosition((prevDragPosition) => ({
          ...prevDragPosition,
          positionWidth: Math.ceil(finalResizeWidth / 90) * 90 - 4,
          positionHeight: Math.ceil(finalResizeHeight / 90) * 90 - 4,
        }));
      };

      const resizeMouseUp = () => {
        setDragging(false);
        setComponentPositions(
          componentPositions.map((com) => {
            if (cardInDashboard.className.includes(com.id)) {
              return {
                ...com,
                width: Math.ceil(finalResizeWidth / 90) * 90 - 4,
                height: Math.ceil(finalResizeHeight / 90) * 90 - 4,
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
    } else event.preventDefault();
  };

  /* 액션바 함수들 */
  // 1. 컴포넌트 삭제
  const handleDeleteComponent = (event: React.MouseEvent) => {
    const newComponents = componentPositions.filter((com) => !event.currentTarget.className.includes(com.id));
    setComponentPositions(newComponents);
  };

  // 2. 컨텍스트 메뉴
  const handleResizeContext = (name: string, ratioWidth: number, ratioHeight: number) => {
    setComponentPositions(
      componentPositions.map((com) => {
        if (name === com.id) {
          return {
            ...com,
            width: ratioWidth * 89,
            height: ratioHeight * 89,
          };
        }
        return com;
      }),
    );
    setPlaceholderPosition((prevDragPosition) => ({
      ...prevDragPosition,
      positionWidth: ratioWidth * 89,
      positionHeight: ratioHeight * 89,
    }));
  };

  // 대시보드 안의 컴포넌트들
  const dashboardComponents = componentPositions.map((com) => {
    // dragTargetType에 따라 컴포넌트 다르게 해주기
    // 조금더 좋은 코드가 있을텐데 일단 급하니까.
    if (com.id.includes('LineChart')) {
      return (
        <LineChart
          key={com.id}
          name={com.id}
          topPx={com.top}
          leftPx={com.left}
          widthPx={com.width}
          heightPx={com.height}
          displayState={com.display}
          isPreview={isPreview}
          handleDelete={handleDeleteComponent}
          handleContext={handleResizeContext}
        />
      );
    }
    if (com.id.includes('BarChart')) {
      return (
        <BarChart
          key={com.id}
          name={com.id}
          topPx={com.top}
          leftPx={com.left}
          widthPx={com.width}
          heightPx={com.height}
          displayState={com.display}
          isPreview={isPreview}
          handleDelete={handleDeleteComponent}
          handleContext={handleResizeContext}
        />
      );
    }

    return false;
  });

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

  // 타일 갤러리에서 클릭 후 추가 버튼으로 컴포넌트 추가하기
  useEffect(() => {
    if (selectedTileType.clickedTile !== '') {
      setComponentPositions((prevComponentPositions) => [
        ...prevComponentPositions,
        {
          id: `${generateId()}-${selectedTileType.clickedTile}`,
          top: 0,
          left: 0,
          width: 535,
          height: 355,
          display: 'block',
        },
      ]);
    }
  }, [selectedTileType.clickedCount]);

  // 대시보드 컴포넌트가 바뀔때마다 app으로 상태 전송
  useEffect(() => {
    handleEditingDashboard(componentPositions);
  }, [componentPositions]);

  return (
    <EditDashboard>
      <TileGrid
        ref={tileGridRef}
        onMouseDown={isPreview ? undefined : handleMouseDown}
        backgroundImage={
          backgroudVisible
            ? 'https://portal.azure.com/Content/Static//MsPortalImpl/General/FlowLayout_gridShadow.png'
            : null
        }
      >
        {dashboardComponents}

        <TestDiv ref={resizeCardRef} style={resizingComponents}>
          <h2 style={{ textAlign: 'center', marginTop: '30%', color: 'lightgray' }}>Resizing...</h2>
          <ResizeHandle />
        </TestDiv>
        <ResizePlaceHolder style={resizePlaceholder} />
        {dragging && (
          <div
            ref={dragPlaceholderRef}
            className="drag-placeholder"
            style={{
              width: placeholderPosition.positionWidth,
              height: placeholderPosition.positionHeight,
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

export default EditDashboardBody;
