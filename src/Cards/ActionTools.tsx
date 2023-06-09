import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import styled from 'styled-components';
import SettingsIcon from '@mui/icons-material/Settings';
import ContextMenu from './ContextMenu';

const TileSettingContents = styled.div`
  /* 스타일 작성 */
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 10px;
  width: 20%;
  height: 100%;
  position: absolute;
  right: 0;
  border-left: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
  padding: 0;
  z-index: 998;
`;

const Cover = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  opacity: 0.8;
  background-color: ${(props) => props.theme.bgColor};
  z-index: 998;
  position: absolute;
  display: block;
  min-height: 90px;
  min-width: 90px;
`;

const ResizeHandle = styled.div`
  height: 15px;
  width: 15px;
  bottom: 5px;
  display: block;
  right: 5px;
  position: absolute;
  cursor: se-resize;
  z-index: 999;
  border-bottom: 1px solid;
  border-right: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
`;

const ActionBar = styled.div`
  width: 100%;
  z-index: 999;
  height: 25px;
  background-color: none;
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  justify-content: right;
  box-sizing: border-box;
`;
interface MyComponentProps {
  name: string;
  handleDelete: ((event: React.MouseEvent) => void) | null;
  handleSelectCard: (dep: number) => void;
  handleContext: ((name: string, ratioWidth: number, ratioHeight: number) => void) | null;
  handleTileSettingVisible: (cardName: string) => void;
}
interface ContextMenuPosition {
  state: boolean;
  top: number;
  left: number;
}

interface StlyeInterface {
  display: string;
  opacity: number;
}

const ActionTools = ({
  name,
  handleDelete,
  handleSelectCard,
  handleContext,
  handleTileSettingVisible,
}: MyComponentProps) => {
  const actionBarRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const [currentRatio, setCurrentRatio] = useState('re-8');
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [openContextMenu, setOpenContextMenu] = useState<ContextMenuPosition>({
    state: false,
    top: 0,
    left: 0,
  });
  const [styleState, setStyleState] = useState<StlyeInterface>({
    display: 'none',
    opacity: 0.5,
  });

  const handleSettingOpen = (cardName: string) => {
    handleTileSettingVisible(cardName);
  };

  const handleMouseEnter = (event: MouseEvent) => {
    // console.log(event.target);
    handleSelectCard(1000);
    setStyleState((prev) => ({
      ...prev,
      display: 'flex',
      opacity: 0,
    }));
  };

  const handleMouseLeave = (event: MouseEvent) => {
    // console.log(event.target);
    handleSelectCard(991);
    setStyleState((prev) => ({
      ...prev,
      display: 'none',
      opacity: 0.5,
    }));

    setOpenContextMenu((prev) => ({
      ...prev,
      state: false,
    }));
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    if (handleDelete) {
      handleDelete(event);
    }
  };

  const handleContextMenuClick = (event: React.MouseEvent) => {
    const actionBar = actionBarRef.current as HTMLDivElement;
    actionBar.removeEventListener('mouseleave', handleMouseLeave);
    const element = event.currentTarget as HTMLButtonElement;

    const rect = element.getBoundingClientRect();
    const elementTop = rect.top;
    const elementLeft = rect.left;
    const elementWidth = element.offsetWidth;
    setOpenContextMenu((prev) => ({
      ...prev,
      state: !prev.state,
      top: elementTop - 1,
      left: elementWidth + elementLeft,
    }));
  };

  const handleResizeRatioClick = (id: string) => {
    setOpenContextMenu((prev) => ({
      ...prev,
      state: !prev.state,
    }));
    setCurrentRatio(id);
  };

  useEffect(() => {
    const actionBar = actionBarRef.current as HTMLDivElement;
    const cover = coverRef.current as HTMLDivElement;
    const resizeHandle = resizeHandleRef.current as HTMLDivElement;

    actionBar.addEventListener('mouseenter', handleMouseEnter);
    actionBar.addEventListener('mouseleave', handleMouseLeave);
    cover.addEventListener('mouseenter', handleMouseEnter);
    cover.addEventListener('mouseleave', handleMouseLeave);
    resizeHandle.addEventListener('mouseenter', handleMouseEnter);
    resizeHandle.addEventListener('mouseleave', handleMouseLeave);

    // Clean Up
    return () => {
      actionBar.removeEventListener('mouseenter', handleMouseEnter);
      actionBar.removeEventListener('mouseleave', handleMouseLeave);
      cover.removeEventListener('mouseenter', handleMouseEnter);
      cover.removeEventListener('mouseleave', handleMouseLeave);
      resizeHandle.removeEventListener('mouseenter', handleMouseEnter);
      resizeHandle.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <Cover
        ref={coverRef}
        className="Card-Cover"
        style={{
          opacity: styleState.opacity,
        }}
      />
      <ActionBar
        ref={actionBarRef}
        className="actionBar"
        style={{
          display: styleState.display,
        }}
      >
        {openContextMenu.state && (
          <ContextMenu
            name={name}
            ContextTop={openContextMenu.top}
            ContextLeft={openContextMenu.left}
            handleContext={handleContext}
            handleResizeRatioClick={handleResizeRatioClick}
            handleSettingOpen={handleSettingOpen}
            currentRatio={currentRatio}
          />
        )}

        <IconButton className={name} style={{ padding: 0, color: '#a52121' }} onClick={handleDeleteClick}>
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
        <IconButton className={name} style={{ padding: 0, color: 'gray' }} onClick={handleContextMenuClick}>
          <MoreHorizOutlinedIcon fontSize="small" />
        </IconButton>
      </ActionBar>

      <ResizeHandle ref={resizeHandleRef} className="resizeHandle" />
    </>
  );
};

export default ActionTools;
