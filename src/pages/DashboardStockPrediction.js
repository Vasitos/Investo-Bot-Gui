import { useEffect, useState, forwardRef } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Skeleton, Stack } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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
  const vertical = "top";
  const horizontal = "center";
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stockDates, setStockDates] = useState([]);
  const [stockClosingPrice, setStockClosingPrice] = useState([]);
  const [stockPredictedPrices, setStockPredictedPrices] = useState([]);
  const [currentStock, setCurrentStock] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [responseStatus, setResponseStatus] = useState({});

  const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

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
        setResponseStatus({message:"Informacion obtenida de forma exitosa",severity:"success"})
        setOpenAlert(true)
      }).catch(() => {
        setLoading(true)
        setSearch("")
        setResponseStatus({message:"Ocurrio algo al buscar la accion, intentelo nuevamente",severity:"error"})
        setOpenAlert(true);
      });
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
