// Initilizing some necesary elements 
//// Feel free to change anything
import express from "express"
import { cors } from "cors"



//initialize port
const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());


// Test if server is listening on correct port
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});