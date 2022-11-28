import { crearUsuario, obtenerUsusarios } from '../servicio/login.js'
 


async function getLoginController(req, res) {
   const datos = await obtenerUsusarios()
   res.json(datos)
}

async function postRegisterController(req, res) {
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
}


async function postLoginController(req, res) {
   const usuario = req.body
  
   res.status(201).json(usuario)
}

export { getLoginController, postLoginController }
