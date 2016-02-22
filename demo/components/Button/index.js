import React from 'react';
import base from './Button.css';

export default ({ styles = base, ..._ }) => (
  <button { ..._ } className={ styles.common }/>
);
