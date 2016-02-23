import React from 'react';
import base from './Title.css';

export default ({ styles = base, ..._ }) => (
  <h1 { ..._ } className={ styles.common }/>
);
