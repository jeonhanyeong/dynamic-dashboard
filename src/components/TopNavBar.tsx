import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import styled from 'styled-components';

type MyComponentProps = {
  handleSettingVisible: () => void;
};

const toolbarStlye = {
  minHeight: '40px',
};

const titleStyle = {
  flexGrow: 1,
  fontSize: 15,
  marginLeft: 20,
};

const appbarStyle = {
  backgroundColor: '#1565c0',
  color: '#fff',
  height: '40px',

  zIndex: 999,
  minHeight: '40px',
};

const NavMenu = styled.div`
  display: flex;
  background-color: none;
  height: 40px;
  align-items: center;
  padding: 0px 10px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  cursor: pointer;
`;

const TopNavBar = ({ handleSettingVisible }: MyComponentProps) => {
  const openSetting = () => {
    handleSettingVisible();
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
