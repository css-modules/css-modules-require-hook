import React from 'react';
import Button from './Button';
import Title from './Title';

import styles from './Page.css';

export default _ => (
  <html lang='en'>
    <head>
      <title>Universal demo</title>
      <link rel='stylesheet' href='common.css'/>
    </head>
    <body className={ styles.page }>
      <section className={ styles.wrapper }>
        <Title>CSS Modules</Title>
        <Button href='http://glenmaddern.com/articles/css-modules'>Welcome to the future</Button>
      </section>
    </body>
  </html>
);
