import { useRef, useState, useEffect } from 'react';
import '../styles/devExStyle.css';
import DataGrid, {
  Scrolling,
  Sorting,
  LoadPanel,
  Selection,
  SearchPanel,
  TotalItem,
  Summary,
  Paging,
} from 'devextreme-react/data-grid';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import axios from 'axios';
import { encode } from 'base-64';
import styled from 'styled-components';
import ActionTools from './ActionTools';
import myIcon from '../assets/images/teamsIcon.svg';

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
  min-height: 265px;
  min-width: 445px;
`;
const CardTitle = styled.div`
  width: 100%;
  height: auto;
  background-color: none;
  font-size: 14px;
  font-weight: bold;
  padding-left: 5px;
`;

interface Datagrid {
  // Datagrid의 프로퍼티 및 메서드 정의
  refresh(): void;
  // ...
}

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
  const datagridRef = useRef<DataGrid>(null);
  const [depth, setDepth] = useState(991);
  const [userData, setUserData] = useState<userInterface[]>([]);
  const [showEmployeeInfo, setShowEmployeeInfo] = useState(false);
  const [selectedRowEmail, setSelectedRowEmail] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  const handleSelectCard = (dep: number) => {
    setDepth(dep);
  };

  const getData = () => {
    axios
      .get(`${apiInfo.gateway}iam/users`, {
        headers: {
          Authorization: basicAuth,
        },
        params: {
          enabled: 1,
        },
        // param enable = 1(재직)
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

  const onSelectionChanged = ({ selectedRowsData }: any) => {
    const data = selectedRowsData[0];
    console.log(data);
    setShowEmployeeInfo(!!data);
    setSelectedRowEmail(data.email);
  };

  const handleRefreshClick = () => {
    if (datagridRef.current) {
      datagridRef.current.instance.refresh();
      console.log('새로고침');
    }
  };

  const sendTeamsMessage = () => {
    console.log(selectedRowEmail);
    setPopupVisible(true);
  };

  const hideInfo = () => {
    setSelectedRowEmail('');
    setPopupVisible(false);
  };

  useEffect(() => {
    getData();
  }, []);
  /*
  useEffect(() => {
    const gridElements = document.getElementsByClassName('dx-datagrid');
    const toolbarElements = document.getElementsByClassName('dx-toolbar');
    const buttonElements = document.getElementsByClassName('dx-button-content');
    const inputElements = document.getElementsByClassName('dx-texteditor-container');
    console.log(buttonElements);

    // 스타일을 변경할 엘리먼트들에 대해 반복문 실행
    for (let i = 0; i < gridElements.length; i += 1) {
      const gridElement = gridElements[i] as HTMLElement;
      console.log(gridElement);
      // 스타일 변경
      gridElement.style.backgroundColor = isDarkMode ? '#1B1A19' : '#fff';
      gridElement.style.color = isDarkMode ? '#EDECEB' : '#000';
    }

    for (let i = 0; i < toolbarElements.length; i += 1) {
      const tbElement = toolbarElements[i] as HTMLElement;
      console.log(tbElement);
      // 스타일 변경
      tbElement.style.backgroundColor = isDarkMode ? '#1B1A19' : '#fff';
      tbElement.style.color = isDarkMode ? '#EDECEB' : '#000';
    }

    for (let i = 0; i < buttonElements.length; i += 1) {
      const btnElement = buttonElements[i] as HTMLElement;
      console.log(btnElement);
      // 스타일 변경
      btnElement.style.backgroundColor = isDarkMode ? '#1B1A19' : '#fff';
      btnElement.style.color = isDarkMode ? '#EDECEB' : '#000';
    }
    for (let i = 0; i < inputElements.length; i += 1) {
      const inputElement = inputElements[i] as HTMLElement;
      console.log(inputElement);
      // 스타일 변경
      inputElement.style.backgroundColor = isDarkMode ? '#1B1A19' : '#fff';
      inputElement.style.color = isDarkMode ? '#EDECEB' : '#000';
    }
  }, [isDarkMode]);
*/
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
        <DataGrid
          ref={datagridRef}
          className={isDarkMode ? 'dx-theme-dark' : 'dx-theme-light'}
          height={heightPx - 70}
          dataSource={userData}
          keyExpr="id"
          showBorders
          hoverStateEnabled
          onSelectionChanged={onSelectionChanged}
          toolbar={{
            items: [
              {
                location: 'before',
                widget: 'dxButton',
                options: {
                  widthPx: '30px',
                  icon: 'refresh',

                  onClick() {
                    handleRefreshClick();
                  },
                },
              },
              {
                name: 'searchPanel',
                location: 'before',
              },
              {
                location: 'after',
                widget: 'dxButton',
                options: {
                  widthPx: '30px',
                  icon: myIcon,
                  text: 'Teams 메시지 전송',
                  onClick() {
                    sendTeamsMessage();
                  },
                },
              },
            ],
          }}
        >
          <SearchPanel visible width={130} placeholder="Search..." />
          <Selection mode="single" />
          <Sorting mode="none" />
          <Scrolling mode="infinite" />
          <LoadPanel enabled />
          <Summary>
            <TotalItem column="id" summaryType="count" />
          </Summary>
        </DataGrid>

        <Popup
          visible={popupVisible}
          onHiding={hideInfo}
          dragEnabled={false}
          hideOnOutsideClick
          showCloseButton={false}
          showTitle
          title="Teams 메시지 전송"
          container=".dashborad-view"
          width={500}
          height={600}
        >
          <span> 팝업</span>
        </Popup>
      </div>
    </CardBoard>
  );
};

export default UserList;
