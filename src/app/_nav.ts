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
    url: '/market',
    icon: 'fa fa-bank'
  },
  {
    name: 'Sales',
    url: '/sales',
    icon: 'fa fa-barcode'
  },
  {
    name: 'Purchases',
    url: '/purchases',
    icon: 'fa fa-bar-chart'
  },
  {
    name: 'Chat',
    url: '/chat',
    icon: 'fa fa-comments'
  },
  {
    name: 'History',
    url: '/history',
    icon: 'fa fa-calculator'
  },
  {
    divider: true
  },
  {
    name: 'MoMo coin Support',
    url: '#',
    icon: 'fa fa-question-circle',
    class: 'mt-auto',
    variant: 'dark',
  },
];
