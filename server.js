const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const ObjectId = require('mongodb').ObjectID

const MongoClient = require ('mongodb').MongoClient;

const uri = "mongodb://pedromatos:pedro123@ds061464.mlab.com:61464/standautomovel";

MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('standautomovel')

  app.listen(8080, function(){
    console.log ('A correr na porta 8080')
})
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('guardado na bd')
        res.redirect('/show')
    })
})

app.route('/edit/:id')
  .get((req, res) => {
    var id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
         
        if (err) return res.send(err)
        res.render('edit.ejs', { data: result} )
      })

  })
  .post((req, res) => {
    var id = req.params.id;
    var Marca = req.body.Marca;
    var Modelo = req.body.Modelo;
    var Combustivel = req.body.Combustivel;
    var Ano = req.body.Ano;
    var Cor = req.body.Cor;
    var Preco = req.body.Preco;
    db.collection('data').updateOne({_id: ObjectId(id)}, {
      $set: {
            Marca: Marca,
            Modelo: Modelo,
            Combustivel: Combustivel,
            Ano: Ano,
            Cor: Cor,
            Preco: Preco
      }
    }, (err, result) => {
         
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado')
       
      })
  })

app.route('/delete/:id')
  .get((req, res) => {
    var id = req.params.id
  
    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
      if (err) return res.send(500, err)
      console.log('Eliminado')
      res.redirect('/show')
    })
  })
