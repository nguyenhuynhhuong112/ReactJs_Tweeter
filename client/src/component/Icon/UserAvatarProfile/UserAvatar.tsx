import React from 'react';
import './UserAvatar.scss';
import { Avatar, Tooltip } from 'antd';
import { AvatarSize } from 'antd/es/avatar/AvatarContext';
export interface User {
  id: string;
  name: string;
  avatar: string;
  renderUserInfo?: boolean;
  onClick?: () => void;
  size?: AvatarSize;
}

const UserAvatar: React.FC<User> = ({ avatar, name, id, onClick, renderUserInfo, size = 'default' }) => {
  return (
    <div onClick={onClick} className="flex gap-2 items-center cursor-pointer group">
      <div>
        <Avatar src={avatar} size={size} />
      </div>
      {renderUserInfo && (
        <div className="flex flex-col gap-1">
          <Tooltip title={name}>
            <span className="text-sm text-slate-500 truncate max-w-[100px] group-hover:text-primary">{name}</span>
          </Tooltip>
          <Tooltip title={id}>
            <span className="text-xs text-slate-400 truncate max-w-[100px] group-hover:text-primary">{id}</span>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
