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

interface TileInfo {
  title: string;
  description: string;
}
const App = () => {
  const parent = useRef<HTMLDivElement>(null);
  const [dragTarget, setDragTarget] = useState<HTMLDivElement | null>(null);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [tileTypes, setTileTypes] = useState<TileInfo[]>([
    {
      title: 'Active Users',
      description: '활성 유저 수',
    },
    {
      title: 'Monthly Active User',
      description: '월별 활성 유저 수',
    },
    {
      title: 'MAU by month in the last 5 months',
      description: '최근 5개월 간 월별 활성 유저 수',
    },
    {
      title: 'Number of connections by application in the last 20 days',
      description: '최근 20일 간 일자별 애플리케이션별 접속 수',
    },
    {
      title: 'User List',
      description: '유저 리스트',
    },
    {
      title: 'Server Time',
      description: '서버 시간',
    },
  ]);
  const [dragTargetType, setDragTargetType] = useState<string | undefined>('');
  const [isEditDashboard, setIsEditDashboard] = useState(false);

  const [isEditTarget, setIsEditTarget] = useState<string | null>('');
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
    const foundTile = tileTypes.find((tileInfo) => eventTarget.className.includes(tileInfo.title));
    setDragTargetType(foundTile?.title);
  };

  const handleAddComponentByClick = (sel: TileInfo) => {
    setSelectedTileType((prev) => ({
      ...prev,
      clickedTile: sel.title,
      clickedCount: prev.clickedCount + 1,
    }));
  };

  const handleOpenEditDashboard = (editTarget: string | null) => {
    if (editTarget !== null) {
      setIsEditTarget(editTarget);
      setIsEditDashboard(!isEditDashboard);
    } else {
      setIsEditTarget(null);
      setIsEditDashboard(!isEditDashboard);
    }
  };

  const handleOpenDashboard = () => {
    setIsEditDashboard(!isEditDashboard);
  };

  const handleIsPreview = () => {
    if (galleryVisible) {
      setGalleryVisible(!galleryVisible);
    }
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

  // 수정 완료 버튼을 눌렀을 때
  const handleEditSaveDashboard = (editTarget: string, title: string, comp: ComponentPosition[]) => {
    // LocalStorage에서 이전 데이터 가져오기
    const storedData = localStorage.getItem('dashboard');

    if (storedData) {
      // 이전 데이터를 파싱하여 객체로 변환
      const data = JSON.parse(storedData);

      // title이 일치하는 데이터를 찾아 수정
      const modifiedData = data.map((item: LocalStorageData) => {
        if (item.dashboardTitle === editTarget) {
          return {
            ...item,
            dashboardTitle: title,
            components: comp,
          };
        }
        return item;
      });

      // 수정된 데이터를 다시 LocalStorage에 저장
      localStorage.setItem('dashboard', JSON.stringify(modifiedData));
    }
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
              editTarget={isEditTarget}
              handleGalleryVisible={handleGalleryVisible}
              handleOpenDashboard={handleOpenDashboard}
              handleSaveDashboard={handleSaveDashboard}
              handleEditSaveDashboard={handleEditSaveDashboard}
              handleIsPreview={handleIsPreview}
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
