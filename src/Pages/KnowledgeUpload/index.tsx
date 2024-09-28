import { useState } from 'react';
import * as y from 'yup';
import CenterBox from './components/center-box';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import {
  DecorationBackgroundIcon,
  DecorationIcon,
} from './components/icon/custom-icon';
import KnowledgeModal from './components/knowledge-modal';

//#region interface
export interface KnowledgeForm {
  name: string;
  description?: string | null;
}

interface KnowledgeRecord {
  icon?: File | string;
  name: string;
  description: string;
  type: number;
  size: number;
  updated_at: Date;
  isDisable?: boolean;
}
export default function KnowledgeUpload() {
  //#region form
  const schema = y.object({
    name: y
      .string()
      .required('Knowledge name cannot be empty')
      .max(2000, 'Knowledge name cannot be larger than 2000 characters'),
    description: y.string().nullable().max(2000, ''),
  });

  const methods = useForm<KnowledgeForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  //#region state
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeRecord[]>([]);

  //#region func
  function handldeSubmit(data: KnowledgeForm) {
    console.log(data);
  }

  return (
    <CenterBox sx={{ bgcolor: '#f4f4f6', minHeight: '100vh' }}>
      {knowledgeList.length ? (
        <CenterBox>A</CenterBox>
      ) : (
        <CenterBox
          sx={{
            flexDirection: 'column',
            gap: '24px',
            width: '576px',
            maxWidth: '100%',
            position: 'relative',
          }}
        >
          <CenterBox
            sx={{
              height: 'auto',
              flexDirection: 'column',
              aspectRatio: '2/1',
              width: '100%',
            }}
          >
            <CenterBox
              sx={{ position: 'absolute', top: 0, justifyContent: 'center' }}
            >
              <DecorationIcon />
            </CenterBox>
            <DecorationBackgroundIcon />
          </CenterBox>
          <CenterBox sx={{ flexDirection: 'column' }}>
            <CenterBox sx={{ fontWeight: 'bold', fontSize: '20px' }}>
              Knowledge not found
            </CenterBox>
            <CenterBox sx={{ color: 'rgba(6, 7, 9, 0.3)', fontSize: '14px' }}>
              Please create first and then add
            </CenterBox>
          </CenterBox>
          <Button
            sx={{
              bgcolor: '#e8eaf8',
              color: '#4d3fe4',
              fontWeight: 'bold',
              paddingX: '20px',
              fontSize: '16px',
            }}
            onClick={() => setOpenModal(!openModal)}
          >
            Create knowledge
          </Button>
        </CenterBox>
      )}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handldeSubmit)}>
          <KnowledgeModal open={openModal} setOpenModal={setOpenModal} />
        </form>
      </FormProvider>
    </CenterBox>
  );
}
