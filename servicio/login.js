import { recuperarUsuario, guardarUsuario } from '../persistencia/login.js';

async function obtenerUsusarios() {
   return await recuperarUsuario()
}

async function crearUsuario(usuario) {
   dato.added = Date.now()
   await guardarUsuario(usuario)
   return usuario
}

export { obtenerUsusarios, crearUsuario }
