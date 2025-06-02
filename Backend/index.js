import express from 'express';

const app = express();

const PORT= 5001;

app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
});