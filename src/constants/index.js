import { numberFormater } from '@/helpers/general';

export const chartConfig = {
  theme: {
    mode: 'light', // "dark"
  },
  yaxis: {
    decimalsInFloat: 0,
    labels: {
      show: true,
      formatter(e) {
        return numberFormater(e, 2, '.', ',', '$');
      },
      style: {
        colors: ['#808a9d'],
      },
    },
  },
  colors: ['rgb(22, 199, 132)'],
  chart: {
    height: 250,
    type: 'area',
    background: 'transparent',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    type: 'datetime',
    tooltip: {
      shared: true,
    },
  },
  tooltip: {
    x: {
      show: false,
      formatter(e) {
        return new Date(e).toLocaleString();
      },
    },
    y: {
      formatter() {},
    },
    marker: {
      show: true,
    },
  },
};
