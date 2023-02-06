const PORT = process.env.PORT ?? 5000;
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

/* TODOS */

//get all todos
app.get('/todos/:userEmail', async (req, res) => {
    try {
        const { userEmail } = req.params;
        const todos = await pool.query('SELECT * FROM todos WHERE user_email=$1;', [userEmail]);
        res.json(todos.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//create a new todo
app.post('/todos/create', async (req, res) => {
    try {
        const { user_email, title, progress, date } = req.body;
        const id = uuidv4();
        pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`, [id, user_email, title, progress, date]);
        const currentQuery = await pool.query('SELECT * FROM todos WHERE user_email=$1;', [user_email]);
        res.status(201).json({ data: currentQuery.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//edit a todo
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { user_email, title, progress, date } = req.body;
    try {
        const editTodo = await pool.query(`UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;`, [user_email, title, progress, date, id]);
        res.status(200).json({ data: editTodo.rows });
    } catch (err) {
        console.log(err.message, 'hellofg');
    }
});

//delete a todo
app.delete('/todos/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const deleteTodo = await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);
        res.status(200).json({deletedData:deleteTodo});
    }catch(err){
        console.log(err.message);
    }
});


/* AUTH */
app.post('/signup/', async (req, res) => {
    const {email, password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const signup = await pool.query(`INSERT INTO users(email, hashed_password) VALUES($1, $2)`, [email, hashedPassword]);
        const token = jwt.sign({email},process.env.JWT_SECRET, {expiresIn:'1d'});
        res.json({email, token});
    }catch(err){
        res.status(500).json({detail:err.detail});
        console.log(err);
    }

});

app.post('/login/', async(req,res)=>{
    const {email, password} = req.body;
    try{
        const user = await pool.query(`SELECT * FROM users where email=$1`, [email]);
        console.log('user',user);
        if(!user.rows.length)
            return res.status(404).json({detail:'User does not exist!'});
        const success = await bcrypt.compare(password, user.rows[0].hashed_password);
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn:'2h'});
        if(success){
            res.status(200).json({'email':user.rows[0].email, token});
        }else{
            res.status(500).json({detail:'Username or password not correct!'});
        }
    }catch(err){
        console.log(err.message);
    }
})


app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
});
