import CenterBox from '@/Components/CommonStyles/Centerbox';
import PublishPageHeader from './components/Header';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import PublishBody from './components/Body';

//#region interface
export interface PublishPageContextParam {
  currentBotId: string;
  setCurrentBotId: Dispatch<SetStateAction<string>>;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

//#region context

const PublishPageContext = createContext<PublishPageContextParam>({
  currentBotId: '',
  setCurrentBotId: () => {},
  openModal: false,
  setOpenModal: () => {},
});

export const usePublishPage = () => useContext(PublishPageContext);

export default function PublishPage() {
  //#region state
  const [currentBotId, setCurrentBotId] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);

  const contextValue: PublishPageContextParam = {
    currentBotId,
    setCurrentBotId,
    openModal,
    setOpenModal,
  };
  //#region render
  return (
    <PublishPageContext.Provider value={contextValue}>
      <CenterBox
        sx={{
          flexDirection: 'column',
          //   bgcolor: 'red',
          width: '100%',
          minHeight: '100vh',
          justifyContent: 'start',
          button: {
            outline: 'none !important',
            textTransform: 'none',
          },
        }}
      >
        <PublishPageHeader />
        <PublishBody />
      </CenterBox>
    </PublishPageContext.Provider>
  );
}
