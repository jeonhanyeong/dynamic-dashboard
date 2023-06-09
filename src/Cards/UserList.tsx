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
import { Toast } from 'devextreme-react/toast';
import Button from '@mui/material/Button';
import axios from 'axios';
import { encode } from 'base-64';
import styled from 'styled-components';
import { ToastType } from 'devextreme/ui/toast';
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
  handleTileSettingVisible: (cardName: string) => void;
  handleShowNoticeAlarm: () => void;
}

interface NameInterface {
  lastName: string;
  firstName: string;
}

interface ToastInterface {
  isVisible: boolean;
  type: ToastType;
  message: string;
}

interface MessageLogsInfo {
  receiver: string;
  content: string;
  sendDate: string;
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
  handleTileSettingVisible,
  handleShowNoticeAlarm,
  apiInfo,
  isDarkMode,
}: CardPosition) => {
  const credentials = encode(`${apiInfo.username}:${apiInfo.password}`);
  const basicAuth = `Basic ${credentials}`;
  const cardBoardRef = useRef<HTMLDivElement>(null);
  const datagridRef = useRef<DataGrid>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [depth, setDepth] = useState(991);
  const [userData, setUserData] = useState<userInterface[]>([]);
  const [showEmployeeInfo, setShowEmployeeInfo] = useState(false);
  const [selectedRowEmail, setSelectedRowEmail] = useState('');
  const [selectedRowName, setSelectedRowName] = useState<NameInterface>();
  const [popupVisible, setPopupVisible] = useState(false);

  const [toastConfig, setToastConfig] = useState<ToastInterface>({
    isVisible: false,
    type: 'info',
    message: '',
  });

  const addToLocalStorage = (key: string, value: MessageLogsInfo) => {
    // 기존에 저장된 데이터 가져오기
    const existingData = localStorage.getItem(key);

    if (existingData) {
      // 기존 데이터가 존재하는 경우
      const parsedData = JSON.parse(existingData);

      // 새로운 값을 추가
      parsedData.push(value);
      // 변경된 데이터를 문자열로 변환하여 저장
      localStorage.setItem(key, JSON.stringify(parsedData));
    } else {
      // 기존 데이터가 없는 경우, 새로운 배열로 초기화하여 저장
      localStorage.setItem(key, JSON.stringify([value]));
    }
  };

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
    setShowEmployeeInfo(!!data);
    setSelectedRowEmail(data.email);
    setSelectedRowName({
      lastName: data.lastName,
      firstName: data.firstName,
    });
  };

  const handleRefreshClick = () => {
    if (datagridRef.current) {
      datagridRef.current.instance.refresh();
    }
  };

  const sendTeamsMessage = () => {
    if (selectedRowEmail === '' && selectedRowName === undefined) {
      setToastConfig((prevConfig) => ({
        ...prevConfig,
        isVisible: true,
        type: 'error',
        message: '메시지를 보낼 대상을 선택해주세요.',
      }));
      setTimeout(
        () =>
          setToastConfig((prevConfig) => ({
            ...prevConfig,
            isVisible: false,
          })),
        3000,
      );
    } else {
      setToastConfig((prevConfig) => ({
        ...prevConfig,
        isVisible: false,
      }));
      setPopupVisible(true);
    }
  };

  const hideInfo = () => {
    setPopupVisible(false);
  };

  const messageSending = () => {
    const textArea = textAreaRef.current as HTMLTextAreaElement;
    axios({
      url: `${apiInfo.gateway}colson/api/sendUserMessage`,
      method: 'post',
      headers: {
        Authorization: `Basic ${encode(`hanyeong.jeon@cloudmt.co.kr:wjsgksud7465!@A`)}`,
      },
      data: {
        user: selectedRowEmail,
        message: textArea.value,
      },
    })
      .then(() => {
        textArea.value = '';
        setToastConfig((prevConfig) => ({
          ...prevConfig,
          isVisible: true,
          type: 'success',
          message: '메시지가 전송되었습니다.',
        }));
        handleShowNoticeAlarm();

        setTimeout(
          () =>
            setToastConfig((prevConfig) => ({
              ...prevConfig,
              isVisible: false,
            })),
          1500,
        );
      })
      .catch((error) => {
        console.log(error);
      });
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const saved = `${month}-${day} ${hours}:${minutes}`;

    const messageData = {
      receiver: `${selectedRowName?.lastName} ${selectedRowName?.firstName}`,
      content: textArea.value,
      sendDate: saved,
    };

    addToLocalStorage('messageLog', messageData);
  };

  useEffect(() => {
    getData();
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
          handleTileSettingVisible={handleTileSettingVisible}
        />
      )}

      <CardTitle>
        <span style={{ color: isDarkMode ? '#EDECEB' : '#000' }}>유저 리스트</span>
        <div>
          <span style={{ color: isDarkMode ? '#6F6E6D' : 'gray', fontSize: '12px', fontWeight: 'normal' }}>
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
          title="Send Message"
          container=".dashborad-view"
          width={300}
          height={400}
        >
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '50px 150px' }}>
              <span>Name</span>
              <span>
                <strong>
                  {selectedRowName?.lastName}&nbsp;{selectedRowName?.firstName}
                </strong>
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '50px 150px', marginBottom: '20px' }}>
              <span>Email</span>
              <span>
                <strong>{selectedRowEmail}</strong>
              </span>
            </div>
            <div style={{ marginBottom: '5px' }}>
              <textarea
                ref={textAreaRef}
                style={{
                  width: '100%',
                  height: '200px',
                  resize: 'none',
                  border: '1px solid gray',
                  backgroundColor: isDarkMode ? '#1B1A19' : '#fff',
                  color: isDarkMode ? '#EDECEB' : '#000',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button ref={sendBtnRef} onClick={messageSending} variant="contained" size="small" color="primary">
                보내기
              </Button>
            </div>
          </div>
        </Popup>
      </div>
      <Toast
        visible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        displayTime={3000}
        width={300}
      />
    </CardBoard>
  );
};

export default UserList;
