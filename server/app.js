const express =require('express');
const morgan =require('morgan');
const cors= require('cors');
const app = express();
const bodyParser=require('body-parser');
//var db  = require('./db');


const userRoutes = require('./api/routes/user');
const gestRoutes = require('./api/routes/gestiune');
const categRoutes = require('./api/routes/categorie');
const contRoutes = require('./api/routes/cont');
const locRoutes = require('./api/routes/loc');
const matRoutes = require('./api/routes/materiale');
const docRoutes = require('./api/routes/documente');
const rapRoutes = require('./api/routes/rapoarte');

app.use(morgan('dev'));


//app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });
  app.use(cors()); 

//routes

app.use('/user',userRoutes);
app.use('/gest',gestRoutes);
app.use('/categ',categRoutes);
app.use('/conturi',contRoutes);
app.use('/locuri',locRoutes);
app.use('/materiale',matRoutes);
app.use('/documente',docRoutes);
app.use('/rapoarte',rapRoutes);

app.use((req,resp,next)=>{
    const error = new Error('Resursa nu poate fi gasita!!');
    error.status=404;
    next(error);
});

app.use((error,req,resp,next)=>{
    resp.status(error.status||500);
    resp.json({
        error :{
            message:error.message
        }
    })
})


module.exports=app;