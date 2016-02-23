import React from 'react';
import base from './Button.css';

export default ({ href = '#', styles = base, ..._ }) => (
  <a { ..._ } className={ styles.common } href={ href }/>
);
