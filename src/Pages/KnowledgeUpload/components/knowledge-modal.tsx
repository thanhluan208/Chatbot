import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { KnowledgeForm } from '..';
import CenterBox from './center-box';
import { MaterialSymbolsCloseRounded } from './icon/material-symbols';
//#region interface
interface KnowledgeModalProp {
  open: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function KnowledgeModal({
  open,
  setOpenModal,
}: KnowledgeModalProp) {
  //#region form
  const methods = useFormContext<KnowledgeForm>();

  //#region render
  return (
    <Modal
      open={open}
      onClose={() => setOpenModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <CenterBox
        sx={{
          bgcolor: 'rgb(249, 249, 249)',
          maxWidth: '500px',
          height: '800px',
          maxHeight: '100%',
          width: '100%',
          padding: '2rem',
          boxSizing: 'border-box',
          borderRadius: '8px',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <CenterBox sx={{ display: 'flex', width: '100%' }}>
          <CenterBox
            sx={{
              lineHeight: '22px',
              fontSize: '18px',
              fontWeight: 600,
              justifyContent: 'start',
              flex: 1,
            }}
          >
            Create knowledge
          </CenterBox>
          <IconButton sx={{ padding: 0, width: '2rem', height: '2rem' }}>
            <MaterialSymbolsCloseRounded width={'2rem'} height={'2rem'} />
          </IconButton>
        </CenterBox>
        <CenterBox
          sx={{
            flex: 1,
            position: 'relative',
            width: '100%',
          }}
        >
          <CenterBox
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'auto',
              scrollbarWidth: 'thin',
              alignItems: 'start',
            }}
          >
            <CenterBox
              sx={{
                width: '100%',
                gap: '2rem',
                flexDirection: 'column',
                justifyContent: 'start',
              }}
            >
              <CenterBox
                sx={{
                  gap: '.5rem',
                  height: '70px',
                  width: '100%',
                  //   flexDirection: 'column',

                  '>*': {
                    height: '100%',
                    width: 'calc(100% / 3)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'white',
                    boxSizing: 'border-box',
                    border: '1px solid rgba(6, 7, 9, 0.15)',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: 'rgba(6, 7, 9, 0.15)',
                    },
                  },
                }}
              >
                <Button>A</Button>
                <Button>A</Button>
                <Button>A</Button>
              </CenterBox>
              <CenterBox sx={{ flexDirection: 'column', width: '100%' }}>
                <CenterBox
                  sx={{
                    paddingX: '8px',
                    paddingBottom: '6px',
                    width: '100%',
                    justifyContent: 'start',
                  }}
                >
                  Name *
                </CenterBox>
                <CenterBox sx={{ width: '100%', position: 'relative' }}>
                  <TextField
                    fullWidth
                    sx={{
                      '> *': { borderRadius: '.75rem' },
                      input: {
                        p: '.5rem',
                        px: '.75rem',
                        outline: 'none !important',
                        borderRadius: '1rem',
                      },
                    }}
                    minRows={1}
                    autoComplete="off"
                    placeholder="Knowledge name cannot be empty"
                    {...methods.register('name')}
                  />
                  <CenterBox
                    sx={{
                      position: 'absolute',
                      fontSize: '12px',
                      right: '.5rem',
                      bottom: '.5rem',
                    }}
                  >
                    {methods.watch('description')?.length}/2000
                  </CenterBox>
                </CenterBox>
              </CenterBox>
              <CenterBox sx={{ flexDirection: 'column', width: '100%' }}>
                <CenterBox
                  sx={{
                    paddingX: '8px',
                    paddingBottom: '6px',
                    width: '100%',
                    justifyContent: 'start',
                  }}
                >
                  Description
                </CenterBox>
                <CenterBox sx={{ width: '100%', position: 'relative' }}>
                  <TextField
                    fullWidth
                    sx={{
                      '> *': {
                        borderRadius: '.75rem',
                        padding: '.5rem !important',
                        // '> *': {
                        //   padding: '.5rem !important',
                        // },
                      },
                      textarea: {
                        px: '.15rem',
                        // py: '.25rem',
                        outline: 'none !important',
                        borderRadius: '1rem',
                      },
                    }}
                    multiline
                    minRows={2}
                    autoComplete="off"
                    placeholder="Enter the content of the dataset"
                    {...methods.register('description')}
                  />
                  <CenterBox
                    sx={{
                      position: 'absolute',
                      fontSize: '12px',
                      right: '.5rem',
                      bottom: '.5rem',
                    }}
                  >
                    {methods.watch('description')?.length}/2000
                  </CenterBox>
                </CenterBox>
              </CenterBox>
            </CenterBox>
          </CenterBox>
        </CenterBox>
        <CenterBox
          sx={{
            width: '100%',
            height: '32px',
            justifyContent: 'end',
            gap: '1rem',
            '> *': {
              fontWeight: 'bold',
              borderRadius: '.5rem',
              height: '100%',
            },
          }}
        >
          <Button
            sx={{
              bgcolor: 'rgba(6, 7, 9, 0.04)',
              color: 'black',
              '&:hover': {
                bgcolor: 'rgba(6, 7, 9, .5)',
              },
            }}
            type="button"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button
            sx={{
              bgcolor: 'rgba(78,64,229,255)',
              color: 'white',
              '&:disabled': {
                bgcolor: 'rgba(78,64,229,.5)',
                color: 'white',
              },
            }}
            // disabled
          >
            Next
          </Button>
        </CenterBox>
      </CenterBox>
    </Modal>
  );
}
