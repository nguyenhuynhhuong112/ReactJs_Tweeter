import { EllipsisOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React from 'react';

interface MenuTweetDetailProps {
  onEdit: () => void;
  onDelete: () => void;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const MenuTweetDetail: React.FC<MenuTweetDetailProps> = ({ onEdit, onDelete }) => {
  const items: MenuItem[] = [
    getItem(<EllipsisOutlined />, null, null, [
      getItem('Option', null, null, [getItem('Xóa bài viết', '1'), getItem('Sửa bài viết', '2')], 'group'),
    ]),
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === '1') {
      console.log('xóa bài viết');
      onDelete();
    }
    if (e.key === '2') {
      console.log('sửa bài viết');
      onEdit();
    }
  };

  return <Menu onClick={onClick} style={{ width: 100 }} mode="vertical" items={items} />;
};
