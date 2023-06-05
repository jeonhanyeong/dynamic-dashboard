import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Grid from '@mui/material/Grid';
import lightMode from '../assets/images/lightDashboard.png';
import darkMode from '../assets/images/darkDashboard.png';

const Setting = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 10px;
  width: 15%;
  height: 30%;
  position: absolute;
  right: 0;
  border-bottom: 1px solid;
  border-left: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
  padding: 0;
  z-index: 1000;
`;

const SettingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 10px;
  padding: 0 10px;
`;

const SettingBody = styled.div`
  padding: 0 15px;
  display: flex;
  flex-flow: column nowrap;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
`;

const SettingLabel = styled.div`
  width: auto;
  height: auto;
  font-size: 14px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  margin-top: 10px;
  padding: 0;
`;

const ModeChange = styled.div`
  display: flex;
  flex: 1;
  width: 110px;
  height: 110px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
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
  // transition: box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 0 0 1px #bcbcbc !important;
    font-weight: bold;
  }
`;

interface modeInfo {
  contentsRef: HTMLDivElement;
  handleModeChange: (changeMode: boolean) => void;
  settingClose: () => void;
}

const ModeSetting = ({ contentsRef, handleModeChange, settingClose }: modeInfo) => {
  const [isLightClicked, setIsLightClicked] = useState(false);
  const [isDarkClicked, setIsDarkClicked] = useState(false);
  const settingRef = useRef<HTMLDivElement>(null);

  const handleChangeLight = () => {
    setIsDarkClicked(false);
    setIsLightClicked(true);
    handleModeChange(false);
  };
  const handleChangeDark = () => {
    setIsDarkClicked(true);
    setIsLightClicked(false);
    handleModeChange(true);
  };

  const clickClose = (e: MouseEvent) => {
    const settingComponent = settingRef.current as HTMLDivElement;
    const isClickedInside = settingComponent.contains(e.target as Node);
    if (!isClickedInside) {
      settingClose();
    }
  };

  useEffect(() => {
    contentsRef.addEventListener('click', clickClose);

    return () => {
      contentsRef.removeEventListener('click', clickClose);
    };
  }, []);

  return (
    <Setting ref={settingRef}>
      <SettingHeader>
        <h1>설정</h1>
      </SettingHeader>
      <SettingBody>
        <SettingLabel>테마 변경</SettingLabel>
        <ModeChange>
          <Mode onClick={handleChangeLight} style={{ boxShadow: isLightClicked ? '0 0 0 1px #bcbcbc' : 'none' }}>
            <img src={`${lightMode}`} width="80px" height="80px" alt="라이트모드" loading="lazy" />
            <span style={{ marginTop: '5px' }}>밝게</span>
          </Mode>
          <Mode onClick={handleChangeDark} style={{ boxShadow: isDarkClicked ? '0 0 0 1px #bcbcbc' : 'none' }}>
            <img src={`${darkMode}`} width="80px" height="80px" alt="다크모드" loading="lazy" />
            <span style={{ marginTop: '5px' }}>어둡게</span>
          </Mode>
        </ModeChange>
      </SettingBody>
    </Setting>
  );
};

export default ModeSetting;
