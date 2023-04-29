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

export default function DashboardStockPrediction() {
  const getSearch = storeData(state => state.search);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [stockDates, setStockDates] = useState([]);
  const [stockClosingPrice, setStockClosingPrice] = useState([]);
  const [stockPredictedPrices, setStockPredictedPrices] = useState([]);
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
      StockApi.getStockPrediction(search).then(res => {
        setStockDates(res.data.dates)
        setStockClosingPrice(res.data.closing_price)
        setStockPredictedPrices(res.data.closing_price.concat(res.data.predicted_closing_price))
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
              <AppWebsiteVisits
                title={`Accion ${search}`}
                subheader={"Prediccion de la accion en los proximos 5 dias"}
                chartLabels={stockDates}
                chartData={[
                  {
                    name: 'Prediccion',
                    type: 'area',
                    fill: 'gradient',
                    data: stockPredictedPrices,
                  },
                  {
                    name: 'Precio de cierre',
                    type: 'area',
                    fill: 'gradient',
                    data: stockClosingPrice,
                  }
                ]}
              />
            </Grid>
        }
      </Container>
    </>
  );
}
