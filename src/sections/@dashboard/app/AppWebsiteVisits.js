import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, ...other }) {
  const chartOptions = useChart({
    chart: {
      zoom: {
        enabled: true,
      },
      pan: {
        enabled: true,
      },
      toolbar: {
        show: true,
        tools: {
          zoomin: true,
          zoomout: true,
          reset: true,
        },
        offsetX: -10, // adjust the horizontal offset
        offsetY: -50, // adjust the vertical offset
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: chartData.map((i) => i.fill),
    },
    labels: chartLabels,
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      labels: {
        formatter: function test(val) {
          return val.toFixed(0);
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)}`;
          }
          return y;
        },
      },
    },
  });
   

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
