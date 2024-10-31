import {
  Button,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  apiMapping,
  publishingPlatformMapping,
  PublishingPlatFormRecord,
} from './publishing-platform-mapping';
import DiscordPublishModal from './modal/discord-publish-modal';
import TelegramPublishModal from './modal/telegram-publish-modal';
import MessengerPublishModal from './modal/messenger-publish-modal';
import CenterBox from '@/Components/CommonStyles/Centerbox';
import AntSwitch from './ant-switch';
import { MaterialSymbolsCloseRounded } from './icon/material-symbols';

export default function PublishBody() {
  // #form

  //   const form = useFormik({
  //     validationSchema: schema,
  //     initialValues: {},
  //   });

  //#region state
  const theme: Theme = useTheme();
  const mode = useMemo<boolean>(
    () => theme.palette.mode === 'light',
    [theme.palette.mode]
  );

  const [changelogHover, setChangelogHover] = useState<boolean>(false);
  const [changelogText, setChangelogText] = useState<string>('');

  const [selectedOptions, setSelectedOption] = useState<boolean[]>(
    publishingPlatformMapping.map(() => true)
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedConfigure, setSelectedConfigure] =
    useState<PublishingPlatFormRecord | null>(null);

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);

  function getModalContent() {
    if (selectedConfigure) {
      switch (selectedConfigure.title) {
        case 'Discord':
          return <DiscordPublishModal />;
        case 'Telegram':
          return <TelegramPublishModal setOpen={setOpenModal} />;
        case 'Messenger':
          return <MessengerPublishModal />;
      }
    }
    return <Fragment />;
  }
  //#region render
  return (
    <CenterBox
      sx={{
        width: '100%',
        minHeight: '100vh',
        alignItems: 'start',
        paddingY: '2rem',
        bgcolor: mode ? '#f7f7fa' : 'black',
        zIndex: 1,
      }}
    >
      <CenterBox
        sx={{
          flexDirection: 'column',
          maxWidth: '100%',
          width: '800px',
          justifyContent: 'start',
          alignItems: 'start',
          gap: '40px',
        }}
      >
        <CenterBox sx={{ flexDirection: 'column', width: '100%', gap: '1rem' }}>
          <CenterBox
            sx={{
              gap: '1rem',
              justifyContent: 'start',
              width: '100%',
            }}
          >
            <CenterBox
              sx={{
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              Changelog
            </CenterBox>
            <Button
              type="button"
              sx={{
                color: 'rgb(77, 83, 232)',
                width: '80px',
                fontSize: '12px',
                height: '24px',
                textTransform: 'none',
                border: `1px solid ${
                  mode ? 'rgb(240, 240, 245)' : 'rgb(77, 83, 232)'
                }`,
                bgcolor: mode ? 'white' : '#121212',
                fontWeight: 600,
                borderRadius: '6px',
              }}
            >
              Generate
            </Button>
          </CenterBox>
          <CenterBox sx={{ position: 'relative', width: '100%' }}>
            <TextField
              multiline
              minRows={3}
              placeholder={
                !changelogHover
                  ? `Enter this bot version's changlog`
                  : `Press [Tab] to start generating and publish a record`
              }
              fullWidth
              sx={{
                borderRadius: '8px',
                border: `1px solid ${
                  mode ? 'rgb(240, 240, 245)' : '#121212'
                } !important`,
                bgcolor: mode ? 'white' : '#121212',
                '> *': {
                  padding: '.75rem',
                },
              }}
              onMouseOver={() => {
                setChangelogHover(true);
              }}
              onMouseLeave={() => {
                setChangelogHover(false);
              }}
              value={changelogText}
              onChange={(e) => {
                if (e.target.value.length <= 2000) {
                  setChangelogText(e.target.value);
                }
              }}
            />
            <CenterBox
              sx={{ position: 'absolute', bottom: '1rem', right: '1rem' }}
            >
              {changelogText.length}/2000
            </CenterBox>
          </CenterBox>
        </CenterBox>

        <CenterBox sx={{ flexDirection: 'column', width: '100%', gap: '1rem' }}>
          <CenterBox
            sx={{
              gap: '.5rem',
              justifyContent: 'start',
              width: '100%',
              '*': {
                fontSize: '18px',
                fontWeight: '600',
              },
            }}
          >
            <CenterBox>Publish to</CenterBox>
            <CenterBox
              sx={{
                color: 'red',
                userSelect: 'none',
              }}
            >
              *
            </CenterBox>
          </CenterBox>
          <CenterBox>
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
              By publishing your bot on the following platforms, you fully
              understand and agree to abide by{' '}
              <span>Terms of service for each publishing channel</span>{' '}
              (including, but not limited to, any privacy policy, community
              guidelines, data processing agreement, etc.).
            </Typography>
          </CenterBox>

          <CenterBox sx={{ width: '100%' }}>
            <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
              <Table
                sx={{ minWidth: 650, th: { position: 'relative' } }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ width: '220px', fontSize: '12px', fontWeight: 600 }}
                    >
                      Publishing platform
                    </TableCell>
                    <TableCell sx={{ position: 'relative', width: '580px' }}>
                      {/* <CenterBox sx={{ height: '100%' }}>
                          <CenterBox>User message billing: On</CenterBox>
                          <Tooltip title="Add">
                            <Button>Grow</Button>
                          </Tooltip>
                        </CenterBox> */}
                      <CenterBox
                        sx={{
                          gap: '4px',
                          justifyContent: 'end',
                          img: {
                            width: '100%',
                            height: '100%',
                          },
                        }}
                      >
                        <CenterBox
                          sx={{
                            marginRight: '.5rem',
                            fontWeight: 600,
                            fontSize: '14px',
                          }}
                        >
                          User message billing: On
                        </CenterBox>
                        <CenterBox>Support platforms:</CenterBox>
                        <CenterBox
                          sx={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <img src="/src/assets/platform-icon/coze.jpeg" />
                        </CenterBox>
                        <CenterBox
                          sx={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <img src="/src/assets/platform-icon/discord.jpeg" />
                        </CenterBox>
                        <CenterBox
                          sx={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <img src="/src/assets/platform-icon/telegram.png" />
                        </CenterBox>
                      </CenterBox>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {publishingPlatformMapping.map((row, index) => (
                    <TableRow
                      key={`publisher-${index}`}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <CenterBox sx={{ gap: '1rem' }}>
                          <AntSwitch
                            checked={selectedOptions[index]}
                            onChange={() => {
                              setSelectedOption(
                                selectedOptions.map((record, tmpIndex) => {
                                  return tmpIndex === index ? !record : record;
                                })
                              );
                            }}
                          />
                          <CenterBox
                            sx={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              bgcolor: 'white',
                              border: '1px solid rgb(240, 240, 245)',
                              img: {
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              },
                            }}
                          >
                            <img
                              src={
                                typeof row.img === 'string'
                                  ? row.img
                                  : URL.createObjectURL(row.img)
                              }
                            />
                          </CenterBox>
                          <CenterBox
                            sx={{
                              justifyContent: 'start',
                              flex: 1,
                              fontSize: '14',
                              fontWeight: 600,
                            }}
                          >
                            {row.title}
                          </CenterBox>
                        </CenterBox>
                      </TableCell>
                      <TableCell align="right">
                        <CenterBox sx={{ justifyContent: 'start' }}>
                          <CenterBox
                            sx={{
                              color:
                                row.state === 2
                                  ? 'rgb(28, 97, 43)'
                                  : 'rgb(75, 74, 88)',
                              //   width: '80px',
                              fontSize: '12px',
                              height: '24px',
                              textTransform: 'none',
                              //   border: '1px solid rgb(240, 240, 245)',
                              bgcolor:
                                row.state === 2
                                  ? 'rgba(62, 194, 84, 0.15)'
                                  : 'rgba(139, 139, 149, 0.15)',
                              fontWeight: 600,
                              borderRadius: '6px',
                              textWrap: 'nowrap',
                              px: '.5rem',
                            }}
                          >
                            {!row.state
                              ? 'Unauthorized'
                              : row.state === 1
                              ? 'Not configured'
                              : 'Authorized'}
                          </CenterBox>
                          <CenterBox
                            sx={{
                              flex: 1,
                              height: '100%',
                              justifyContent: 'end',
                            }}
                          >
                            <Button
                              sx={{
                                color: 'rgb(77, 83, 232)',
                                width: '80px',
                                fontSize: '12px',
                                height: '24px',
                                textTransform: 'none',
                                border: `1px solid ${
                                  mode
                                    ? 'rgb(240, 240, 245)'
                                    : 'rgb(77, 83, 232)'
                                }`,
                                bgcolor: mode ? 'white' : 'black',
                                fontWeight: 600,
                                borderRadius: '6px',
                              }}
                              onClick={() => {
                                setSelectedConfigure(row);
                                setOpenModal(true);
                              }}
                            >
                              Configure
                            </Button>
                          </CenterBox>
                        </CenterBox>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CenterBox>

          <CenterBox sx={{ width: '100%', mt: '1rem' }}>
            <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
              <Table
                sx={{ minWidth: 650, th: { position: 'relative' } }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ width: '220px', fontSize: '12px', fontWeight: 600 }}
                    >
                      Publishing platform
                    </TableCell>
                    <TableCell sx={{ position: 'relative', width: '580px' }}>
                      {/* <CenterBox sx={{ height: '100%' }}>
                          <CenterBox>User message billing: On</CenterBox>
                          <Tooltip title="Add">
                            <Button>Grow</Button>
                          </Tooltip>
                        </CenterBox> */}
                      <CenterBox
                        sx={{
                          gap: '4px',
                          justifyContent: 'end',
                          img: {
                            width: '100%',
                            height: '100%',
                          },
                        }}
                      >
                        <CenterBox
                          sx={{
                            marginRight: '.5rem',
                            fontWeight: 600,
                            fontSize: '14px',
                          }}
                        >
                          User message billing: On
                        </CenterBox>
                        <CenterBox>Support platforms:</CenterBox>
                        <CenterBox
                          sx={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <img src="/src/assets/platform-icon/coze.jpeg" />
                        </CenterBox>
                        <CenterBox
                          sx={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <img src="/src/assets/platform-icon/discord.jpeg" />
                        </CenterBox>
                        <CenterBox
                          sx={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <img src="/src/assets/platform-icon/telegram.png" />
                        </CenterBox>
                      </CenterBox>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiMapping.map((row, index) => (
                    <TableRow
                      key={`publisher-${index}`}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <CenterBox sx={{ gap: '1rem' }}>
                          <AntSwitch
                            checked={selectedOptions[index]}
                            onChange={() => {
                              setSelectedOption(
                                selectedOptions.map((record, tmpIndex) => {
                                  return tmpIndex === index ? !record : record;
                                })
                              );
                            }}
                          />
                          <CenterBox
                            sx={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              bgcolor: 'white',
                              border: '1px solid rgb(240, 240, 245)',
                              img: {
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              },
                            }}
                          >
                            <img
                              src={
                                typeof row.img === 'string'
                                  ? row.img
                                  : URL.createObjectURL(row.img)
                              }
                            />
                          </CenterBox>
                          <CenterBox
                            sx={{
                              justifyContent: 'start',
                              flex: 1,
                              fontSize: '14',
                              fontWeight: 600,
                            }}
                          >
                            {row.title}
                          </CenterBox>
                        </CenterBox>
                      </TableCell>
                      <TableCell align="right">
                        <CenterBox sx={{ justifyContent: 'start' }}>
                          <CenterBox
                            sx={{
                              color:
                                row.state === 2
                                  ? 'rgb(28, 97, 43)'
                                  : 'rgb(75, 74, 88)',
                              //   width: '80px',
                              fontSize: '12px',
                              height: '24px',
                              textTransform: 'none',
                              //   border: '1px solid rgb(240, 240, 245)',
                              bgcolor:
                                row.state === 2
                                  ? 'rgba(62, 194, 84, 0.15)'
                                  : 'rgba(139, 139, 149, 0.15)',
                              fontWeight: 600,
                              borderRadius: '6px',
                              textWrap: 'nowrap',
                              px: '.5rem',
                            }}
                          >
                            {!row.state
                              ? 'Unauthorized'
                              : row.state === 1
                              ? 'Not configured'
                              : 'Authorized'}
                          </CenterBox>
                        </CenterBox>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CenterBox>
        </CenterBox>
      </CenterBox>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <CenterBox
          sx={{
            width: '100vw',
            height: '100vh',
            flexDirection: 'column',
            gap: '3rem',
            form: {
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            },
          }}
        >
          <CenterBox
            sx={{
              width: '560px',
              padding: '24px',
              borderRadius: '1rem',
              boxSizing: 'border-box',
              bgcolor: mode?'rgb(245, 247, 250)':'#2f2f2f',
              flexDirection: 'column',
              gap: '2rem',
            }}
          >
            <CenterBox sx={{ width: '100%' }}>
              <CenterBox
                sx={{
                  flex: 1,
                  justifyContent: 'start',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                Configure {selectedConfigure?.title} bot
              </CenterBox>
              <IconButton
                onClick={() => setOpenModal(false)}
                sx={{
                  width: '24px !important',
                  aspectRatio: '1/1',
                  height: '24px',
                //   color: 'black',
                  p: 0,
                }}
              >
                <MaterialSymbolsCloseRounded width={'20px'} height={'20px'} />
              </IconButton>
            </CenterBox>
            {getModalContent()}
            {/* <CenterBox sx={{ justifyContent: 'end', width: '100%' }}>
                <Button
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
              </CenterBox> */}
          </CenterBox>
        </CenterBox>
      </Modal>
    </CenterBox>
  );
}
