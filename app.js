//require module start
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const pool = require("./db")
var router = express.Router()
app.set('view engine', 'ejs')
var morgan = require('morgan')
const expressLayouts = require('express-ejs-layouts')
app.use('/public', express.static(__dirname + '/public'))
const { body, check, validationResult } = require('express-validator');

const db = require('./query')
//require module end

app.use(morgan('dev'));
app.use(expressLayouts);
app.use(express.json())


const getUserData = async() => {
    const dbPath = await pool.query(`SELECT name, "number", email
	FROM public.contacts; `)
    return dbPath
}



//Routes start

app.use((req, res, next) => {
console.log('Time:', Date.now())
next()
})


app.use(express.urlencoded({extended:true}));

 

app.get('/', async(req, res) => {
    const data = await db.findAll()
    res.render("index", {
        nama:'ronatio',
        layout:'layout/main',
        title : "web express",
       dbPath: data.rows
    })

})


app.post('/add', [
    body('name').custom(async (value) => {
      const data = await db.findOne(value);
      const duplikat = data.rows[0]
      if (duplikat) {
        throw new Error('Data already used!');
      }
      return true;
    }),
    check('number', 'Number doesnt valid!').isMobilePhone('id-ID'),
    check('email', 'Email doesnt valid!').isEmail(),

   
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add', {
          isActive: 'home',
          layout: 'layout/add',
          title: 'Form tambah Contact',
          errors: errors.array(),
        });
      } else {

    const data = req.body
    const userData = JSON.stringify(data)
    datass = JSON.parse(userData)
   const coba = await db.addData(datass)
    // saveUserData(existUsers);
  res.redirect('/')
}
})



app.post('/contact/update', [
  body('nama').custom(async(value, { req }) => {
      const data = await db.findOne(value);
      const duplikat = data.rows[0]
      if (value !== req.body.oldname && duplikat) {
          throw new Error('Nama sudah terdaftar!');
      }
      return true;
  }),
  check('number', 'Number doesnt valid!').isMobilePhone('id-ID'),
  check('email', 'Email doesnt valid!').isEmail(),

  ], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit', {
            title: "ExpressJS",
            layout: "layout/edit",
            errors: errors.array(),
            contact: req.body,
        });
    } else{
        const update = db.UpdateData(req.body.oldname, req.body.name, req.body.number, req.body.email);
        res.redirect('/');
    }
});


app.get('/delete/:name', async(req, res) => {
    const name = req.params.name
    const dbPath = await db.deleteData(name)
    res.redirect('/')
    
})



app.get('/about', (req, res) => {
    
    res.render("about",{
        layout:'layout/main2',
    })
   
})



app.get('/contact', (req, res) => {
    const name = req.params.name
    let dbPath = getUserData()
    
    res.render("contact",{
        layout:'layout/main3',
        dbPath,
        name
       
    })
 
})



app.get('/contact/edit/:name',async(req, res) => {
    const name = req.params.name
    const contact = await db.findOne(name)
    res.render("edit",{
        layout:'layout/edit',
        contact: contact.rows[0], 
      
    })
})




app.get('/add', (req, res) => {
    res.render("add",{
        layout:'layout/add',
    })
})



app.use('/', (req, res) => {
    res.status(404)
    res.send('Page Not Found : 404')
})


//router end






app.get("/addasync", async(req,res)=>{
    try {
        const name = "ronatio"
        const number = "091320181438"
        const email = "ronatio@email.com"
        const newCount = await pool.query(`INSERT INTO contacts VALUES('${name}','${number}','${email}') RETURNING *`)
        res.json(newCount)
    } catch (err) {
        console.log(err.message);
    }
})

app.listen(port, () => {
    console.log(`example app listening on port ${port}`);
})



module.exports = router