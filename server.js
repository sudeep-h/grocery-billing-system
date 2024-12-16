const express = require('express');
const db=require('./models');
const app=express();
const cors = require('cors');

app.use(express.json());
// app.use(cors({ origin: 'http://localhost:5500' }));
app.use(cors());

const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

db.sequelize.sync({force:false})
    .then(()=>console.log("Database synced successfully"))
    .catch(()=>{console.log("Error syncing db")});

app.listen(5000,()=>{
    console.log("server running on 5000");
});
