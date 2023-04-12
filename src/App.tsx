import './App.css';
import styled from 'styled-components';
import TileGallery from './components/TileGallery';
import TopNavBar from './components/TopNavBar';
import DashboardHeader from './components/DashboardHeader';
import DashboardBody from './components/DashboardBody';

const WebContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  display: flex;
  flex-direction: column;
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
  flex-direction: column;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const App = () => {
  return (
    <WebContainer>
      <TopNavBar />
      <Contents>
        <Dashboard>
          <DashboardHeader />
          <DashboardBody />
        </Dashboard>
        <TileGallery />
      </Contents>
    </WebContainer>
  );
};

export default App;
