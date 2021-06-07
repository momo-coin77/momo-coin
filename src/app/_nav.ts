import { INavData } from '@coreui/angular';
import { title } from 'process';

export const navItems: INavData[] = [
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
    name: '======================'
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'fa fa-database'
  },
  {
    name: 'Market',
    url: '/market',
    icon: 'fa fa-bank'
  },
  {
    name: 'Purchases',
    url: '/purchases',
    icon: 'fa fa-bar-chart'
  },
  {
    name: 'Sales',
    url: '/sales',
    icon: 'fa fa-barcode'
  },
  {
    name: 'History',
    url: '/history',
    icon: 'fa fa-history'
  },
  {
    name: 'Familly',
    url: '/familly',
    icon: 'fa fa-users',
    badge: {
      variant: 'info',
      text: '< New >'
    },
  },
  {
    name: 'Forum',
    url: '/chat',
    icon: 'fa fa-comments',
    badge: {
      variant: 'warning',
      text: '<Not available>'
    },
    attributes: { disabled: true },
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
