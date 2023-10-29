import React, { useState } from 'react';
import Header from '../../../layout/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { SetupProfile } from '../SetupProfile/SetupProfile';
import avatar from '../../../assets/avatar.jpg';
import { Avatar, Image } from 'antd';
import { Follow } from '../Follow/Follow';

export const UserProfile: React.FC = () => {
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const user = useSelector((state: any) => state.user);
  const date = user.data?.dateJoined === undefined ? 'date joined' : user.data.dateJoined;
  const name = user.data?.userName === undefined ? 'user name' : user.data?.userName;
  let fullNameUser = user.data?.fullName === undefined ? 'full name' : user.data?.fullName;
  const coverimage = user.data && user.data?.imageCover ? user.data.imageCover : '';
  const avatarimage = user.data && user.data?.imageAvatar ? user.data.imageAvatar : '';
  const followings = user.data && user.data.following ? user.data.following.length : 0;
  const followers = user.data && user.data.followers ? user.data.followers.length : 0;
  const handleModalOpen = (modalStateSetter: Function) => {
    modalStateSetter(true);
  };
  const handleShowFollowing = (modelStateSetter: Function) => {
    modelStateSetter(true);
  };

  return (
    <div data-testid="profile" className="profile-info w-full css-dev-only-do-not-override-39ufzt">
      <div>
        <div className=" rounded-lg">
          <Header name={`@${name}`} />
          <div className="cover-image object-contain px-6">
            <Image width={'100%'} height={400} src={`${coverimage}`} className="rounded-lg object-cover" />
          </div>

          <div className="avatar-button-container mt-4 flex items-start justify-between px-6">
            <div className="avatar">
              <Avatar src={avatarimage} alt="User Profile" className="w-24 h-24 rounded-full" />
              {/* <Image width={96} height={96} src={`${avatarimage}`} className="rounded-full object-contain" /> */}
            </div>
            <button
              className="bg-blue-500 text-white py-1 px-2 rounded"
              onClick={() => handleModalOpen(setShowProfileSetup)}>
              Edit Profile
            </button>
          </div>
          <div className="user-details  px-6">
            <h2 className="text-xl font-semibold">{fullNameUser}</h2>
            <p className="text-gray-600">{`@${name}`}</p>
            <p className="text-gray-600">
              <FontAwesomeIcon icon={faCalendarDays} /> {`Joined: ${date}`}
            </p>
            <p className="text-gray-600">
              <div onClick={() => handleShowFollowing(setShowFollowing)}>
                <span className="mr-4">{`${followings} Following`}</span>
              </div>
              <span>{`${followers} Followers`}</span>
            </p>
          </div>
        </div>
        {showProfileSetup && (
          <SetupProfile isProfileSetupOpen={showProfileSetup} onCloseProfileSetup={() => setShowProfileSetup(false)} />
        )}
        {showFollowing && <Follow isFollowOpen={showFollowing} onCloseFollow={() => setShowFollowing(false)} />}
      </div>
    </div>
  );
};
