import { faHome, faBell, faUser, faEllipsisH, faBookmark } from '@fortawesome/free-solid-svg-icons';

interface NavigationItem {
  id: number;
  label: string;
  icon: any;
  to?: string;
}

const navigationItems: NavigationItem[] = [
  { id: 1, label: 'Home', icon: faHome, to: '/' },
  { id: 3, label: 'Notifications', icon: faBell, to: '/notifications' },
  { id: 4, label: 'Bookmark', icon: faBookmark, to: '/bookmark' },
  { id: 5, label: 'Profile', icon: faUser, to: '/profile' },
  { id: 6, label: 'More', icon: faEllipsisH },
];

export default navigationItems;
