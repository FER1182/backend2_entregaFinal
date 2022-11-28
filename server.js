/*============================[Modulos]============================*/
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";

import "./src/db/config.js"
import User from "./src/models/User.js";
import routerDatos from './rutas/datos.js'
import routerLogin from './rutas/login.js'


const LocalStrategy = Strategy;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/datos', routerDatos)
app.use('/api/login', routerLogin)





/*============================[Middlewares]============================*/

/*----------- Session -----------*/
app.use(cookieParser());
app.use(
  session({
    secret: "1234567890!@#$%^&*()",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 20000, //20 seg
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username,password,done)=>{
    User.findOne({username}, (err,user)=>{
      if(err) console.log(err)
      if(!user) return done(null, false)
      bcrypt.compare(password,user.password,(err, isMatch)=>{
        console.log(user)
        if(err) console.log(err)
        if(isMatch) return done(null,user)
        return done(null,false)
      })
    })
}))

 passport.serializeUser((user,done)=>{
  done(null, user._id)
 })

 passport.deserializeUser(async(id,done)=>{
  const user = await User.findById(id)
  return done(null,user) 
})





/*============================[Rutas]============================*/

app.get("/", (req, res) => {
  if (req.session.nombre) {
    res.redirect("/datos");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate("local",{failureRedirect: "login-error" })
 ,(req, res) => {
 res.redirect ("/datos")
});


app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { username, password, direccion } = req.body;
  User.findOne({ username }, async (err, user) => {
    if (err) console.log(err);
    if (user) res.render("register-error");
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 8);
      const newUser = new User({
        username,
        password: hashedPassword,
        direccion,
      });
      await newUser.save();
      res.redirect("/login");
    }
  });
});

app.get("/datos", async(req, res) => {
  if(req.user){
    const datosUsuario = await User.findById(req.user._id).lean()
    res.render("datos",{
      datos:datosUsuario
    })
  }else{
    res.redirect("/login")

  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

/*============================[Servidor]============================*/
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
