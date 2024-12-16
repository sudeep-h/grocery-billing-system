const express = require('express');
const db=require('./models');
const app=express();

app.use(express.json());

const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

db.sequelize.sync({force:false})
    .then(()=>console.log("Database synced successfully"))
    .catch(()=>{console.log("Error syncing db")});

app.listen(5000,()=>{
    console.log("server running on 5000");
});
