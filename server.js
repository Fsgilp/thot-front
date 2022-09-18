const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/Thot'));
app.get('*', function(req,res) {res.sendFile(path.join(__dirname+'/dist/Thot/index.html'));});
/*app.get('*', (req, res) => {
  res.sendFile(`./front-end/dist/index.html`); // load the single view file (angular will handle the page changes on the front-end)
});*/

app.listen(process.env.PORT || 8082);
