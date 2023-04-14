import './App.css';
import { useState } from 'react';
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
  const [galleryVisible, setGalleryVisible] = useState(true);
  const [settingVisible, setSettingVisible] = useState(false);

  const handleGalleryVisible = () => {
    setGalleryVisible(!galleryVisible); // 부모 컴포넌트의 상태를 변경
  };

  const handleSettingVisible = () => {
    setSettingVisible(!settingVisible); // 부모 컴포넌트의 상태를 변경
  };

  return (
    <WebContainer>
      <TopNavBar handleSettingVisible={handleSettingVisible} />
      <Contents>
        <Dashboard>
          <DashboardHeader handleGalleryVisible={handleGalleryVisible} />
          <DashboardBody />
        </Dashboard>
        {galleryVisible && <TileGallery handleGalleryVisible={handleGalleryVisible} />}
        {settingVisible && <ModeSetting />}
      </Contents>
    </WebContainer>
  );
};

export default App;
