import 'devextreme/dist/css/dx.light.css';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import TileGallery from './components/TileGallery';
import TopNavBar from './components/TopNavBar';
import DashboardHeader from './components/DashboardHeader';
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

const App = () => {
  const parent = useRef<HTMLDivElement>(null);
  const [dragTarget, setDragTarget] = useState<HTMLDivElement | null>(null);
  const [galleryVisible, setGalleryVisible] = useState(true);
  const [settingVisible, setSettingVisible] = useState(false);
  const [tileTypes, setTileTypes] = useState(['LineChart', 'BarChart']);
  const [dragTargetType, setDragTargetType] = useState<string | undefined>('');
  const [backgroudVisible, setBackgroudVisible] = useState(true);
  const [isPreview, setIsPreview] = useState(false);

  const handleGalleryVisible = () => {
    setGalleryVisible(!galleryVisible); // 부모 컴포넌트의 상태를 변경
  };

  const handleSettingVisible = () => {
    setSettingVisible(!settingVisible); // 부모 컴포넌트의 상태를 변경
  };

  const handlePreview = () => {
    if (galleryVisible) {
      setGalleryVisible(!galleryVisible);
    }
    console.log(backgroudVisible);
    setBackgroudVisible(!backgroudVisible);
    setIsPreview(!isPreview);
  };

  const handleDragStart = (event: DragEvent) => {
    // console.log(e.target.className);
    const eventTarget = event.target as HTMLDivElement;
    setDragTarget(eventTarget);
    setDragTargetType(tileTypes.find((com) => eventTarget.className.includes(com)));
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
        <Dashboard>
          <DashboardHeader handleGalleryVisible={handleGalleryVisible} handlePreview={handlePreview} />
          <DashboardBody
            dragTarget={dragTarget}
            dragTargetType={dragTargetType}
            backgroudVisible={backgroudVisible}
            isPreview={isPreview}
          />
        </Dashboard>
        {galleryVisible && <TileGallery tileTypes={tileTypes} handleGalleryVisible={handleGalleryVisible} />}
        {settingVisible && <ModeSetting />}
      </Contents>
    </WebContainer>
  );
};

export default App;
