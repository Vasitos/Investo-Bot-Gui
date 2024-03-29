import { useEffect, useState, forwardRef } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Skeleton, Stack } from '@mui/material';

import Link from '@mui/material/Link'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/Info';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Rating } from 'react-simple-star-rating'
import { MdOutlineSentimentDissatisfied, MdOutlineSentimentNeutral, MdOutlineSentimentVerySatisfied } from "react-icons/md";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// components
import {
  AppWebsiteVisits,
  AppWidgetSummary,
} from '../sections/@dashboard/app';
// zustand
import { storeData } from '../states/stores';
// Api
import StockApi from '../services/stock';
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const getSearch = storeData(state => state.search);
  const vertical = "top";
  const horizontal = "center";
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stockDatesInfo, setStockDatesInfo] = useState({});
  const [stockClosingInfo, setStockClosingInfo] = useState({});
  const [stockHighInfo, setStockHighInfo] = useState({});
  const [stockLowInfo, setStockLowInfo] = useState({});
  const [stockVolumeInfo, setStockVolumeInfo] = useState({});
  const [stockInformation, setStockInformation] = useState(null);
  const [lowStock, setLowStock] = useState(0);
  const [highStock, setHighStock] = useState(0);
  const [closingStock, setClosingStock] = useState(0);
  const [volumeStock, setVolumeStock] = useState(0);
  const [stockDate, setStockDate] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [open, setOpen] = useState(false);
  const [openNews, setOpenNews] = useState(false);
  const [news, setNews] = useState([]);
  const [ratingSentiment, setRatingSentiment] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [responseStatus, setResponseStatus] = useState({});

  const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const handleClickNews = () => {
    setOpenNews(!openNews);
  };

  useEffect(() => {
    const currentSearch = getSearch.search;
    if (currentSearch) {
      if (currentStock !== currentSearch) {
        setCurrentStock(currentSearch);
        setLoading(true)
        setSearch(currentSearch)
      }
    }
  }, [getSearch]);

  useEffect(() => {
    if (search) {
      StockApi.getStock(search).then(res => {
        const keys = Object.keys(res.data.history.Low);
        const lastKey = keys[keys.length - 1];
        setLowStock(res.data.history.Low[lastKey])
        setHighStock(res.data.history.High[lastKey])
        setClosingStock(res.data.history.Close[lastKey])
        setVolumeStock(res.data.history.Volume[lastKey])
        setStockDate(lastKey)
        setStockDatesInfo(keys)
        setStockClosingInfo(Object.values(res.data.history.Close))
        setStockHighInfo(Object.values(res.data.history.High))
        setStockLowInfo(Object.values(res.data.history.Low))
        setStockVolumeInfo(Object.values(res.data.history.Volume))
      }).catch(() => {
        setLoading(true)
        setSearch("")
      });
      StockApi.getStockInformation(search).then(res => {
        setStockInformation(res.data.info);
      }).catch(() => {
        setLoading(true)
        setSearch("")
      });
      StockApi.getStockSentiment(search).then(res => {
        setNews(res.data.news);
        console.log(res.data.emotion)
        const sentiment = res.data.emotion
        if (sentiment === "positive") {
          setRatingSentiment(3)
        } else if (sentiment === "neutral") {
          setRatingSentiment(2)
        } else if (sentiment === "negative") {
          setRatingSentiment(1)
        }
      }).catch(() => {
        setLoading(true)
        setSearch("")
        setResponseStatus({message:"Ocurrió algo al buscar la acción, inténtelo nuevamente",severity:"error"})
        setOpenAlert(true);
      });
      setLoading(false)
      setResponseStatus({message:"Información obtenida de forma exitosa",severity:"success"})
      setOpenAlert(true);
    }
  }, [search]);

  return (
    <>
      <Helmet>
        <title> Dashboard | InvestoBot </title>
      </Helmet>

      <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleClose} severity={responseStatus.severity} sx={{ width: '100%' }}>
          {responseStatus.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="xl">
        {
          stockInformation == null &&
          <>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Hola, bienvenido a InvestoBot
            </Typography>
            <Typography variant="h5" sx={{ mb: 5 }}>
              Recuerde que la búsqueda se realiza por medio del símbolo <Link variant="h5" href="https://stockanalysis.com/stocks/" rel="noopener noreferrer" target="_blank">Ticker</Link>
            </Typography>
          </>
        }

        {
          loading ?
            <>
              {search !== "" &&
                <>
                  <Stack direction="row" spacing={10} sx={{ paddingBottom: "5%" }}>
                    <Skeleton variant="rectangular" width={300} height={300} />
                    <Skeleton variant="rectangular" width={300} height={300} />
                    <Skeleton variant="rectangular" width={300} height={300} />
                    <Skeleton variant="rectangular" width={300} height={300} />
                  </Stack>

                  <Stack direction="column" spacing={4}>
                    <Skeleton variant="rectangular" height={400} />
                    <Skeleton variant="rectangular" height={400} />
                    <Skeleton variant="rectangular" height={400} />
                  </Stack>
                </>
              }
            </> :
            <>
              {
                stockInformation &&
                <Typography variant="h4" sx={{ mb: 5 }}>
                  <a style={{ color: "inherit" }} href={stockInformation.website} rel="noopener noreferrer" target="_blank">{stockInformation.longName}</a>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {stockInformation.sector}, {stockInformation.industry}
                  </Typography>

                  <Typography variant="h6">
                    Reputación del publico
                  </Typography>
                  <Rating
                    customIcons={[
                      {
                        icon: <MdOutlineSentimentDissatisfied size={50} />
                      },
                      {
                        icon: <MdOutlineSentimentNeutral size={50} />
                      },
                      {
                        icon: <MdOutlineSentimentVerySatisfied size={50} />
                      }
                    ]}
                    fillColorArray={[
                      '#ff0000',
                      '#ffc800',
                      '#16cc20'
                    ]}
                    initialValue={ratingSentiment}
                    iconsCount={3}
                    titleSeparator="de"
                    readonly
                  />

                  <List
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      bgcolor: 'background.paper',
                      backgroundColor: 'transparent', // make it transparent
                      borderRadius: '10px' // add border radius to make it rounded
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                  >
                    <ListItemButton onClick={handleClick}>
                      <ListItemIcon>
                        <InboxIcon />
                      </ListItemIcon>
                      <ListItemText primary="Información basica" />
                      {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                          <Typography sx={{ mb: 5 }}>
                            {stockInformation.longBusinessSummary}
                          </Typography>
                        </ListItemButton>
                      </List>
                    </Collapse>
                  </List>

                  <List
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      bgcolor: 'background.paper',
                      backgroundColor: 'transparent', // make it transparent
                      borderRadius: '10px' // add border radius to make it rounded
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                  >
                    <ListItemButton onClick={handleClickNews}>
                      <ListItemIcon>
                        <InboxIcon />
                      </ListItemIcon>
                      <ListItemText primary="Noticias" />
                      {openNews ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openNews} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <List>
                          {
                            news.map((item, i) => {
                              return (
                                <ListItem key={i}>
                                  <Link variant="h5" href={item.link} rel="noopener noreferrer" target="_blank">{item.title}</Link>
                                </ListItem>
                              );
                            })
                          }
                        </List>
                      </List>
                    </Collapse>
                  </List>
                </Typography>
              }
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title={`Precio más bajo ${stockDate}`} total={lowStock} icon={'fluent-mdl2:stock-down'} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title={`Precio más alto ${stockDate}`} total={highStock} color="info" icon={'fluent-mdl2:stock-up'} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title={`Valor de cierre ${stockDate}`} total={closingStock} color="warning" icon={'mdi:cash-multiple'} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary title={`Volumen de la acción ${stockDate}`} total={volumeStock} color="error" icon={'ant-design:stock-outlined'} />
                </Grid>

                <Grid item xs={12} md={6} lg={100}>
                  <AppWebsiteVisits
                    title="Precio de cierre"
                    subheader={`Acción ${search}`}
                    chartLabels={stockDatesInfo}
                    chartData={[
                      {
                        name: 'Precio de cierre',
                        type: 'area',
                        fill: 'gradient',
                        data: stockClosingInfo,
                      },
                    ]}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={100}>
                  <AppWebsiteVisits
                    title="Volumen de la acción"
                    subheader={`Acción ${search}`}
                    chartLabels={stockDatesInfo}
                    chartData={[
                      {
                        name: 'Volumen',
                        type: 'area',
                        fill: 'gradient',
                        data: stockVolumeInfo,
                      }
                    ]}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={100}>
                  <AppWebsiteVisits
                    title="Acción más baja y alta"
                    subheader={`Accion ${search}`}
                    chartLabels={stockDatesInfo}
                    chartData={[
                      {
                        name: 'Acción más baja',
                        type: 'area',
                        fill: 'gradient',
                        data: stockLowInfo,
                      },
                      {
                        name: 'Acción más alta',
                        type: 'area',
                        fill: 'gradient',
                        data: stockHighInfo,
                      }
                    ]}
                  />
                </Grid>

                {/* <Grid item xs={12} md={6} lg={4}>
                    <AppCurrentVisits
                      title="Current Visits"
                      chartData={[
                        { label: 'America', value: 4344 },
                        { label: 'Asia', value: 5435 },
                        { label: 'Europe', value: 1443 },
                        { label: 'Africa', value: 4443 },
                      ]}
                      chartColors={[
                        theme.palette.primary.main,
                        theme.palette.info.main,
                        theme.palette.warning.main,
                        theme.palette.error.main,
                      ]}
                    />
                  </Grid>
                    
                  <Grid item xs={12} md={6} lg={8}>
                    <AppConversionRates
                      title="Conversion Rates"
                      subheader="(+43%) than last year"
                      chartData={[
                        { label: 'Italy', value: 400 },
                        { label: 'Japan', value: 430 },
                        { label: 'China', value: 448 },
                        { label: 'Canada', value: 470 },
                        { label: 'France', value: 540 },
                        { label: 'Germany', value: 580 },
                        { label: 'South Korea', value: 690 },
                        { label: 'Netherlands', value: 1100 },
                        { label: 'United States', value: 1200 },
                        { label: 'United Kingdom', value: 1380 },
                      ]}
                    />
                  </Grid>
                    
                  <Grid item xs={12} md={6} lg={4}>
                    <AppCurrentSubject
                      title="Current Subject"
                      chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
                      chartData={[
                        { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                        { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                        { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                      ]}
                      chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
                    />
                  </Grid> */}
              </Grid>
            </>
        }
      </Container>
    </>
  );
}
