// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'stock info',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'stock suggestion',
    path: '/dashboard/recommend',
    icon: icon('ic_analytics'),
  },
  {
    title: 'stock predict',
    path: '/dashboard/predict',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
