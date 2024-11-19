import { Button, TextField, Theme, Typography, useTheme } from '@mui/material';
import { Fragment } from 'react/jsx-runtime';
import { useFormik } from 'formik';
import * as y from 'yup';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import CenterBox from '@/Components/CommonStyles/Centerbox';

const BASE_URL = 'https://2aa3-58-187-68-62.ngrok-free.app/';
const botID = 'd78f0cf7-8895-47f5-a7a1-66a6865c23e9'
export default function TelegramPublishModal({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const theme: Theme = useTheme();
  const mode = useMemo<boolean>(
    () => theme.palette.mode === 'light',
    [theme.palette.mode]
  );


  const yupSchema = y.object().shape({
    token: y
      .string()
      .max(2000, 'Token key must be least than 2000 characters')
      .required('Token key can not be empty'),
  });

  //#region hook
  const form = useFormik({
    validationSchema: yupSchema,
    initialValues: {
      // token: '7721917580:AAGE4uU3T9M2U_13pWSQhJUrUAmVeWZk-eg',
      token: '',
    },
    onSubmit: handleSubmit,
  });

  const [isExist, setIsExist] = useState<boolean>(false);

  function handleSubmit(data: y.InferType<typeof yupSchema>) {
    console.log(data);
    const payload = { ...data, bot_id: botID };
    fetch(`${BASE_URL}telebot/add_bot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(() => {
      setOpen(false);
    });
  }

  //
  useEffect(() => {
    getBotConfiguration();
  }, []);

  //#region function
  async function getBotConfiguration(): Promise<boolean> {
    form.resetForm();
    try {
      const response = await fetch(`${BASE_URL}telebot/get_bot_configuration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_id: 'd78f0cf7-8895-47f5-a7a1-66a6865c23e9',
        }),
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setIsExist(data.bot_configuration.is_activate ?? false);
        form.resetForm({
          values: { token: data.bot_configuration.token },
        });
        return true;
      }
      setIsExist(false);
      return false;
    } catch (error) {
      setIsExist(false);
      return false;
    }
  }

  async function handleDeleteBot() {
    try {
      const response = await fetch(`${BASE_URL}telebot/remove_bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_id: botID,
        }),
      });
      if (response) {
        setOpen(false);
      }
    } catch (error) {
      setIsExist(false);
      return false;
    }
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
            Connect to Telegram bots and chat with this bot in Telegram App.{' '}
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
            <span>How to get Telegram Bot Token?</span>{' '}
          </Typography>
        </CenterBox>
        <CenterBox sx={{ width: '100%', py: '3rem', flexDirection: 'column' }}>
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
            <CenterBox>Telegram bot token</CenterBox>
            <CenterBox
              sx={{
                color: 'red',
                userSelect: 'none',
              }}
            >
              *
            </CenterBox>
          </CenterBox>
          <CenterBox
            sx={{
              position: 'relative',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <TextField
              placeholder="Please enter Telegram bot token"
              autoComplete="off"
              name="token"
              fullWidth
              sx={{
                borderRadius: '8px',
                border: `none !important`,
                bgcolor: mode ? 'white' : 'transparent',
                input: {
                  padding: '.5rem',
                },
              }}
              value={form.values.token}
              disabled={isExist}
              onChange={form.handleChange}
              // onMouseOver={() => {
              //   setChangelogHover(true);
              // }}
              // onMouseLeave={() => {
              //   setChangelogHover(false);
              // }}
              // value={changelogText}
              // onChange={(e) => {
              //   if (e.target.value.length <= 2000) {
              //     setChangelogText(e.target.value);
              //   }
              // }}
            />
            {form.errors.token && form.touched.token && (
              <Typography sx={{ fontWeight: 600, color: 'red', width: '100%' }}>
                * {form.errors.token}
              </Typography>
            )}
          </CenterBox>
        </CenterBox>
        <CenterBox sx={{ justifyContent: 'end', width: '100%' }}>
          {isExist ? (
            <Button
              type="button"
              onClick={() => handleDeleteBot()}
              sx={{
                bgcolor: 'rgba(200,0,0)',
                color: 'white',
                borderRadius: '8px',
                '&:disabled': {
                  bgcolor: 'rgba(78,64,229,.5)',
                  color: 'white',
                },
                '&:hover': {
                  bgcolor: 'rgba(150,0,0)',
                },
              }}
              // disabled
            >
              Remove Configuration
            </Button>
          ) : (
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
          )}
        </CenterBox>
      </form>
    </Fragment>
  );
}
