import { Button, IconButton, TextField, Theme, Typography, useTheme } from '@mui/material';
import { Fragment } from 'react/jsx-runtime';
import { useMemo, useState } from 'react';
import { MaterialSymbolsContentCopy } from '../icon/material-symbols';
import * as y from 'yup';
import { useFormik } from 'formik';
import CenterBox from '@/Components/CommonStyles/Centerbox';

export default function MessengerPublishModal() {
  //#region state
  const theme: Theme = useTheme();
  const mode = useMemo<boolean>(
    () => theme.palette.mode === 'light',
    [theme.palette.mode]
  );

  const [callBackUrl, setCallbackUrl] = useState<string>(
    'https://api.coze.com/adapter/messenger/webhook'
  );
  const [verifyToken, setVerifyToken] = useState<string>('coze');

  //#region form
  const yupSchema = y.object().shape({
    page_access_token: y
      .string()
      .max(2000, 'Bot token must be least than 2000 characters')
      .required('Bot token can not be empty'),
    page_id: y
      .string()
      .max(2000, 'Bot page ID must be least than 2000 characters')
      .required('Bot page ID can not be empty'),
    app_secret_key: y
      .string()
      .max(2000, 'Bot app secret must be least than 2000 characters')
      .required('Bot app secret can not be empty'),
  });

  const form = useFormik({
    validationSchema: yupSchema,
    initialValues: {
      page_access_token: '',
      page_id: '',
      app_secret_key: '',
    },
    onSubmit: handleSubmit,
  });

  //#region func
  function handleSubmit(data: y.InferType<typeof yupSchema>) {
    fetch('', {
      body: JSON.stringify(data),
    });
  }

  //#region render
  return (
    <Fragment>
      <form onSubmit={form.handleSubmit}>
        <CenterBox
          sx={{
            flexDirection: 'column',
            alignItems: 'start',
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              span: {
                color: 'rgb(77, 83, 232)',
                fontWeight: '600',
                cursor: 'pointer',
              },
            }}
          >
            Chat with your bot on Messenger and use a Meta Business Acccount to
            share it with others.{' '}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              span: {
                color: 'rgb(77, 83, 232)',
                fontWeight: '600',
                cursor: 'pointer',
              },
            }}
          >
            <span>How to configure Messenger Bot? Check the doc</span>{' '}
          </Typography>
        </CenterBox>
        <CenterBox
          sx={{
            width: '100%',
            py: '0rem',
            gap: '.5rem',
            flexDirection: 'column',
          }}
        >
          <CenterBox
            sx={{
              gap: '.5rem',
              justifyContent: 'start',
              width: '100%',
              '*': {
                fontSize: '14px',
                fontWeight: '600',
              },
            }}
          >
            <CenterBox
              sx={{
                width: '1rem',
                height: '1rem',
                bgcolor: 'rgb(77, 83, 232)',
                borderRadius: '50%',
                fontSize: '9px',
                color: 'white',
                userSelect: 'none',
              }}
            >
              1
            </CenterBox>
            <CenterBox>Configure webhooks in Meta for Developers</CenterBox>
          </CenterBox>
        </CenterBox>

        <CenterBox
          sx={{
            width: '100%',
            py: '0rem',
            gap: '.5rem',
            flexDirection: 'column',
          }}
        >
          <CenterBox
            sx={{
              gap: '.5rem',
              justifyContent: 'start',
              flexDirection: 'column',
              width: '100%',
              '*': {
                fontSize: '14px',
                fontWeight: '600',
              },
            }}
          >
            <CenterBox
              sx={{
                gap: '.5rem',
                justifyContent: 'start',
                width: '100%',
                '*': {
                  fontSize: '14px',
                  fontWeight: '600',
                },
              }}
            >
              Callback URL
            </CenterBox>
            <CenterBox
              sx={{ justifyContent: 'start', width: '100%', gap: '.5rem' }}
            >
              <CenterBox fontWeight={300}>{callBackUrl}</CenterBox>
              <IconButton
                // onClick={() => setOpenModal(false)}
                sx={{
                  width: '24px !important',
                  aspectRatio: '1/1',
                  height: '24px',
                  color: 'rgb(77, 83, 232)',
                  p: 0,
                }}
              >
                <MaterialSymbolsContentCopy width={'20px'} height={'20px'} />
              </IconButton>
            </CenterBox>
          </CenterBox>
          <CenterBox
            sx={{
              gap: '.5rem',
              justifyContent: 'start',
              flexDirection: 'column',
              width: '100%',
              '*': {
                fontSize: '14px',
                fontWeight: '600',
              },
            }}
          >
            <CenterBox
              sx={{
                gap: '.5rem',
                justifyContent: 'start',
                width: '100%',
                '*': {
                  fontSize: '14px',
                  fontWeight: '600',
                },
              }}
            >
              Verify Token
            </CenterBox>
            <CenterBox
              sx={{ justifyContent: 'start', width: '100%', gap: '.5rem' }}
            >
              <CenterBox fontWeight={300}>{verifyToken}</CenterBox>
              <IconButton
                // onClick={() => setOpenModal(false)}
                sx={{
                  width: '24px !important',
                  aspectRatio: '1/1',
                  height: '24px',
                  color: 'rgb(77, 83, 232)',
                  p: 0,
                }}
              >
                <MaterialSymbolsContentCopy width={'20px'} height={'20px'} />
              </IconButton>
            </CenterBox>
          </CenterBox>
        </CenterBox>
        <CenterBox
          sx={{
            width: '100%',
            py: '0rem',
            gap: '.5rem',
            flexDirection: 'column',
          }}
        >
          <CenterBox
            sx={{
              gap: '.5rem',
              justifyContent: 'start',
              width: '100%',
              '*': {
                fontSize: '14px',
                fontWeight: '600',
              },
            }}
          >
            <CenterBox
              sx={{
                width: '1rem',
                height: '1rem',
                bgcolor: 'rgb(77, 83, 232)',
                borderRadius: '50%',
                fontSize: '9px',
                color: 'white',
                userSelect: 'none',
              }}
            >
              2
            </CenterBox>
            <CenterBox>Messenger bot token</CenterBox>
          </CenterBox>
        </CenterBox>
        <CenterBox
          sx={{
            width: '100%',
            py: '0rem',
            pl: '.5rem',
            flexDirection: 'column',
          }}
        >
          <CenterBox
            sx={{
              gap: '.5rem',
              justifyContent: 'start',
              width: '100%',
              '*': {
                fontSize: '14px',
                fontWeight: '600',
              },
            }}
          >
            <CenterBox>Messenger Bot Token</CenterBox>
            <CenterBox
              sx={{
                color: 'red',
                userSelect: 'none',
              }}
            >
              *
            </CenterBox>
          </CenterBox>
          <CenterBox sx={{ position: 'relative', width: '100%' }}>
            <TextField
              placeholder=""
              autoCorrect="off"
              fullWidth
              sx={{
                borderRadius: '8px',
                border: `none !important`,
                bgcolor: mode ? 'white' : 'transparent',
                input: {
                  padding: '.5rem',
                },
              }}
              name="page_access_token"
              onChange={form.handleChange}
              value={form.values.page_access_token}
            />
          </CenterBox>
        </CenterBox>
        <CenterBox
          sx={{
            width: '100%',
            py: '0rem',
            pl: '.5rem',
            flexDirection: 'column',
          }}
        >
          <CenterBox
            sx={{
              gap: '.5rem',
              justifyContent: 'start',
              width: '100%',
              '*': {
                fontSize: '14px',
                fontWeight: '600',
              },
            }}
          >
            <CenterBox>Messenger Bot Page ID</CenterBox>
            <CenterBox
              sx={{
                color: 'red',
                userSelect: 'none',
              }}
            >
              *
            </CenterBox>
          </CenterBox>
          <CenterBox sx={{ position: 'relative', width: '100%' }}>
            <TextField
              placeholder=""
              fullWidth
              autoCorrect="off"
              sx={{
                borderRadius: '8px',
                border: `none`,
                bgcolor: mode ? 'white' : 'transparent',
                input: {
                  padding: '.5rem',
                },
              }}
              name="page_id"
              onChange={form.handleChange}
              value={form.values.page_id}
            />
          </CenterBox>
        </CenterBox>
        <CenterBox
          sx={{
            width: '100%',
            py: '0rem',
            pl: '.5rem',
            flexDirection: 'column',
          }}
        >
          <CenterBox
            sx={{
              gap: '.5rem',
              justifyContent: 'start',
              width: '100%',
              '*': {
                fontSize: '14px',
                fontWeight: '600',
              },
            }}
          >
            <CenterBox>Messenger Bot App Secret</CenterBox>
            <CenterBox
              sx={{
                color: 'red',
                userSelect: 'none',
              }}
            >
              *
            </CenterBox>
          </CenterBox>
          <CenterBox sx={{ position: 'relative', width: '100%' }}>
            <TextField
              placeholder=""
              fullWidth
              autoCorrect="off"
              sx={{
                borderRadius: '8px',
                border: `none`,
                bgcolor: mode ? 'white' : 'transparent',
                input: {
                  padding: '.5rem',
                },
              }}
              name="app_secret_key"
              onChange={form.handleChange}
              value={form.values.app_secret_key}
            />
          </CenterBox>
        </CenterBox>
        <CenterBox sx={{ justifyContent: 'end', width: '100%' }}>
          <Button
            type="submit"
            sx={{
              bgcolor: 'rgba(78,64,229,255)',
              color: 'white',
              borderRadius: '8px',
              '&:disabled': {
                bgcolor: 'rgba(78,64,229,.5)',
                color: 'white',
              },
            }}
            // disabled
          >
            Save
          </Button>
        </CenterBox>
      </form>
    </Fragment>
  );
}
