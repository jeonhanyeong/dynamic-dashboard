import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import styled from 'styled-components';

const Cover = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  opacity: 0.5;
  background-color: white;
  z-index: 998;
  position: absolute;
  display: block;
  min-height: 90px;
  min-width: 90px;
`;

const ResizeHandle = styled.div`
  height: 10px;
  width: 10px;
  bottom: 5px;
  display: block;
  right: 5px;
  position: absolute;
  cursor: se-resize;
  z-index: 999;
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
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

const DeleteComponent = styled.div`
  width: 25px;
  height: 100%;
  background-color: none;
  &:hover {
    background-color: #a52121;
    color: white;
  }
  cursor: pointer;
  padding: 2px;
  box-sizing: border-box;
`;

const ActionMenu = styled.div`
  width: 25px;
  height: 100%;
  background-color: none;
  &:hover {
    background-color: #bcbcbc;
  }
  cursor: pointer;
  box-sizing: border-box;
  padding: 2px;
`;

const ActionTools = () => {
  const actionBarRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (actionBarRef.current && coverRef.current) {
      actionBarRef.current.style.display = 'flex';
      coverRef.current.style.opacity = '0';
    }
  };

  const handleMouseLeave = () => {
    if (actionBarRef.current && coverRef.current) {
      actionBarRef.current.style.display = 'none';
      coverRef.current.style.opacity = '0.5';
    }
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
      <Cover ref={coverRef} className="Card-Cover" />
      <ActionBar ref={actionBarRef} className="actionBar">
        <IconButton
          style={{ padding: 0, color: 'gray' }}
          onClick={() => {
            console.log('야');
          }}
        >
          <DeleteOutlineOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton style={{ padding: 0, color: 'gray' }}>
          <MoreHorizOutlinedIcon fontSize="small" />
        </IconButton>
      </ActionBar>

      <ResizeHandle ref={resizeHandleRef} className="resizeHandle" />
    </>
  );
};

export default ActionTools;
