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

export default function DashboardStockRecommendation() {
  const getSearch = storeData(state => state.search);
  const vertical = "top";
  const horizontal = "center";
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stockDates, setStockDates] = useState({});
  const [stockSuggestion, setStockSuggestion] = useState("");
  const [stockEMAL, setStockEMAL] = useState([]);
  const [stockEMAS, setStockEMAS] = useState([]);
  const [stockClosingPrice, setStockClosingPrice] = useState([]);
  const [currentStock, setCurrentStock] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [responseStatus, setResponseStatus] = useState({});

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
        setResponseStatus({message:res.data.action,severity:"info",time:6000})
        setOpenAlert(true)
      }).catch(() => {
        setLoading(true)
        setSearch("")
        setResponseStatus({message:"Ocurrió algo al buscar la acción, inténtelo nuevamente",severity:"error",time:4000})
        setOpenAlert(true);
      });
    }
  }, [search]);

  const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };
  return (
    <>
      <Helmet>
        <title> Dashboard | InvestoBot </title>
      </Helmet>

      <Snackbar open={openAlert} autoHideDuration={responseStatus.time} onClose={handleClose} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleClose} severity={responseStatus.severity} sx={{ width: '100%' }}>
          {responseStatus.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola, bienvenido a InvestoBot, Escribe el Ticker de la acción para darte una recomendación
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
                Se realizo la búsqueda y análisis de la acción con el Ticker {search} de la cual {stockSuggestion}
              </Typography>

              <AppWebsiteVisits
                title={`Acción ${search}`}
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
                    name: 'Media Móvil exponencial larga',
                    type: 'area',
                    fill: 'gradient',
                    data: stockEMAL,
                  },
                  {
                    name: 'Media Móvil exponencial corta',
                    type: 'area',
                    fill: 'gradient',
                    data: stockEMAS,
                  }
                ]}
              />

              <AppWebsiteVisits
                title={`Acción ${search}`}
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
                title={`Acción ${search}`}
                chartLabels={stockDates}
                subheader={"Media Móvil exponencial larga"}
                chartData={[
                  {
                    name: 'Media Móvil exponencial larga',
                    type: 'area',
                    fill: 'gradient',
                    data: stockEMAL,
                  }
                ]}
              />
              <AppWebsiteVisits
                title={`Accion ${search}`}
                subheader={"Media Móvil exponencial corta"}
                chartLabels={stockDates}
                chartData={[
                  {
                    name: 'Media Móvil exponencial corta',
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
