import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import PersonIcon from '@mui/icons-material/Person';
import PortraitIcon from '@mui/icons-material/Portrait';
import ActionTools from './ActionTools';

const CardBoard = styled.div`
  border: 1px solid #e1dfdd;
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);
  box-sizing: border-box;
  padding: 10px;
  background-color: white;
  position: absolute;
  border-radius: 2px;

  transition: height 125ms linear 125ms, width 125ms linear 0s, top 175ms ease-out, left 175ms ease-out,
    right 175ms ease-out;
  z-index: 991;
  min-height: 84px;
  min-width: 84px;
`;

const CardTitle = styled.div`
  width: 100%;
  height: auto;
  background-color: none;
  font-size: 14px;
  font-weight: bold;
  padding-left: 5px;
  display: flex;
  align-items: center;
`;

interface CardPosition {
  topPx: number;
  leftPx: number;
  widthPx: number;
  heightPx: number;
  name: string;
  displayState: string;
  isPreview: boolean;
  handleDelete: ((event: React.MouseEvent) => void) | null;
  handleContext: ((name: string, ratioWidth: number, ratioHeight: number) => void) | null;
}

const ActiveUser = ({
  topPx,
  name,
  leftPx,
  widthPx,
  heightPx,
  displayState,
  isPreview,
  handleDelete,
  handleContext,
}: CardPosition) => {
  const cardBoardRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(991);
  const [fontRatio, setFontRatio] = useState(0);

  const handleSelectCard = (dep: number) => {
    setDepth(dep);
  };
  useEffect(() => {
    setFontRatio(Math.floor(widthPx / 4));
  }, [widthPx]);
  return (
    <CardBoard
      ref={cardBoardRef}
      className={name}
      key={name}
      style={{
        top: topPx,
        left: leftPx,
        width: widthPx,
        height: heightPx,
        display: displayState,
        cursor: isPreview ? 'auto' : 'move',
        zIndex: depth,
      }}
      draggable
    >
      {isPreview ? null : (
        <ActionTools
          name={name}
          handleDelete={handleDelete}
          handleSelectCard={handleSelectCard}
          handleContext={handleContext}
        />
      )}

      <div
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'space-around',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <PersonIcon
          style={{
            fontSize: Math.floor(fontRatio),
            color: 'rgb(21, 101, 192)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', width: widthPx / 2.2 }}>
          <span style={{ fontSize: Math.floor(fontRatio / 5) }}>
            <strong>활성 유저</strong>
          </span>
          <span style={{ color: 'gray', fontSize: Math.floor(fontRatio / 5.5) }}>Active Users</span>
          <span style={{ fontSize: Math.floor(fontRatio / 1.5), marginBottom: '10px' }}>
            <strong>54</strong>
          </span>
        </div>
      </div>
    </CardBoard>
  );
};

export default ActiveUser;
