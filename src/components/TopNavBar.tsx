import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core//Toolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import styled from 'styled-components';

type MyComponentProps = {
  handleSettingVisible: () => void;
};

// Material-UI에서 사용할 스타일을 정의합니다.
const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#1565c0',
    color: '#fff',
    height: '40px',
    position: 'relative',
    zIndex: 999,
    minHeight: '40px',
  },
  toolBar: {
    minHeight: '40px',
  },
  title: {
    flexGrow: 1,
    fontSize: 15,
    marginLeft: 20,
  },
  dashIcon: {
    fontSize: 20,
  },
}));

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
  const classes = useStyles();

  const openSetting = () => {
    handleSettingVisible();
  };

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <DashboardIcon className={classes.dashIcon} />
        <h6 className={classes.title}>Dynamic Dashboard</h6>
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
