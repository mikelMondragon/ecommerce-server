// IMPORTS
const bcrypt = require("bcryptjs")
const userModel = require("../models/user.model");
const admin = require("firebase-admin");
const { generateJWT } = require("../utils/JWTgenerate")
const User = require("../models/user.model")



// FUNCION login
/**
 * Controlador para iniciar sesión de un usuario.
 *
 * - Verifica si el usuario existe por su email.
 * - Compara la contraseña enviada con la almacenada.
 * - Si es correcta, genera un token JWT y lo envía al cliente.
 *
 * @async
 * @function login
 * @param req - Objeto de solicitud HTTP con `email` y `password` en el body.
 * @param res - Objeto de respuesta HTTP.
 * @returns {Promise} Devuelve una respuesta JSON con un token o un mensaje de error.
 */
const login = async (req, res) => {
    const { email, password } = req.body;
    const { idToken } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        const user = await User.findById(uid);


        //4. Si todo coincide generar token JWT
        const token = await generateJWT({
            uid: user.user_id,
            email: user.email,
            role: user.role
        });

        //5. Respuesta exitosa
        return res.status(200).json({
            message: "Login correcto",
            token, // sigue enviando el token
            user: {
                id: user.user_id,
                role: user.role,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log("Error en login:", error);
        return res.status(500).json({
            error: "Errores interno del servidor"
        });
    }
};


// FUNCION de registro
/**
 * Controlador para registrar un nuevo usuario.
 *
 * - Verifica si el email ya está en uso.
 * - Si no existe, hashea la contraseña y crea el usuario en la base de datos.
 * - Devuelve un mensaje de éxito y los datos básicos del usuario creado.
 *
 * @async
 * @function registry
 * @param req - Objeto de solicitud HTTP con los datos del usuario en `req.body`.
 * @param res - Objeto de respuesta HTTP.
 * @returns {Promise} Responde al cliente con un JSON (usuario creado o error). Sólo ejecuta la lógica y termina. 
 */
const register = async (req, res) => {
    const { idToken, userName } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        //Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: decodedToken.email });
        if (existingUser) {
            return res.status(409).json({
                error: "El usuario ya existe"
            });
        }
        const newUser = new User({
            _id: decodedToken.uid,
            email: decodedToken.email,
            userName: userName,
            role: "user"
        });

        await newUser.save();

        const token = await generateJWT({
            uid: newUser._id,
            email: newUser.email,
            role: newUser.role
        });

        console.log({ newUser })
        res.status(201).json({
            message: "User succesfully registered",
            token
        });

    } catch (error) {
        console.log("Error en registro:", error);
        res.status(500).json({
            error
        });
    }
};

const user = async (req, res) => {
    const { uid } = req.params;
    console.log("useer", req.firebaseUser)
    try {

        const user = await User.findById(req.firebaseUser.uid);
        return res.status(200).json({
            message: "User find",
            user: {
                id: uid,
                role: user.role,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error
        });
    }

}
// EXPORTS
module.exports = {
    login,
    register,
    user
}