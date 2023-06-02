import { useRef, useState, useEffect } from 'react';
import DataGrid, { Scrolling, Sorting, LoadPanel } from 'devextreme-react/data-grid';
import axios from 'axios';
import { encode } from 'base-64';
import styled from 'styled-components';
import ActionTools from './ActionTools';

const CardBoard = styled.div`
  border: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);
  box-sizing: border-box;
  padding: 10px;
  background-color: ${(props) => props.theme.bgColor};
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

interface apiInfoInterface {
  gateway: string;
  username: string;
  password: string;
}

interface userInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

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
  apiInfo: apiInfoInterface;
  isDarkMode: boolean;
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
  apiInfo,
  isDarkMode,
}: CardPosition) => {
  const credentials = encode(`${apiInfo.username}:${apiInfo.password}`);
  const basicAuth = `Basic ${credentials}`;
  const cardBoardRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(991);
  const [userData, setUserData] = useState<userInterface[]>([]);

  const handleSelectCard = (dep: number) => {
    setDepth(dep);
  };

  const getData = () => {
    axios
      .get(`${apiInfo.gateway}iam/users`, {
        headers: {
          Authorization: basicAuth,
        },
      })
      .then((response) => {
        const newUserData = response.data.map((obj: any) => {
          return {
            id: obj.id,
            firstName: obj.firstName,
            lastName: obj.lastName,
            email: obj.email,
          };
        });
        setUserData(newUserData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();

    const gridElements = document.getElementsByClassName('dx-datagrid');

    // 스타일을 변경할 엘리먼트들에 대해 반복문 실행
    for (let i = 0; i < gridElements.length; i += 1) {
      const gridElement = gridElements[i] as HTMLElement;

      // 스타일 변경
      gridElement.style.backgroundColor = isDarkMode ? '#1B1A19' : '#fff';
      gridElement.style.color = isDarkMode ? '#EDECEB' : '#000';
    }
  }, []);
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
        <span style={{ color: isDarkMode ? '#EDECEB' : '#000' }}>유저 리스트</span>
        <div>
          <span style={{ color: isDarkMode ? 'lightgray' : 'gray', fontSize: '12px', fontWeight: 'normal' }}>
            User List
          </span>
        </div>
      </CardTitle>
      <div style={{ height: '90%', width: '100%', padding: '10px 0px' }}>
        <DataGrid height={heightPx - 70} dataSource={userData} keyExpr="id" showBorders>
          <Sorting mode="none" />
          <Scrolling mode="infinite" />
          <LoadPanel enabled={false} />
        </DataGrid>
      </div>
    </CardBoard>
  );
};

export default UserList;
