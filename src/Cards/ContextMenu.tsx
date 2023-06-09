import styled from 'styled-components';
import SettingsIcon from '@mui/icons-material/Settings';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { useEffect, useState } from 'react';

const Menu = styled.div`
  position: fixed;
  width: 130px;
  z-index: 10000;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);
  box-sizing: border-box;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  box-sizing: border-box;
`;

const MenuList = styled.ul`
  margin: 0;
  padding: 0;

  overflow-y: auto;
`;

const Elements = styled.li`
  display: flex;
  font-size: 13px;
  align-items: center;
  margin: 0;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

const IconStyle = {
  color: 'rgb(21, 101, 192)',
};

interface ContextMenuProps {
  name: string;
  ContextTop: number;
  ContextLeft: number;
  handleContext: ((name: string, ratioWidth: number, ratioHeight: number) => void) | null;
  handleResizeRatioClick: (id: string) => void;
  currentRatio: string;
  handleSettingOpen: (cardName: string) => void;
}

interface resizeOption {
  id: string;
  width: number;
  height: number;
  state: boolean;
}

const ContextMenu = ({
  name,
  ContextTop,
  ContextLeft,
  handleContext,
  handleResizeRatioClick,
  currentRatio,
  handleSettingOpen,
}: ContextMenuProps) => {
  const [resizeClick, setResizeClick] = useState<resizeOption[]>([
    { id: 're-3', width: 2, height: 4, state: false },
    { id: 're-4', width: 4, height: 2, state: false },
    { id: 're-5', width: 4, height: 3, state: false },
    { id: 're-7', width: 6, height: 3, state: false },
    { id: 're-9', width: 6, height: 6, state: false },
  ]);

  const handleResizeContext = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'path' || target.tagName.toLowerCase() === 'svg') {
      const parentElement = target.parentNode as HTMLElement;
      const parentClassList = parentElement.classList;
      const findPathContext = resizeClick.find((rc) => parentClassList.contains(rc.id));
      if (findPathContext && handleContext) {
        handleResizeRatioClick(findPathContext.id);
        handleContext(name, findPathContext.width, findPathContext.height);
      }
    } else {
      const findContext = resizeClick.find((rc) => target.classList.contains(rc.id));
      if (findContext && handleContext) {
        handleResizeRatioClick(findContext.id);
        handleContext(name, findContext.width, findContext.height);
      }
    }
  };

  const settingOpen = () => {
    handleSettingOpen(name);
  };
  useEffect(() => {
    const updatedResizeClick = resizeClick.map((rc) => ({
      ...rc,
      state: rc.id === currentRatio,
    }));
    setResizeClick(updatedResizeClick);
  }, [currentRatio]);

  return (
    <Menu
      className={name}
      style={{
        top: ContextTop,
        left: ContextLeft,
      }}
    >
      <MenuList onClick={handleResizeContext}>
        {name.includes('Server Time') ? (
          <Elements className={name} onClick={settingOpen}>
            <SettingsIcon style={IconStyle} />
            &nbsp;&nbsp; 타일 설정
          </Elements>
        ) : null}

        {resizeClick.map((re) => {
          if (re.state === false) {
            return (
              <Elements key={re.id} className={re.id}>
                <AspectRatioIcon className={re.id} style={IconStyle} />
                &nbsp;&nbsp;{re.width} X {re.height}
              </Elements>
            );
          }

          return false;
        })}
      </MenuList>
    </Menu>
  );
};

export default ContextMenu;
