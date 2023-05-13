import 'devextreme/dist/css/dx.light.css';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import TileGallery from './components/TileGallery';
import TopNavBar from './components/TopNavBar';
import EditDashboardBody from './components/EditDashboardBody';
import DashboardBody from './components/DashboardBody';
import ModeSetting from './components/ModeSetting';

const WebContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  display: flex;
  flex-direction: column; /* 위에서 아래로 배치 */
  font-size: 13px;
  line-height: normal;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const Contents = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  width: 100%;
`;
const Dashboard = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 0;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
`;

const NoDashboard = styled.div`
  position: absolute;
  width: 200px;
  height: 100px;
  display: flex;
  background-color: red;
`;
interface ComponentPosition {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  display: string;
}

interface LocalStorageData {
  dashboardTitle: string;
  components: ComponentPosition[];
}
const App = () => {
  const parent = useRef<HTMLDivElement>(null);
  const [dragTarget, setDragTarget] = useState<HTMLDivElement | null>(null);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [tileTypes, setTileTypes] = useState(['LineChart', 'BarChart']);
  const [dragTargetType, setDragTargetType] = useState<string | undefined>('');
  const [isEditDashboard, setIsEditDashboard] = useState(false);

  const [selectedTileType, setSelectedTileType] = useState({
    clickedTile: '',
    clickedCount: 0,
  });

  const addToLocalStorage = (key: string, value: LocalStorageData) => {
    // 기존에 저장된 데이터 가져오기
    const existingData = localStorage.getItem(key);

    if (existingData) {
      // 기존 데이터가 존재하는 경우
      const parsedData = JSON.parse(existingData);

      // 새로운 값을 추가
      parsedData.push(value);
      // 변경된 데이터를 문자열로 변환하여 저장
      localStorage.setItem(key, JSON.stringify(parsedData));
    } else {
      // 기존 데이터가 없는 경우, 새로운 배열로 초기화하여 저장
      localStorage.setItem(key, JSON.stringify([value]));
    }
  };

  const handleGalleryVisible = () => {
    setGalleryVisible(!galleryVisible); // 부모 컴포넌트의 상태를 변경
  };

  const handleSettingVisible = () => {
    setSettingVisible(!settingVisible); // 부모 컴포넌트의 상태를 변경
  };

  const handleDragStart = (event: DragEvent) => {
    // console.log(e.target.className);
    const eventTarget = event.target as HTMLDivElement;
    setDragTarget(eventTarget);
    setDragTargetType(tileTypes.find((com) => eventTarget.className.includes(com)));
  };

  const handleAddComponentByClick = (sel: string) => {
    setSelectedTileType((prev) => ({
      ...prev,
      clickedTile: sel,
      clickedCount: prev.clickedCount + 1,
    }));
  };

  const handleOpenEditDashboard = () => {
    setIsEditDashboard(!isEditDashboard);
  };

  // 저장 버튼을 눌렀을 때
  const handleSaveDashboard = (title: string, comp: ComponentPosition[]) => {
    const data = { dashboardTitle: title, components: comp };
    addToLocalStorage('dashboard', data);

    if (galleryVisible) {
      setGalleryVisible(!galleryVisible);
    }
    setIsEditDashboard(!isEditDashboard);
  };

  useEffect(() => {
    const parentComponent = parent.current as HTMLDivElement;
    parentComponent.addEventListener('dragstart', handleDragStart);

    return () => {
      parentComponent.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <WebContainer>
      <TopNavBar handleSettingVisible={handleSettingVisible} />
      <Contents ref={parent}>
        {isEditDashboard ? null : (
          <Dashboard>
            <DashboardBody handleOpenEditDashboard={handleOpenEditDashboard} />
          </Dashboard>
        )}

        {isEditDashboard && (
          <Dashboard>
            <EditDashboardBody
              dragTarget={dragTarget}
              dragTargetType={dragTargetType}
              selectedTileType={selectedTileType}
              handleGalleryVisible={handleGalleryVisible}
              handleOpenEditDashboard={handleOpenEditDashboard}
              handleSaveDashboard={handleSaveDashboard}
            />
          </Dashboard>
        )}
        {galleryVisible && (
          <TileGallery
            tileTypes={tileTypes}
            handleGalleryVisible={handleGalleryVisible}
            handleAddComponentByClick={handleAddComponentByClick}
          />
        )}
        {settingVisible && <ModeSetting />}
      </Contents>
    </WebContainer>
  );
};

export default App;
