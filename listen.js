const app = require('./app');

app.listen(process.env.PORT || 9090, (err) => {
  if (err) console.log(err);
  else {
    console.log('listening on port 9090...');
  }
});
