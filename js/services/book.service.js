'use strict'

const STORAGE_KEY = 'booksDB_v2'
var gBooks = _createBooks()
var gSortBy = 'Title'
var gFilterBy = { minPrice: 0, rate: 0 }
var gLowToHigh
const PAGE_SIZE = 5
var gPageIdx = 0
var gCountBooksShown

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = [
            _createBook('puki'),
            _createBook('Cookie'),
            _createBook('Shuki'),
            _createBook('Rocki'),
            _createBook('Nightbeast'),
            _createBook('Scarface'),
            _createBook('Bigi'),
            _createBook('Zimbo')
        ]
        saveToStorage(STORAGE_KEY, books)
    }
    return books
}

function _createBook(title, price) {
    return {
        id: makeId(),
        title,
        price: price || getRandomIntInclusive(1, 100),
        rate: getRandomIntInclusive(0, 10)
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(title, price) {
    const book = _createBook(title, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    if (book) {
        book.price = newPrice
        _saveBooksToStorage()
    }
    return book
}

function setFilter(filterBy) {
    if (filterBy.minPrice !== undefined) gFilterBy.minPrice = filterBy.minPrice
}

function getBookById(bookId) {
    return gBooks.find(book => bookId === book.id)
}

function getSortMethod(sortBy) {
    const methodMap = {
        Title: (a, b) => gLowToHigh ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
        Price: (a, b) => gLowToHigh ? a.price - b.price : b.price - a.price
    }
    return methodMap[sortBy] || methodMap['Title']
}

function setSort(sortBy) {
    gSortBy = sortBy
    gLowToHigh = !gLowToHigh
}

function updateBookRate(bookId, rating) {
    const book = gBooks.find(book => book.id === bookId)
    if (!book) return 0
    const newRate = book.rate + rating
    if (newRate >= 0 && newRate <= 10) {
        book.rate = newRate
        _saveBooksToStorage()
    }
    return book.rate
}

//////////////////////////////////////////////////////////

function getBooksToShow() {
    if (!gBooks) return []
    var books = gBooks.filter(book =>
        book.price >= gFilterBy.minPrice &&
        // book.name.toLowerCase().includes(gFilterBy.name.toLowerCase()) &&
        book.rate >= (gFilterBy.rate))

    gCountBooksShown = books.length
    books.sort(getSortMethod(gSortBy))

    var startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)

    return books
}

function changePage(diff) {
    gPageIdx += diff
    if (gPageIdx < 0) gPageIdx = 0
    else if ((gPageIdx * PAGE_SIZE) >= gCountBooksShown) gPageIdx--
}

function isStartPage() {
    return (gPageIdx === 0)
}

function isEndPage() {
    return ((gPageIdx + 1) * PAGE_SIZE) >= gCountBooksShown
}

function getPageIdx() {
    return gPageIdx
}

function getNextBookId(bookId) {
    const books = getBooksToShow()
    const idx = books.findIndex(book => book.id === bookId)
    const nextIdx = (idx === books.length - 1) ? 0 : idx + 1
    return books[nextIdx].id
}

function getPrevBookId(bookId) {
    const books = getBooksToShow()
    const idx = books.findIndex(book => book.id === bookId)
    const prevIdx = (idx === 0) ? books.length - 1 : idx - 1
    return books[prevIdx].id
}