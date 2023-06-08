import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useRaf } from 'react-use';

type MyComponentProps = {
  isDarkMode: boolean;
  handleSettingVisible: (right: number) => void;
  handleNoticeVisible: (right: number) => void;
  settingVisible: boolean;
  noticeVisible: boolean;
  noticeAlarm: boolean;
  handleHideNoticeAlarm: () => void;
};

const NavMenu = styled.div`
  position: relative;
  display: flex;
  background-color: none;
  height: 40px;
  align-items: center;
  padding: 0px 10px;
  color: #edeceb;
  justify-content: center;

  &:hover {
    background-color: ${(props) => props.theme.navHoverColor};
  }
  cursor: pointer;
`;

const TopNavBar = ({
  isDarkMode,
  handleSettingVisible,
  handleNoticeVisible,
  settingVisible,
  noticeVisible,
  noticeAlarm,
  handleHideNoticeAlarm,
}: MyComponentProps) => {
  const noticeRef = useRef<HTMLDivElement>(null);
  const settingRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  const openMessageNotice = () => {
    handleHideNoticeAlarm();
    setIsClicked(false);
    const noticeComponent = noticeRef.current;
    const screenWidth = window.innerWidth;
    if (noticeComponent) {
      const { right } = noticeComponent.getBoundingClientRect();
      handleNoticeVisible(screenWidth - right - 1);
    }
  };

  const openSetting = () => {
    const settingComponent = settingRef.current;
    const screenWidth = window.innerWidth;
    if (settingComponent) {
      const { right } = settingComponent.getBoundingClientRect();
      handleSettingVisible(screenWidth - right - 1);
    }
  };

  const appbarStyle = {
    backgroundColor: isDarkMode ? '#252423' : '#1976d2',
    color: '#fff',
    height: '40px',

    zIndex: 999,
    minHeight: '40px',
  };

  const toolbarStlye = {
    minHeight: '40px',
    color: isDarkMode ? '#EDECEB' : '#fff',
  };

  const titleStyle = {
    flexGrow: 1,
    fontSize: 17,
    marginLeft: 20,
    color: isDarkMode ? '#EDECEB' : '#fff',
  };

  return (
    <AppBar position="static" style={appbarStyle}>
      <Toolbar style={toolbarStlye}>
        <DashboardIcon />
        <h6 style={titleStyle}>Dynamic Dashboard </h6>
        {/* 주우서억 */}
        <NavMenu
          ref={noticeRef}
          onClick={openMessageNotice}
          style={{
            backgroundColor: noticeVisible ? (isDarkMode ? '#1B1A19' : '#fff') : '',
            color: noticeVisible ? (isDarkMode ? '#edeceb' : '#1976d2') : '#edeceb',
          }}
        >
          <NotificationsNoneOutlinedIcon fontSize="small" />
          {noticeAlarm ? (
            <CircleIcon
              style={{
                position: 'absolute',
                top: '60%',
                left: '60%',
                transform: 'translate(-40%, -40%)',
                fontSize: '9px',
                color: 'red',
              }}
            />
          ) : null}
        </NavMenu>
        <NavMenu
          ref={settingRef}
          onClick={openSetting}
          style={{
            backgroundColor: settingVisible ? (isDarkMode ? '#1B1A19' : '#fff') : '',
            color: settingVisible ? (isDarkMode ? '#edeceb' : '#1976d2') : '#edeceb',
          }}
        >
          <SettingsOutlinedIcon fontSize="small" />
        </NavMenu>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
