import { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Skeleton, Stack } from '@mui/material';
// components
import {
  AppWebsiteVisits,
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

  const [stockDates, setStockDates] = useState({});
  const [stockSuggestion, setStockSuggestion] = useState("");
  const [stockEMAL, setStockEMAL] = useState([]);
  const [stockEMAS, setStockEMAS] = useState([]);
  const [stockClosingPrice, setStockClosingPrice] = useState([]);
  const [currentStock, setCurrentStock] = useState("");

  useEffect(() => {
    const currentSearch = getSearch.search;
    if(currentSearch){
      if(currentStock !== currentSearch){
        setCurrentStock(currentSearch);
        setLoading(true)
        setSearch(currentSearch)
      }
    }
  }, [getSearch]);

  useEffect(() => {
    if (search) {
      StockApi.getStockRecommendation(search).then(res => {
        setStockDates(res.data.dates)
        setStockSuggestion(res.data.action)
        setStockEMAS(res.data.ema_short)
        setStockEMAL(res.data.ema_long)
        setStockClosingPrice(res.data.closing_price)
        setLoading(false)
      }).catch(() => {
        setLoading(true)
        setSearch("")
      });
    }
  }, [search]);

  return (
    <>
      <Helmet>
        <title> Dashboard | InvestoBot </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola, bienvenido a InvestoBot, Escribe el Ticker de la accion para darte una recomendacion
        </Typography>

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
            <Grid item xs={12} md={6} lg={100}>
              <Typography sx={{ mb: 5 }}>
                Se realizo la busqueda y analisis de la accion con el Ticker {search} de la cual {stockSuggestion}
              </Typography>

              <AppWebsiteVisits
                title={`Accion ${search}`}
                subheader={stockSuggestion}
                chartLabels={stockDates}
                chartData={[
                  {
                    name: 'Precio de cierre',
                    type: 'area',
                    fill: 'gradient',
                    data: stockClosingPrice,
                  },
                  {
                    name: 'Media Movil exponencial Larga',
                    type: 'area',
                    fill: 'gradient',
                    data: stockEMAL,
                  },
                  {
                    name: 'Media Movil exponencial Corta',
                    type: 'area',
                    fill: 'gradient',
                    data: stockEMAS,
                  }
                ]}
              />

              <AppWebsiteVisits
                title={`Accion ${search}`}
                subheader={"Precio de cierre"}
                chartLabels={stockDates}
                chartData={[
                  {
                    name: 'Precio de cierre',
                    type: 'area',
                    fill: 'gradient',
                    data: stockClosingPrice,
                  }
                ]}
              />
              <AppWebsiteVisits
                title={`Accion ${search}`}
                chartLabels={stockDates}
                subheader={"Media Movil exponencial Larga"}
                chartData={[
                  {
                    name: 'Media Movil exponencial Larga',
                    type: 'area',
                    fill: 'gradient',
                    data: stockEMAL,
                  }
                ]}
              />
              <AppWebsiteVisits
                title={`Accion ${search}`}
                subheader={"Media Movil exponencial Corta"}
                chartLabels={stockDates}
                chartData={[
                  {
                    name: 'Media Movil exponencial Corta',
                    type: 'area',
                    fill: 'gradient',
                    data: stockEMAS,
                  }
                ]}
              />
            </Grid>
        }
      </Container>
    </>
  );
}
