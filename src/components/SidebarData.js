import React from 'react';
import Upload from './sidebar-icons/UploadPic.png';
import Resume from './sidebar-icons/Resumes.png';
import Favorites from './sidebar-icons/Resumes.png'; // 🆕 add a star icon for favorites
import Signout from './sidebar-icons/SignOut.png';

export const SidebarData = [
  {
    title: 'Upload',
    path: '/Upload',
    icon: (
      <img
        src={Upload}
        alt="Upload"
        style={{ height: '50px', width: '50px' }}
      />
    ),
    cName: 'nav-text',
  },
  {
    title: 'Resumes',
    path: '/Search',
    icon: (
      <img
        src={Resume}
        alt="Resumes"
        style={{ height: '45px', width: '45px' }}
      />
    ),
    cName: 'nav-text',
  },
  {
    title: 'Favorites', // 🆕 new sidebar option
    path: '/Favorites',
    icon: (
      <img
        src={Favorites}
        alt="Favorites"
        style={{ height: '45px', width: '45px' }}
      />
    ),
    cName: 'nav-text',
  },
];
