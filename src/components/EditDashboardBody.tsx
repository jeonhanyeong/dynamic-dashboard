import styled from 'styled-components';
import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';
import Button from '@mui/material//Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import LineChart from '../Cards/LineChart';
import BarChart from '../Cards/BarChart';
import MonthlyActiveUser from '../Cards/MonthlyActiveUser';
import ActiveUsers from '../Cards/ActiveUsers';
import UserList from '../Cards/UserList';
import ServerTime from '../Cards/ServerTime';
import { AutoMoving, ResizeAutoMoving } from '../functions/AutoMoving';

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
  selectedTileType: {
    clickedTile: string;
    clickedCount: number;
  };
  editTarget: string | null;
  handleGalleryVisible: () => void;
  handleOpenDashboard: () => void;
  handleSaveDashboard: (title: string, components: ComponentPosition[]) => void;
  handleEditSaveDashboard: (editTarget: string, title: string, components: ComponentPosition[]) => void;
  handleIsPreview: () => void;
}

interface TileGridProps {
  backgroundImage: string | null;
}
interface LocalStorageType {
  dashboardTitle: string;
  components: ComponentPosition[];
}

const ContentTop = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  width: 100%;
  height: 50px;
  padding: 0 25px 0 40px;
  margin-top: 20px;
  box-sizing: border-box;
  justify-content: space-between;
`;
const Explain = styled.div`
  width: 100%;
  height: 20px;
  padding: 0 0 0 40px;
  box-sizing: border-box;
  display: block;
