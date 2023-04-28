import { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Skeleton, Stack} from '@mui/material';
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

export default function DashboardStockRecommendation() {
  const getSearch = storeData(state => state.search);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [stockDatesInfo, setStockDatesInfo] = useState({});
  const [stockClosingInfo, setStockClosingInfo] = useState({});
  const [stockHighInfo, setStockHighInfo] = useState({});
  const [stockLowInfo, setStockLowInfo] = useState({});
  const [stockVolumeInfo, setStockVolumeInfo] = useState({});
  const [lowStock, setLowStock] = useState(0);
  const [highStock, setHighStock] = useState(0);
  const [closingStock, setClosingStock] = useState(0);
  const [volumeStock, setVolumeStock] = useState(0);
  const [stockDate, setStockDate] = useState("");

  useEffect(() => {
    if(getSearch.search){
      setLoading(true)
      setSearch(getSearch.search)
    }
  }, [getSearch]);

  useEffect(() => {
    if(search!==""){
      StockApi.getStock(search).then(res=>{
        setLoading(false)

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

      }).catch(err => {
        setSearch("")
      });
    }
  }, [search]);

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola, bienvenido a InvestoBot
        </Typography>

        {
          loading ?
            <>
              {search!==""&&
                <>
                  <Stack direction="row" spacing={10} sx={{paddingBottom:"5%"}}>
                    <Skeleton variant="rectangular" width={300} height={300} />
                    <Skeleton variant="rectangular" width={300} height={300} />
                    <Skeleton variant="rectangular" width={300} height={300} />
                    <Skeleton variant="rectangular" width={300} height={300} />
                  </Stack>
                  
                  <Stack direction="column" spacing={4}>
                    <Skeleton variant="rectangular"  height={400} />
                    <Skeleton variant="rectangular"  height={400} />
                    <Skeleton variant="rectangular"  height={400} />
                  </Stack>
                </>
              }     
            </> :
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title={`Precio mas bajo ${stockDate}`} total={lowStock} icon={'fluent-mdl2:stock-down'} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title={`Precio mas alto ${stockDate}`} total={highStock} color="info" icon={'fluent-mdl2:stock-up'} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title={`Valor de cierre ${stockDate}`} total={closingStock} color="warning" icon={'mdi:cash-multiple'} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title={`Volumen de la accion ${stockDate}`} total={volumeStock} color="error" icon={'ant-design:stock-outlined'} />
              </Grid>

              <Grid item xs={12} md={6} lg={100}>
                <AppWebsiteVisits
                  title="Precio de cierre"
                  subheader={`Accion ${search}`}
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
                  title="Volumen de la accion"
                  subheader={`Accion ${search}`}
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
                  title="Accion mas baja y alta"
                  subheader={`Accion ${search}`}
                  chartLabels={stockDatesInfo}
                  chartData={[
                    {
                      name: 'Accion mas baja',
                      type: 'area',
                      fill: 'gradient',
                      data: stockLowInfo,
                    },
                    {
                      name: 'Accion mas Alta',
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
        }
      </Container>
    </>
  );
}