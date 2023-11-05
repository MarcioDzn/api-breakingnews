import express from "express"
import connectDatabase from "./src/database/db.js"
import dotenv from "dotenv"

import userRoute from "./src/routes/user.route.js"
import authRoute from "./src/routes/auth.route.js"
import newsRoute from "./src/routes/news.route.js"
import swaggerRoute from "./src/routes/swagger.route.js"

dotenv.config() // configura as variaveis de ambiente pra usar no projeto todo 

// const port = 3000
// O servidor que eu colocar pra rodar vai decidir a porta 
// por process.env.PORT. Todo servidor tem uma porta
const port = process.env.PORT || 3000 
const app = express()

connectDatabase()
app.use(express.json()) // permite q a aplicação envie e receba json
app.use("/user", userRoute)
app.use("/auth", authRoute)
app.use("/news", newsRoute)
app.use("/doc", swaggerRoute)

// O app tá sendo ouvido na porta 3000 http://localhost:3000
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));

//ROTA
    // Método HTTP - CRUD (CREATE, READ, UPDATE, DELETE)
        // GET - Pega uma info
        // POST - Cria uma info
        // PUT - Altera TODA a info
        // PATCH - Altera PARTE da info
        // DELETE - Apaga uma info

    // Name - Um identificador da rota ('/route', por exemplo)

    // Function (Callback) - Responsável por executar algum comando

// app.get("/soma", (req, res) => {
// })

// npm run dev pra rodar o nodemon :)