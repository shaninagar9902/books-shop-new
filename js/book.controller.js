'use strict'

var gCurrBookId = null
var gHammerModal;

window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
        onCloseModal()
    }
})

function onInit() {
    console.log('app is ready')
    renderBooks()
    renderBtnState()
    doTrans()
    initHammer()
}

function renderBooks() {
    const books = getBooksToShow()
    const elTableBody = document.querySelector('.table-body')
    if (!books || !books.length) {
        elTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center" data-trans="NBF">No books found...</td></tr>`
        return
    }
    const strHTML = books.map(book => {
        return `
        <tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
            <td>${book.price}</td>
            <td>
            <button class="btn-read" data-trans='read-btn' onclick="onReadBook('${book.id}')">Read</button>
            <button class="btn-update" data-trans='update-btn' onclick="onUpdateBook('${book.id}')">Update</button>
            <button title="Delete book" data-trans='delete-btn' class="btn-remove" onclick="onRemoveBook('${book.id}')">Delete</button>
            </td>
        </tr>
        `
    }).join('')

    elTableBody.innerHTML = strHTML
    document.querySelector('.page-idx').innerText = getPageIdx() + 1
    doTrans()
}

function onRemoveBook(bookId) {
    var confirmed = confirm(getTrans('sure'))
    if (confirmed) {
        removeBook(bookId)
        renderBooks()
        flashMsg(`Book deleted`)
    }
    return
}

function onAddBook() {
    // var title = prompt(getTrans('what-title'))
    // var price = +prompt(getTrans('what-price'))
    gCurrBookId = null
    const elModal = document.querySelector('.modal-add')

    elModal.querySelector('[name="title"]').value = ''
    elModal.querySelector('[name="price"]').value = ''
    elModal.classList.add('open')

    document.querySelector('.backdrop').classList.add('open')
}

function onUpdateBook(bookId) {
    // var newPrice = +prompt(getTrans('new-price'), book.price)
    gCurrBookId = bookId
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal-update')

    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('[name="price"]').value = book.price
    elModal.classList.add('open')

    document.querySelector('.backdrop').classList.add('open')
}


function onCloseModal() {
    const modals = document.querySelectorAll('.modal-read, .modal-update, .modal-add, .backdrop')
    modals.forEach(modal => modal.classList.remove('open'))
    gCurrBookId = null
}

function flashMsg(msg, type = 'success') {
    const elMsg = document.querySelector('.user-msg')
    elMsg.innerText = msg
    elMsg.classList.add('open', type)
    setTimeout(() => elMsg.classList.remove('open', type), 2000)
}

function onReadBook(bookId) {
    gCurrBookId = bookId
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal-read')
    const elBackdrop = document.querySelector('.backdrop')

    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('.book-price-value').innerText = book.price
    elModal.querySelector('.rate-val').innerText = book.rate
    elModal.querySelector('p').innerText = makeLorem(20)

    elModal.dataset.nextid = getNextBookId(bookId)
    elModal.dataset.previd = getPrevBookId(bookId)

    elModal.classList.add('open')
    elBackdrop.classList.add('open')
}

function onSetSortBy(sortBy) {
    setSort(sortBy)
    gPageIdx = 0
    renderBooks()
    renderBtnState()
}

function onSetFilterBy(filterBy) {
    setFilter(filterBy)
    renderBooks()
}

function onUpdateRate(rating) {
    const newRate = updateBookRate(gCurrBookId, rating)
    const elRateVal = document.querySelector('.rate-val')
    if (elRateVal) elRateVal.innerText = newRate
    renderBooks()
}

function onSetLang(lang) {
    setLang(lang)
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
    renderBooks()
    doTrans()
}

function onSaveBook() {
    const elModalAdd = document.querySelector('.modal-add')
    const elModalUpdate = document.querySelector('.modal-update')
    const elModalRead = document.querySelector('.modal-read')

    if (elModalAdd.classList.contains('open')) {
        const title = elModalAdd.querySelector('[name="title"]').value
        const price = +elModalAdd.querySelector('[name="price"]').value

        if (!title || !price) return alert('Please fill all fields')

        const book = addBook(title, price)
        flashMsg(`Book Added Successfully! ID:${book.id}`)
    }

    else if (elModalUpdate.classList.contains('open')) {
        const newPrice = +elModalUpdate.querySelector('[name="price"]').value
        if (!newPrice) return

        updateBook(gCurrBookId, newPrice)
        flashMsg(`Price Updated to ${newPrice}`)
    }

    else if (elModalRead.classList.contains('open')) {
        const book = getBookById(gCurrBookId)
        flashMsg(`Rating changed to ${book.rate}`)
    }
    renderBooks()
    onCloseModal()
}

////////////////////////////////////////////////////

function renderBtnState() {
    const elPrevBtn = document.querySelector('button.prev')
    const elNextBtn = document.querySelector('button.next')

    elNextBtn.disabled = isEndPage()
    elPrevBtn.disabled = isStartPage()

    if (isStartPage()) elPrevBtn.classList.add('disabled')
    else elPrevBtn.classList.remove('disabled')

    if (isEndPage()) elNextBtn.classList.add('disabled')
    else elNextBtn.classList.remove('disabled')
}

function onChangePage(diff) {
    changePage(diff)
    renderBooks()
    renderBtnState()
}

function initHammer() {
    const elModal = document.querySelector('.modal-read')
    gHammerModal = new Hammer(elModal)

    gHammerModal.on('swiperight swipeleft', ev => {
        if (!elModal.classList.contains('open')) return

        if (ev.type === 'swiperight') {
            onReadBook(elModal.dataset.previd)
        } else {
            onReadBook(elModal.dataset.nextid)
        }
    })
}

function onSwipe() {
    if (!gHammerModal) return
    gHammerModal.on('swiperight swipeleft', ev => {
        const elModal = document.querySelector('.modal')
        if (ev.type === 'swiperight') onReadBook(elModal.dataset.nextid)
        else onReadBook(elModal.dataset.previd)
    })
}