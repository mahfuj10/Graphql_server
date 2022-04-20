const express = require("express")
const expressGraphQl = require('express-graphql').graphqlHTTP;
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql')
const app = express();


const books = [
    { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
    { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
    { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
    { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
    { id: 5, name: 'The Two Towers', authorId: 2 },
    { id: 6, name: 'The Return of the King', authorId: 2 },
    { id: 7, name: 'The Way of Shadows', authorId: 3 },
    { id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. R. R. Tolkien' },
    { id: 3, name: 'Brent Weeks' }
]

const topBooks = [
    { id: 1, name: 'avs' },
    { id: 2, name: 'sadasd Tolkien' },
    { id: 3, name: '243234sdf' }
];

const students = [
    { class: '5', name: 'Mahfuj' },
    { class: '5', name: 'Munni' },
    { class: '5', name: 'Tanvir' },
    { class: '5', name: 'Sabbir' },
    { class: '5', name: 'Salman' }
]


const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Helloworld',
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => "Helloworld!"
            }
        })
    })
});


const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'The best writern book',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        },
        popular: {
            type: PopularBook,
            resolve: (book) => {
                return topBooks.find(top => top.id === book.id);
            }
        },

    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'The represents a author fo a bookd',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
    })
});

const PopularBook = new GraphQLObjectType({
    name: 'popularBook',
    description: "The most popular book",
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) }
    })
})


const studentType = new GraphQLObjectType({
    name: 'students',
    description: "All student name below",
    fields: () => (
        {
            class: { type: new GraphQLNonNull(GraphQLString) },
            name: { type: new GraphQLNonNull(GraphQLString) }
        }
    )
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of all books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of all authors..',
            resolve: () => authors
        },
        allStudents: {
            type: new GraphQLList(studentType),
            description: 'All stuendts list in class 5',
            resolve: () => students
        }
    })
})

const newSchema = new GraphQLSchema({
    query: RootQueryType
});

app.use('/graphql', expressGraphQl({
    schema: newSchema,
    graphiql: true
}))

app.listen(5000, () => console.log('server running'))