import React, { useState, useEffect, useRef } from 'react';
import { useFullscreen } from 'react-use';
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
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

interface MyComponentProps {
  handleOpenEditDashboard: (editTarget: string | null) => void;
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
  justify-content: start;
`;

const DefaultDashboard = styled.div`
  width: auto;
  height: auto;
  background-color: white;
  padding: 0px 2px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #e1dfdd;
  }
`;

const DashboardList = styled.ul`
  width: 300px;
  height: auto;
  max-height: 100px;
  border: 1px solid #e1dfdd;
  border-radius: 1px;
  background-color: white;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  position: absolute;
  top: 63px;
  z-index: 2000;
`;

const DashboardElement = styled.li`
  height: 20px;
  display: flex;
  align-items: center;
  padding: 5px;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background-color: #f1f3f5;
  }
`;

const ToolBox = styled.div`
  display: flex;
  width: auto;
  height: 30px;
  background-color: white;
  margin-left: 20px;
`;

const Tool = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  width: auto;
  height: 100%;
  padding: 0px 10px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #f1f3f5;
  }
`;
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

  background-color: white;
  width: auto;
  height: auto;
  min-width: 1024px;
  min-height: 768px;
  max-width: 3865px;
  max-height: 2155px;
  padding-bottom: 25px;
  padding-right: 25px;
  position: relative;
  background-clip: border-box;
  background-origin: padding-box;
  background-position-x: 0%;
  background-position-y: 0%;
  background-size: auto;
`;

const DashboardBody = ({ handleOpenEditDashboard }: MyComponentProps) => {
  const [isSaving, setIsSaving] = useState(true);
  const [clickedDashboardList, setClickedDashboardList] = useState(false);
  const [parsedData, setParsedData] = useState<LocalStorageType[]>([]);
  const dashboardListRef = useRef<HTMLUListElement>(null);
  const tileGridRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenButtonClick = () => {
    if (tileGridRef.current) {
      const element = tileGridRef.current as HTMLDivElement;
      if (!isFullscreen) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        }
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }

      setIsFullscreen((prevState) => !prevState);
    }
  };
  const handleClickDashboardList = () => {
    setClickedDashboardList((prevState) => !prevState);
  };

  const handleCreateClick = () => {
    handleOpenEditDashboard(null);
  };

  const handleEditClick = () => {
    handleOpenEditDashboard(parsedData[0].dashboardTitle);
  };

  const testDelete = () => {
    localStorage.removeItem('dashboard');
  };

  const handleMoveToTop = (index: number) => {
    const newParsedData = [...parsedData];
    const itemToMove = newParsedData.splice(index, 1)[0];
    newParsedData.unshift(itemToMove);
    setParsedData(newParsedData);
  };

  const handleClickOutsideDashboardList = (event: MouseEvent) => {
    if (dashboardListRef.current && !dashboardListRef.current.contains(event.target as Node)) {
      setClickedDashboardList(false);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem('dashboard');
    setParsedData(storedData ? JSON.parse(storedData) : null);
    document.addEventListener('mousedown', handleClickOutsideDashboardList);

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDashboardList);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <>
      <ContentTop>
        <DefaultDashboard
          onClick={parsedData && !clickedDashboardList ? handleClickDashboardList : undefined}
          style={{ pointerEvents: parsedData && !clickedDashboardList ? 'auto' : 'none' }}
        >
          {parsedData && parsedData.length > 0 ? (
            <>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{parsedData[0].dashboardTitle}</span>
              <KeyboardArrowDownIcon fontSize="large" />
            </>
          ) : (
            <span style={{ fontSize: '15px' }}>저장된 대시보드가 없습니다.</span>
          )}
        </DefaultDashboard>

        {clickedDashboardList && (
          <DashboardList ref={dashboardListRef}>
            {parsedData ? (
              parsedData.slice(1).map((item: LocalStorageType, index) => (
                <DashboardElement key={item.dashboardTitle} onClick={() => handleMoveToTop(index + 1)}>
                  <ViewCompactIcon />
                  <span style={{ marginLeft: '10px' }}>{item.dashboardTitle}</span>
                </DashboardElement>
              ))
            ) : (
              <span>대시보드 없음</span>
            )}
          </DashboardList>
        )}

        <ToolBox>
          <Tool onClick={handleCreateClick}>
            <AddIcon color="primary" />
            <span style={{ marginLeft: '5px' }}>만들기</span>
          </Tool>
          <Tool onClick={handleEditClick}>
            <EditIcon color="primary" />
            <span style={{ marginLeft: '5px' }}>편집</span>
          </Tool>
          <Tool>
            <DeleteForeverIcon color="primary" />
            <span style={{ marginLeft: '5px' }}>삭제</span>
          </Tool>
          <Tool onClick={handleFullscreenButtonClick}>
            <FullscreenIcon color="primary" />
            <span style={{ marginLeft: '5px' }}>전체 화면</span>
          </Tool>
          <Tool onClick={testDelete}>
            <span style={{ marginLeft: '5px' }}>로컬 스토리지삭제(테스트용)</span>
          </Tool>
        </ToolBox>
      </ContentTop>
      <EditDashboard>
        <TileGrid ref={tileGridRef}>
          {parsedData && parsedData.length > 0
            ? parsedData[0].components.map((com: ComponentPosition) => {
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
                      isPreview={isSaving}
                      handleDelete={null}
                      handleContext={null}
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
                      isPreview={isSaving}
                      handleDelete={null}
                      handleContext={null}
                    />
                  );
                }

                return null;
              })
            : null}
        </TileGrid>
      </EditDashboard>
    </>
  );
};

export default DashboardBody;
