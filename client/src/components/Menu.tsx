import React, { FC, useState } from 'react';
import { useLangSelector } from '../store';
import './App.css';
import LangSelectDialog from './LangSelectDialog';

const Menu: FC = () => {
  const selectedLang = useLangSelector();
  const [openLangSelect, setOpenLangSelect] = useState(!selectedLang);

  return (
    <>
      <nav className='navbar'>
        <ul className='navbar-list'>
          <li key='main' className='navbar-item'>
            <a href='/' className='navbar-link'>
              <i className='fas fa-cat navbar-icon'></i>
              <span className='navbar-text'>Main</span>
            </a>
          </li>
          <li key='properties' className='navbar-item'>
            <a href='/languages' className='navbar-link'>
              <i className='fas fa-puzzle-piece navbar-icon'></i>
              <span className='navbar-text'>Properties</span>
            </a>
          </li>
          <li key='languages' className='navbar-item'>
            <a onClick={() => setOpenLangSelect(true)} className='navbar-link'>
              <i className='fas fa-globe-europe'></i>
              <span className='navbar-text'>Language</span>
            </a>
          </li>
          <li key='settings' className='navbar-item'>
            <a className='navbar-link'>
              <i className='fa fa-cogs' aria-hidden='true'></i>
              <span className='navbar-text'>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      {openLangSelect && (
        <LangSelectDialog onClose={() => setOpenLangSelect(false)} />
      )}
    </>
  );
};

export default Menu;
