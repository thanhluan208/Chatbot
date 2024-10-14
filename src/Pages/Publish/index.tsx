import CenterBox from '@/Components/CommonStyles/Centerbox';
import PublishPageHeader from './components/Header';
import { createContext, useContext } from 'react';
import PublishBody from './components/Body';

//#region interface
export interface PublishPageContextParam {}

//#region context

const PublishPageContext = createContext<PublishPageContextParam>({});

export const usePublishPage = () => useContext(PublishPageContext);

export default function PublishPage() {
  //#region render
  return (
    <PublishPageContext.Provider value={{}}>
      <CenterBox
        sx={{
          flexDirection: 'column',
          // bgcolor: 'red',
          width: '100vw',
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
