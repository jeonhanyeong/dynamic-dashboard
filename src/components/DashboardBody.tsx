import React, { useState, useEffect } from 'react';

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
  handleOpenEditDashboard: () => void;
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

  const handleClickDashboardList = () => {
    setClickedDashboardList(!clickedDashboardList);
  };

  const handleEditClick = () => {
    handleOpenEditDashboard();
  };

  const testDelete = () => {
    localStorage.removeItem('dashboard');
  };

  useEffect(() => {
    const storedData = localStorage.getItem('dashboard');
    setParsedData(storedData ? JSON.parse(storedData) : null);
  }, []);

  return (
    <>
      <ContentTop>
        <DefaultDashboard
          onClick={parsedData ? handleClickDashboardList : undefined}
          style={{ pointerEvents: parsedData ? 'auto' : 'none' }}
        >
          {parsedData ? (
            <>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {parsedData.map((item: LocalStorageType) => item.dashboardTitle)}
              </span>
              <KeyboardArrowDownIcon fontSize="large" />
            </>
          ) : (
            <span style={{ fontSize: '15px' }}>저장된 대시보드가 없습니다.</span>
          )}
        </DefaultDashboard>

        {clickedDashboardList && (
          <DashboardList>
            {parsedData ? (
              parsedData.map((item: LocalStorageType) => (
                <DashboardElement key={item.dashboardTitle}>
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
          <Tool onClick={handleEditClick}>
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
          <Tool>
            <FullscreenIcon color="primary" />
            <span style={{ marginLeft: '5px' }}>전체 화면</span>
          </Tool>
          <Tool onClick={testDelete}>
            <span style={{ marginLeft: '5px' }}>로컬 스토리지삭제(테스트용)</span>
          </Tool>
        </ToolBox>
      </ContentTop>
      <EditDashboard>
        <TileGrid>
          {parsedData
            ? parsedData.map((item: LocalStorageType) => {
                return item.components.map((com: ComponentPosition) => {
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
                });
              })
            : null}
        </TileGrid>
      </EditDashboard>
    </>
  );
};

export default DashboardBody;
