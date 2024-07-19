const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { sequelize } = require('./models');
const authRoute = require('./routes/authRoutes');
const noteRoute = require('./routes/noteRoutes');
const userRoute = require('./routes/userRoutes');

app.use(bodyParser.json());

app.use('/auth', authRoute);
app.use('/notes', noteRoute);
app.use('/users', userRoute);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});