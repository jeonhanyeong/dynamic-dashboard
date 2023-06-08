import { useEffect, useRef, useState } from 'react';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import styled from 'styled-components';

const Setting = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 10px;
  width: 13%;
  height: 40%;
  position: absolute;
  border-bottom: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
  border-color: ${(props) => props.theme.borderColor};
  box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);
  // box-shadow: ${(props) => `0 1.6px 3.6px 0 ${props.theme.borderColor}, 0 0.3px 0.9px 0 ${props.theme.borderColor}`};
  padding: 0;
  z-index: 1000;
`;

const MessageList = styled.ul`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 90%;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollColor};
    border-radius: 6px;
  }
`;

const Message = styled.li`
  display: flex;
  font-size: 13px;
  margin: 0;
  padding: 10px 10px;
  min-height: 60px;
  height: auto;
  width: 100%;
  cursor: default;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  border-bottom: 1px solid ${(props) => props.theme.hoverColor};
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

const MessageHeader = styled.div`
  width: 100%;
  margin-bottom: 3px;
  display: flex;
  vertical-align: center;
  align-items: center;
  justify-content: space-between;
`;

const MessageBody = styled.div`
  width: 100%;
  font-size: 12px;
`;

const MessageDelete = styled.div`
  display: flex;
  height: 10%;
  font-size: 10px;
  color: #000;
  text-decoration: underline;
  text-decoration-color: ${(props) => props.theme.textColor};
  vertical-align: bottom;
  justify-content: end;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;
interface noticeInfo {
  isDarkMode: boolean;
  contentsRef: HTMLDivElement;
  settingClose: () => void;
  menuRightPx: number;
}

interface messageLogsInfo {
  receiver: string;
  content: string;
  sendDate: string;
}
const MessageNotice = ({ isDarkMode, contentsRef, settingClose, menuRightPx }: noticeInfo) => {
  const noticeRef = useRef<HTMLDivElement>(null);
  const [messageLogs, setMessageLogs] = useState<messageLogsInfo[]>();

  const clickClose = (e: MouseEvent) => {
    const noticeComponent = noticeRef.current as HTMLDivElement;
    const isClickedInside = noticeComponent.contains(e.target as Node);
    if (!isClickedInside) {
      settingClose();
    }
  };

  const handleMessageDelete = (e: React.MouseEvent) => {
    const selectedIndex = parseInt(e.currentTarget.getAttribute('data-tabindex') || '0', 10);
    const filteredData = messageLogs?.filter((item, index) => index !== selectedIndex);
    localStorage.setItem('messageLog', JSON.stringify(filteredData));
    setMessageLogs(filteredData);
  };

  const handleAllMessageDelete = () => {
    localStorage.removeItem('messageLog');
    setMessageLogs([]);
  };

  const handleKeyDown = () => {
    return false;
  };

  useEffect(() => {
    const messageData = localStorage.getItem('messageLog');
    if (messageData) {
      const parsedData = JSON.parse(messageData);
      setMessageLogs(parsedData);
    } else {
      setMessageLogs([]);
    }

    contentsRef.addEventListener('click', clickClose);

    return () => {
      contentsRef.removeEventListener('click', clickClose);
    };
  }, []);
  return (
    <Setting ref={noticeRef} style={{ right: menuRightPx }}>
      <MessageList>
        {messageLogs?.map((logs, index) => (
          <Message key={`${logs.receiver}/${logs.content}/${logs.sendDate}`} data-index={index}>
            <MessageInfo>
              <MessageHeader>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: isDarkMode ? '#EDECEB' : '#1976d2' }}>
                  {logs.receiver}
                </span>
                <span
                  style={{
                    marginTop: '3px',
                    fontSize: '12px',
                    fontStyle: 'italic',
                    color: isDarkMode ? 'lightgray' : 'gray',
                  }}
                >
                  {logs.sendDate}
                </span>
                <HighlightOffIcon
                  data-tabindex={index}
                  color="error"
                  onClick={handleMessageDelete}
                  style={{ fontSize: '16px', cursor: 'pointer' }}
                />
              </MessageHeader>
              <MessageBody>
                <SubdirectoryArrowRightIcon
                  style={{
                    fontSize: '12px',
                    color: isDarkMode ? '#EDECEB' : 'gray',
                    marginRight: '5px',
                  }}
                />
                <span style={{ color: isDarkMode ? 'lightgray' : 'gray' }}>{logs.content}</span>
              </MessageBody>
            </MessageInfo>
          </Message>
        ))}
        <li style={{ textAlign: 'center', fontSize: '12px', color: 'gray', marginTop: '10px' }}>
          더 이상 기록이 없습니다.
          <br />
          Total : {messageLogs?.length}
        </li>
      </MessageList>
      <MessageDelete>
        <span
          role="presentation"
          onClick={handleAllMessageDelete}
          onKeyDown={handleKeyDown}
          style={{
            cursor: 'pointer',
            marginRight: '10px',
            marginTop: '18px',
            height: '15px',
          }}
        >
          전송 내역 비우기
        </span>
      </MessageDelete>
    </Setting>
  );
};

export default MessageNotice;
