import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import styled from 'styled-components';

type MyComponentProps = {
  isDarkMode: boolean;
  handleSettingVisible: () => void;
};

const NavMenu = styled.div`
  display: flex;
  background-color: none;
  height: 40px;
  align-items: center;
  padding: 0px 10px;
  color: #edeceb;

  &:hover {
    background-color: ${(props) => props.theme.navHoverColor};
  }
  cursor: pointer;
`;

const TopNavBar = ({ isDarkMode, handleSettingVisible }: MyComponentProps) => {
  const openSetting = () => {
    handleSettingVisible();
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
        <NavMenu>
          <NotificationsNoneOutlinedIcon fontSize="small" />
        </NavMenu>
        <NavMenu onClick={openSetting}>
          <SettingsOutlinedIcon fontSize="small" />
        </NavMenu>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
