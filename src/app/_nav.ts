import { INavData } from '@coreui/angular';
import { title } from 'process';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'fa fa-database'
  },
  {
    title: true,
    name: 'User',
  },
  {
    name: 'Profil',
    url: '/profil',
    icon: 'fa fa-user'
  },
  {
    title: true,
    name: '============='
  },
  {
    name: 'Market',
    url: '/chat',
    icon: 'fa fa-bank'
  },
  {
    name: 'Purchases',
    url: '/chat',
    icon: 'fa fa-bar-chart'
  },
  {
    name: 'Sales',
    url: '/map',
    icon: 'fa fa-barcode'
  },
  {
    name: 'Chat',
    url: '/chat',
    icon: 'fa fa-comments'
  },
  {
    name: 'History',
    url: '/chat',
    icon: 'fa fa-calculator'
  },
  {
    divider: true
  },
  {
    name: 'MoMo coin Support',
    url: 'http://karryngo.com/support/',
    icon: 'fa fa-question-circle',
    class: 'mt-auto',
    variant: 'dark',
    attributes: { target: '_blank', rel: 'noopener' }
  },
];
