import 'devextreme/dist/css/dx.light.css';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import reset from 'styled-reset';
import { darkTheme, lightTheme } from './styles/theme';
import TileGallery from './components/TileGallery';
import TopNavBar from './components/TopNavBar';
import EditDashboardBody from './components/EditDashboardBody';
import DashboardBody from './components/DashboardBody';
import ModeSetting from './components/ModeSetting';
import MessageNotice from './components/MessageNotice';
import TileSetting from './components/TileSetting';

const GlobalStyle = createGlobalStyle`
  ${reset}  
  body {        
    background-color: ${(props) => props.theme.bgColor};
    color:${(props) => props.theme.textColor};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  }  
  
`;
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
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
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
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
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
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
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

interface apiInfoInterface {
  gateway: string;
  username: string;
  password: string;
}

interface TimeZoneValueInfo {
  cardName: string;
  zone: string;
}
const App = () => {
  const apiInfo: apiInfoInterface = {
    gateway: 'https://gw.cloudmt.co.kr/',
    username: 'dashboard_api',
    password: 'zmffkdnemapdlxm1Emd!',
  };
  const parent = useRef<HTMLDivElement>(null);
  // const setting = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dragTarget, setDragTarget] = useState<HTMLDivElement | null>(null);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [tileSettingVisible, setTileSettingVisible] = useState(false);
  const [noticeAlarm, setNoticeAlarm] = useState(false);
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
  const [menuRightPx, setMenuRightPx] = useState<number>(0);
  const [timeZoneValue, setTimezoneValue] = useState<TimeZoneValueInfo>({
    cardName: '',
    zone: 'Asia/Seoul',
  });
  const [selectServerTimeCard, setSelectServerTimeCard] = useState('');

  const handleTimeZone = (value: string) => {
    setTimezoneValue((prev) => ({
      ...prev,
      cardName: selectServerTimeCard,
      zone: value,
    }));
  };

  const handleHideNoticeAlarm = () => {
    setNoticeAlarm(false);
  };
  const handleShowNoticeAlarm = () => {
    setNoticeAlarm(true);
  };

  const handleModeChange = (changeMode: boolean) => {
    setIsDarkMode(changeMode);
    localStorage.setItem('mode', JSON.stringify(changeMode));
  };

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
    setTileSettingVisible(false);
  };

  const handleSettingVisible = (right: number) => {
    setMenuRightPx(right);
    setSettingVisible(!settingVisible); // 부모 컴포넌트의 상태를 변경
    setNoticeVisible(false);
  };
  const handleNoticeVisible = (right: number) => {
    setMenuRightPx(right);
    setNoticeVisible(!noticeVisible); // 부모 컴포넌트의 상태를 변경
    setSettingVisible(false);
  };

  const handleTileSettingVisible = (cardName: string) => {
    setSelectServerTimeCard(cardName);
    setGalleryVisible(false);
    setTileSettingVisible(!tileSettingVisible);
  };

  const handleDragStart = (event: DragEvent) => {
    // console.log(e.target.className);
    const eventTarget = event.target as HTMLDivElement;
    setDragTarget(eventTarget);
    const foundTile = tileTypes.find((tileInfo) => eventTarget.className.includes(tileInfo.title));
    setDragTargetType(foundTile?.title);
  };

  const handleDragEnd = () => {
    setDragTarget(null);
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
    setGalleryVisible(false);
    setTileSettingVisible(false);
  };

  const handleIsPreview = () => {
    if (galleryVisible) {
      setGalleryVisible(!galleryVisible);
    }
    setTileSettingVisible(false);
  };

  // 저장 버튼을 눌렀을 때
  const handleSaveDashboard = (title: string, comp: ComponentPosition[]) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const saved = `${year}-${month}-${day} ${hours}: ${minutes}: ${seconds}`;

    const data = { dashboardTitle: title, components: comp, saveDate: saved };
    addToLocalStorage('dashboard', data);

    if (galleryVisible) {
      setGalleryVisible(!galleryVisible);
    }
    setIsEditDashboard(!isEditDashboard);
    setTileSettingVisible(false);
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
    setTileSettingVisible(false);
  };

  const settingClose = () => {
    setSettingVisible(false);
    setNoticeVisible(false);
  };

  useEffect(() => {
    const parentComponent = parent.current as HTMLDivElement;
    parentComponent.addEventListener('dragstart', handleDragStart);

    const modeData = localStorage.getItem('mode');
    setIsDarkMode(modeData ? JSON.parse(modeData) : false);

    return () => {
      parentComponent.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <WebContainer>
        <TopNavBar
          handleSettingVisible={handleSettingVisible}
          handleNoticeVisible={handleNoticeVisible}
          settingVisible={settingVisible}
          noticeVisible={noticeVisible}
          isDarkMode={isDarkMode}
          noticeAlarm={noticeAlarm}
          handleHideNoticeAlarm={handleHideNoticeAlarm}
        />
        <Contents ref={parent} className={isDarkMode ? 'viewport dx-theme-dark' : 'viewport dx-theme-light'}>
          {isEditDashboard ? null : (
            <Dashboard>
              <DashboardBody
                apiInfo={apiInfo}
                handleOpenEditDashboard={handleOpenEditDashboard}
                handleTileSettingVisible={handleTileSettingVisible}
                handleShowNoticeAlarm={handleShowNoticeAlarm}
                isDarkMode={isDarkMode}
                timeZoneValue={timeZoneValue}
              />
            </Dashboard>
          )}

          {isEditDashboard && (
            <Dashboard>
              <EditDashboardBody
                isDarkMode={isDarkMode}
                apiInfo={apiInfo}
                dragTarget={dragTarget}
                handleDragEnd={handleDragEnd}
                dragTargetType={dragTargetType}
                selectedTileType={selectedTileType}
                editTarget={isEditTarget}
                handleGalleryVisible={handleGalleryVisible}
                handleOpenDashboard={handleOpenDashboard}
                handleSaveDashboard={handleSaveDashboard}
                handleEditSaveDashboard={handleEditSaveDashboard}
                handleIsPreview={handleIsPreview}
                handleTileSettingVisible={handleTileSettingVisible}
                handleShowNoticeAlarm={handleShowNoticeAlarm}
                timeZoneValue={timeZoneValue}
              />
            </Dashboard>
          )}
          {galleryVisible && (
            <TileGallery
              isDarkMode={isDarkMode}
              tileTypes={tileTypes}
              handleGalleryVisible={handleGalleryVisible}
              handleAddComponentByClick={handleAddComponentByClick}
            />
          )}
          {settingVisible && (
            <ModeSetting
              contentsRef={parent.current as HTMLDivElement}
              handleModeChange={handleModeChange}
              settingClose={settingClose}
              menuRightPx={menuRightPx}
            />
          )}

          {noticeVisible && (
            <MessageNotice
              isDarkMode={isDarkMode}
              contentsRef={parent.current as HTMLDivElement}
              settingClose={settingClose}
              menuRightPx={menuRightPx}
            />
          )}

          {tileSettingVisible && (
            <TileSetting
              isDarkMode={isDarkMode}
              handleTimeZone={handleTimeZone}
              handleTileSettingVisible={handleTileSettingVisible}
              selectServerTimeCard={selectServerTimeCard}
            />
          )}
        </Contents>
      </WebContainer>
    </ThemeProvider>
  );
};

export default App;
