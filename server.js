const express = require("express");
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
];

const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. R. R. Tolkien' },
    { id: 3, name: 'Brent Weeks' }
];

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
];


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
        singleAuthor: {
            type: AuthorType,
            description: 'Single Author',
            args: { id: { type: GraphQLInt } },
            resolve: (parent, args) => authors.find(autor => autor.id === args.id)
        },
        allStudents: {
            type: new GraphQLList(studentType),
            description: 'All stuendts list in class 5',
            resolve: () => students
        },
        singleStuent: {
            type: studentType,
            description: "A signle student",
            args: { name: { type: GraphQLString } },
            resolve: (parent, args) => students.find(book => book.name === args.name)
        },
        book: {
            type: BookType,
            description: "A single book",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Multation',
    description: "Root Mutation",
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
                books.push(book);
                return book;
            }
        }
    })
})

const studentMutation = new GraphQLObjectType({
    name: "addClassStudent",
    description: "Student mutation",
    fields: () => ({
        addStudent: {
            type: studentType,
            description: "Add student on current array",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                class: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const student = { class: args.class, name: args.name }
                students.push(student);
                return student;
            }
        }
    })
})

const newSchema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
    mutation: studentMutation
});

app.use('/graphql', expressGraphQl({
    schema: newSchema,
    graphiql: true
}))

app.listen(5000, () => console.log('server running'))