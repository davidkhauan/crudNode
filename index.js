const express = require ('express')
const expHandleBars = require ('express-handlebars')
const POOL = require ('./db/connection')

const app = express()

app.engine ('handlebars', expHandleBars.engine())
app.set ('view engine', 'handlebars')

app.use (express.static ('public'))
app.use (express.urlencoded ({ extended: true }))
app.use (express.json())

app.get ('/', (requisition, response) => {
    response.render ('home')
})

app.post ('/books/insertbook', (requisition, response) => {
    const title = requisition.body.title
    const pageqty = requisition.body.pageqty

    if (!title || !pageqty) {
        return response.status (400).send ('Os campos não podem estar vazios')
    }

    const SQL = `INSERT INTO books (??, ??) VALUES (?, ?)`
    const data = ['title', 'pageqty', title, pageqty]

    POOL.query (SQL, data, (error) => {
        if (error) {
            return response.status (500).send ('Erro ao inserir dados!')
        }
        
        response.redirect ('/')
    })
})

app.get ('/books', (requisition, response) => {
    const SQL = 'SELECT * FROM books'

    POOL.query (SQL, (error, data) => {
        if (error) {
            console.error (`Erro ao buscar dados: ${error}`)

            return
        }

        const books = data 

        response.render ('books', { books })
    })
})

app.get ('/books/:id', (requisition, response) => {
    const id = requisition.params.id

    const SQL = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]

    POOL.query (SQL, data, (error, data) => {
        if (error) {
            console.error (`Erro ao buscar dados: ${error}`)

            return
        }

        const book = data [0]

        response.render ('book', { book })
    })
})

app.get ('/books/edit/:id', (requisition, response) => {
    const id = requisition.params.id

    const SQL = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]

    POOL.query (SQL, data, (error, data) => {
        if (error) {
            console.error (`Erro ao buscar dados: ${error}`)

            return
        }

        const book = data [0]

        response.render ('editbook', { book })
    })
})

app.post ('/books/updatebook', (requisition, response) => {
    const id = requisition.body.id
    const title = requisition.body.title
    const pageqty = requisition.body.pageqty

    const SQL = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title', title, 'pageqty', pageqty, 'id', id]

    POOL.query (SQL, data, (error) => {
        if (error) {
            console.error (`Erro ao atualizar dados: ${error}`)

            return
        }
    
        response.redirect ('/books')
    })
})

app.post ('/books/remove/:id', (requisition, response) => {
    const id = requisition.body.id

    const SQL = `DELETE FROM books WHERE ?? = ?`
    const data = ['id', id]

    POOL.query (SQL, data, (error) => {
        if (error) {
            console.error (`Erro ao excluir dados: ${error}`)

            return response.status (500).send ('Erro ao excluir dados!')
        }

        response.redirect ('/books')
    })
})

app.listen (3000)