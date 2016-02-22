import React from 'react';
import Button from './Button';

export default _ => (
  <html lang='en'>
    <head>
      <title>Universal demo</title>
      <link rel='stylesheet' href='common.css'/>
      <script type='text/javascript' src='browser.js'></script>
    </head>
    <body>
      <Button>Welcome to the future</Button>
    </body>
  </html>
);
