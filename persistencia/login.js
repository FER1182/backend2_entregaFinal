const usuario = []

async function recuperarUsuario() {
   return usuarios
}

async function guardarUsuario(usuario) {
   datos.push(usuario)
   return usuario
}

export {recuperarUsuarios,guardarUsuario}
