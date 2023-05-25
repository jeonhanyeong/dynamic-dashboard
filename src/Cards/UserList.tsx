import { useRef, useState } from 'react';
import DataGrid, { Scrolling, Sorting, LoadPanel } from 'devextreme-react/data-grid';
import styled from 'styled-components';
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

const UserList = ({
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

  const items = [
    {
      id: '744f5b22-819f-476c-a4d9-648f3d2f2b72',
      firstName: '운영자',
      lastName: null,
      email: null,
    },
    {
      id: '2392d0dc-2d1a-4b12-911e-6c6c32660cea',
      firstName: 'cheongho',
      lastName: 'bae',
      email: 'cheongho.bae@cloudmt.co.kr',
    },
    {
      id: '6c762bc1-e410-40d8-90e5-eaf91bcad628',
      firstName: 'colson-user',
      lastName: 'cm-app',
      email: 'sdev@cloudmt.co.kr',
    },
    {
      id: '0b41e44a-c4d8-405b-8a2c-8fa9544ecced',
      firstName: 'cm-rssmonitor',
      lastName: 'cm-rssmonitor',
      email: 'le@cloudmt.co.kr',
    },
  ];

  const handleSelectCard = (dep: number) => {
    setDepth(dep);
  };

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

      <CardTitle>
        <span>유저 리스트</span>
      </CardTitle>
      <div style={{ height: '100%', width: '100%', padding: '10px 0px' }}>
        <DataGrid height={heightPx - 50} dataSource={items} keyExpr="id" showBorders>
          <Sorting mode="none" />
          <Scrolling mode="infinite" />
          <LoadPanel enabled={false} />
        </DataGrid>
      </div>
    </CardBoard>
  );
};

export default UserList;
