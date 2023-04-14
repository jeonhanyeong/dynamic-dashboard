import styled from 'styled-components';
import Grid from '@mui/material/Grid';
import lightMode from '../assets/images/lightDashboard.png';
import darkMode from '../assets/images/darkDashboard.png';

const Setting = styled.div`
  background-color: #fff;
  color: #000;
  padding: 10px;
  width: 15%;
  height: 25%;
  position: absolute;
  right: 0;
  border: 1px solid lightgray;
  padding: 0;
  z-index: 1000;
`;

const SettingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 10px;
`;

const SettingBody = styled.div`
  margin: 0;
  padding: 0 15px;
  display: flex;
  flex-flow: column nowrap;
  box-sizing: border-box;
`;

const SettingLabel = styled.div`
  width: 100%;
  height: 5%;
  font-size: 13px;
  color: #000;
  margin-top: 10px;
  padding: 0;
`;

const ModeChange = styled.div`
  display: flex;
  flex: 1;
  width: 110px;
  height: 110px;
  box-sizing: border-box;
`;

const Mode = styled.div`
  flex: 1;
  padding: 10px;
  box-sizing: border-box;
  margin: 10px;
  height: 100%;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-flow: column nowrap;
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 0 0 1px #bcbcbc;
    font-weight: bold;
  }
`;

const ModeSetting = () => {
  return (
    <Setting>
      <SettingHeader>
        <h1>설정</h1>
      </SettingHeader>
      <SettingBody>
        <SettingLabel>테마 변경</SettingLabel>
        <ModeChange>
          <Mode>
            <img src={`${lightMode}`} width="80px" height="80px" alt="라이트모드" loading="lazy" />
            <span>밝게</span>
          </Mode>
          <Mode>
            <img src={`${darkMode}`} width="80px" height="80px" alt="다크모드" loading="lazy" />
            <span>어둡게</span>
          </Mode>
        </ModeChange>
      </SettingBody>
    </Setting>
  );
};

export default ModeSetting;
