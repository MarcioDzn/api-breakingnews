// Fazendo a conexão com o banco de dados

import mongoose from "mongoose";

const connectDatabase = () => {
    console.log("Wait connecting to the database")
    // parametros do connect (uri, propriedades/opções)

    // tem que pensar em promise 
    //then() - resposta de sucesso
    //catch() - tratar caso não dê sucesso
    mongoose.connect(process.env.MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
        .then(() => console.log("MongoDB Atlas Connected"))
        .catch((error) => console.log(error))
}

export default connectDatabase;