`;

const btnStyle = {
  marginRight: '10px',
};

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
  min-height: 85px;
  min-width: 85px;
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

interface PositionInterface {
  positionTop: number;
  positionLeft: number;
  positionWidth: number;
  positionHeight: number;
}

const EditDashboardBody = ({
  dragTarget,
  dragTargetType,
  selectedTileType,
  editTarget,
  handleGalleryVisible,
  handleOpenDashboard,
  handleSaveDashboard,
  handleEditSaveDashboard,
  handleIsPreview,
}: MyComponentProps) => {
  let draggingTop = 0;
  let draggingLeft = 0;
  let heightOfType = 0;
  let WidthOfType = 0;
  let finalResizeWidth = 0;
  let finalResizeHeight = 0;
  const dashboardTitleRef = useRef<HTMLInputElement>(null);
  const tileGridRef = useRef<HTMLDivElement>(null);
  const dragPlaceholderRef = useRef<HTMLDivElement>(null);
  const resizeCardRef = useRef<HTMLDivElement>(null);
  const previewDashboardTitleRef = useRef<HTMLDivElement>(null);

  const [autoMovingClickedElement, setAutoMovingClickedElement] = useState<HTMLDivElement | null | undefined>();

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [clickPreview, setClickPreview] = useState(true);
  const [dashboardTitle, setDashboardTitle] = useState('제목 없음');
  const [componentPositions, setComponentPositions] = useState<ComponentPosition[]>([]);
  const [placeholderPosition, setPlaceholderPosition] = useState<PositionInterface>({
    positionTop: 0,
    positionLeft: 0,
    positionWidth: 445,
    positionHeight: 267,
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

  const [initialPosition, setInitialPosition] = useState<PositionInterface>();
  const [initialComponentPosition, setInitialComponentPosition] = useState<ComponentPosition[]>([]);

  const galleryOpen = () => {
    handleGalleryVisible();
  };

  const handlePreviewClick = () => {
    if (clickPreview) {
      const title = dashboardTitleRef.current as HTMLInputElement | null;
      if (title) {
        setClickPreview((prevClick) => !prevClick);
        handleIsPreview();
        setDashboardTitle(title.value);
      }
    } else {
      const title = dashboardTitleRef.current as HTMLInputElement;
      if (title) {
        title.value = dashboardTitle;
      }
      setClickPreview((prevClick) => !prevClick);
      handleIsPreview();
    }
  };

  const handleCancleClick = () => {
    handleOpenDashboard();
  };

  const handleSaveClick = () => {
    handleSaveDashboard(dashboardTitle, componentPositions);
  };

  const handleEditSaveClick = () => {
    // console.log(editTarget);
    if (editTarget !== null) {
      handleEditSaveDashboard(editTarget, dashboardTitle, componentPositions);
    }
  };

  // 랜덤 id(key) 생성
  const generateId = () => {
    const randomString = Math.random().toString(36).substring(2, 7);
    const timestamp = Date.now().toString(36).substring(2, 7);
    return randomString + timestamp;
  };

  // 동적 대시보드 위치 조절 함수
  // 맥시멈(일단 처음에 보여지는 화면 크기(타일갤러리 제외)) = left: 900, top: 360
  // 수정1) 현재는 placeholder의 위치에 대해서만 컴포넌트의 위치가 변경이 됌
  // 수정2_Todo) placeholder의 위치와 다른 컴포넌트의 위치도 감지해서 안겹치게 이동해야됌(최종)
  const autoArrangeElements = (elements: ComponentPosition[], placeholder: PositionInterface) => {
    setComponentPositions(AutoMoving(elements, placeholder, autoMovingClickedElement));
    ResizeAutoMoving();
  };

  // 타일을 대시보드로 끌어올 때
  const handleTileDragOver = (event: DragEvent) => {
    event.preventDefault();
    setAutoMovingClickedElement(dragTarget);
    const { clientX, clientY } = event; // 마우스의 현재 위치 가져오기
    const tileGrid = event.currentTarget as HTMLDivElement;
    const tileGridRect = tileGrid.getBoundingClientRect();
    // 90px 간격으로 맞춤
    draggingTop = Math.round((clientY - tileGridRect.top) / 90) * 90;
    draggingLeft = Math.round((clientX - tileGridRect.left) / 90) * 90;

    if (
      dragTarget?.className.includes('MAU by month in the last 5 months') ||
      dragTarget?.className.includes('Number of connections by application in the last 20 days')
    ) {
      heightOfType = 355;
      WidthOfType = 535;
    } else if (
      dragTarget?.className.includes('Active Users') ||
      dragTarget?.className.includes('Monthly Active User')
    ) {
      heightOfType = 175;
      WidthOfType = 265;
    } else if (dragTarget?.className.includes('Server Time')) {
      heightOfType = 175;
      WidthOfType = 265;
    } else {
      heightOfType = 265;
      WidthOfType = 445;
    }
    // 회색배경(placeholder)포지션
    setPlaceholderPosition((prevDragPosition) => ({
      ...prevDragPosition,
      positionTop: draggingTop,
      positionLeft: draggingLeft,
      positionHeight: heightOfType,
      positionWidth: WidthOfType,
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
        width: WidthOfType,
        height: heightOfType,
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
  const handleMouseDown = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

    const cardInDashboard = target.parentElement as HTMLDivElement;

    setAutoMovingClickedElement(cardInDashboard);
    const initialTop = parseInt(cardInDashboard.style.top, 10);
    const initialLeft = parseInt(cardInDashboard.style.left, 10);
    const initialWidth = parseInt(cardInDashboard.style.width, 10);
    const initialHeight = parseInt(cardInDashboard.style.height, 10);

    if (target.classList.contains('Card-Cover')) {
      setDragging(true);

      const to = initialTop;
      const le = initialLeft;
      const ar = componentPositions;

      setPlaceholderPosition((prevDragPosition) => ({
        ...prevDragPosition,
        positionTop: initialTop,
        positionLeft: initialLeft,
        positionWidth: initialWidth,
        positionHeight: initialHeight,
      }));

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

        if (finalTop === to && finalLeft === le) {
          setComponentPositions(ar);
        }
      };

      // 드래그리브
      const handleCardDragLeave = () => {
        event.preventDefault();
      };
      // 드랍
      const handleCardDrop = (upEvent: DragEvent) => {
        setDragging(false);
        cardInDashboard.style.opacity = '1';
        setComponentPositions((prevComponentPositions) => {
          const update = prevComponentPositions.map((com) => {
            if (cardInDashboard.className.includes(com.id)) {
              return {
                ...com,
                top: com.top + draggingTop > 0 ? com.top + draggingTop : 0,
                left: com.left + draggingLeft > 0 ? com.left + draggingLeft : 0,
              };
            }
            return com;
          });

          return update;
        });
        // setComponentPositions(updatedComponentPositions);
        document.removeEventListener('dragover', handleCardDragOver);
        document.removeEventListener('dragleave', handleCardDragLeave);
        document.removeEventListener('drop', handleCardDrop);
      };

      const mup = () => {
        setDragging(false);
        setAutoMovingClickedElement(null);
        document.removeEventListener('dragover', handleCardDragOver);
        document.removeEventListener('dragleave', handleCardDragLeave);
        document.removeEventListener('drop', handleCardDrop);
        document.removeEventListener('mouseup', mup);
      };

      document.addEventListener('dragover', handleCardDragOver);
      document.addEventListener('dragleave', handleCardDragLeave);
      document.addEventListener('drop', handleCardDrop);
      document.addEventListener('mouseup', mup);
    }

    // 리사이즈 핸들일때
    else if (target.classList.contains('resizeHandle')) {
      setDragging(true);
      console.log(initialWidth);
      console.log(initialHeight);
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

        setPlaceholderPosition((prevDragPosition) => ({
          ...prevDragPosition,
          positionWidth: Math.ceil(finalResizeWidth / 90) * 90 - 5,
          positionHeight: Math.ceil(finalResizeHeight / 90) * 90 - 5,
        }));
      };

      const resizeMouseUp = () => {
        setDragging(false);
        setComponentPositions((prevComponentPositions) => {
          const update = prevComponentPositions.map((com) => {
            if (cardInDashboard.className.includes(com.id)) {
              return {
                ...com,
                width: Math.ceil(finalResizeWidth / 90) * 90 - 5,
                height: Math.ceil(finalResizeHeight / 90) * 90 - 5,
                display: 'block',
              };
            }
            return com;
          });

          return update;
        });
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
    // 근데 조금더 좋은 코드가 있을거같음
    if (com.id.includes('Active Users')) {
      return (
        <ActiveUsers
          key={com.id}
          name={com.id}
          topPx={com.top}
          leftPx={com.left}
          widthPx={com.width}
          heightPx={com.height}
          displayState={com.display}
          isPreview={!clickPreview}
          handleDelete={handleDeleteComponent}
          handleContext={handleResizeContext}
        />
      );
    }
    if (com.id.includes('Monthly Active User')) {
      return (
        <MonthlyActiveUser
          key={com.id}
          name={com.id}
          topPx={com.top}
          leftPx={com.left}
          widthPx={com.width}
          heightPx={com.height}
          displayState={com.display}
          isPreview={!clickPreview}
          handleDelete={handleDeleteComponent}
          handleContext={handleResizeContext}
        />
      );
    }
    if (com.id.includes('User List')) {
      return (
        <UserList
          key={com.id}
          name={com.id}
          topPx={com.top}
          leftPx={com.left}
          widthPx={com.width}
          heightPx={com.height}
          displayState={com.display}
          isPreview={!clickPreview}
          handleDelete={handleDeleteComponent}
          handleContext={handleResizeContext}
        />
      );
    }
    if (com.id.includes('Server Time')) {
      return (
        <ServerTime
          key={com.id}
          name={com.id}
          topPx={com.top}
          leftPx={com.left}
          widthPx={com.width}
          heightPx={com.height}
          displayState={com.display}
          isPreview={!clickPreview}
          handleDelete={handleDeleteComponent}
          handleContext={handleResizeContext}
        />
      );
    }

    if (com.id.includes('Number of connections by application in the last 20 days')) {
      return (
        <LineChart
          key={com.id}
          name={com.id}
          topPx={com.top}
          leftPx={com.left}
          widthPx={com.width}
          heightPx={com.height}
          displayState={com.display}
          isPreview={!clickPreview}
          handleDelete={handleDeleteComponent}
          handleContext={handleResizeContext}
        />
      );
    }
    if (com.id.includes('MAU by month in the last 5 months')) {
      return (
        <BarChart
          key={com.id}
          name={com.id}
          topPx={com.top}
          leftPx={com.left}
          widthPx={com.width}
          heightPx={com.height}
          displayState={com.display}
          isPreview={!clickPreview}
          handleDelete={handleDeleteComponent}
          handleContext={handleResizeContext}
        />
      );
    }

    return false;
  });

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

  // 카드 자동 위치 조정
  useEffect(() => {
    if (componentPositions.length > 0) {
      autoArrangeElements(componentPositions, placeholderPosition);
    }
  }, [placeholderPosition]);

  // 타일 갤러리에서 클릭 후 추가 버튼으로 컴포넌트 추가하기
  useEffect(() => {
    if (selectedTileType.clickedTile !== '') {
      if (
        selectedTileType.clickedTile === 'MAU by month in the last 5 months' ||
        selectedTileType.clickedTile === 'Number of connections by application in the last 20 days'
      ) {
        heightOfType = 355;
        WidthOfType = 535;
      } else if (
        selectedTileType.clickedTile === 'Active Users' ||
        selectedTileType.clickedTile === 'Monthly Active User'
      ) {
        heightOfType = 175;
        WidthOfType = 265;
      } else if (selectedTileType.clickedTile === 'Server Time') {
        heightOfType = 175;
        WidthOfType = 265;
      } else {
        heightOfType = 265;
        WidthOfType = 445;
      }
      setComponentPositions((prevComponentPositions) => [
        ...prevComponentPositions,
        {
          id: `${generateId()}-${selectedTileType.clickedTile}`,
          top: 0,
          left: 0,
          width: WidthOfType,
          height: heightOfType,
          display: 'block',
        },
      ]);
    }
  }, [selectedTileType.clickedCount]);

  useEffect(() => {
    if (editTarget !== '' && editTarget !== null) {
      setIsEditingMode(true);
      const storedData = localStorage.getItem('dashboard');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const targetDashboard = parsedData.find((item: LocalStorageType) => item.dashboardTitle === editTarget);
        setDashboardTitle(targetDashboard.dashboardTitle);
        setComponentPositions(targetDashboard.components);
      }
    } else {
      setIsEditingMode(false);
    }
  }, [editTarget]);

  return (
    <>
      <ContentTop>
        <div style={{ display: 'flex' }}>
          {clickPreview ? (
            <TextField
              inputRef={dashboardTitleRef}
              placeholder="제목 없음"
              variant="outlined"
              value={dashboardTitle}
              onChange={(event) => setDashboardTitle(event.target.value)}
              size="small"
              InputProps={{
                style: {
                  height: '30px',
                  fontSize: '15px',
                  marginRight: '10px',
                },
              }}
            />
          ) : (
            <div
              ref={previewDashboardTitleRef}
              style={{
                height: '30px',
                marginRight: '10px',
                width: '220px',
                textOverflow: 'ellipsis',
                fontSize: '20px',
                fontWeight: 'bold',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {dashboardTitle}
            </div>
          )}

          <Button
            style={btnStyle}
            variant="contained"
            color="primary"
            size="small"
            onClick={isEditingMode ? handleEditSaveClick : handleSaveClick}
          >
            저장
          </Button>
          <Button style={btnStyle} variant="outlined" size="small" onClick={handlePreviewClick}>
            {clickPreview ? '미리보기' : '편집'}
          </Button>
          <Button style={btnStyle} variant="outlined" size="small" onClick={handleCancleClick}>
            취소
          </Button>
          {clickPreview && (
            <Button
              style={btnStyle}
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              size="small"
              onClick={galleryOpen}
            >
              갤러리 열기
            </Button>
          )}
        </div>
      </ContentTop>
      <Explain>
        {clickPreview ? (
          <span>타일을 크기 조정하거나 이동 또는 편집하거나 대시보드에 추가할 수 있습니다.</span>
        ) : (
          <span>미리보기 화면입니다.</span>
        )}
      </Explain>
      <EditDashboard>
        <TileGrid
          ref={tileGridRef}
          onMouseDown={clickPreview ? handleMouseDown : undefined}
          backgroundImage={
            clickPreview
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
                border: '1px solid #e1dfdd',
                boxShadow: '0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108)',
                top: placeholderPosition.positionTop,
                left: placeholderPosition.positionLeft,
              }}
            />
          )}
        </TileGrid>
      </EditDashboard>
    </>
  );
};

export default EditDashboardBody;
