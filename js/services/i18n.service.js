'use strict'

const gTrans = {
    title: {
        en: 'Welcome to my books shop!',
        es: 'Bienvenidos a mi libreria!',
        he: 'ברוכים הבאים לחנות הספרים שלי!'
    },
    'create-btn': {
        en: 'Create new book',
        es: 'Crear un nuevo libro',
        he: 'צור ספר חדש',
    },
    'price': {
        en: 'Min price',
        es: 'Precio minimo',
        he: 'מחיר מינימלי',
    },
    'title-btn': {
        en: 'TITLE ↕',
        es: 'TITULO ↕',
        he: 'כותרת ↕',
    },
    'price-btn': {
        en: 'Price ↕',
        es: 'PRECIO ↕',
        he: 'מחיר ↕',
    },
    'actions': {
        en: 'ACTIONS',
        es: 'ACCIONES',
        he: 'פעולות',
    },
    'rate': {
        en: 'Rate ⭐',
        es: 'califica ⭐',
        he: 'דרג ⭐',
    },
    'close-btn': {
        en: 'Close ❌',
        es: 'Cerrar ❌',
        he: 'לסגור ❌',
    },
    'save-btn': {
        en: 'Save ✅',
        es: 'Guardar ✅',
        he: 'לשמור ✅',
    },
    footer: {
        en: 'This site was built by ©shaniki with love ♥',
        es: 'Este sitio creado por ©shaniki con amor ♥',
        he: 'האתר הזה נבנה ע"י  ©שניקי באהבה ♥',
    },
    'book-price': {
        en: 'Price',
        es: 'Precio',
        he: 'מחיר',
    },
    'delete-btn': {
        en: 'Delete',
        es: 'Borrar',
        he: 'למחוק',
    },
    'read-btn': {
        en: 'Read',
        es: 'Leer',
        he: 'לקרוא',
    },
    'update-btn': {
        en: 'Update',
        es: 'Actualizar',
        he: 'לעדכן',
    },
    sure: {
        en: 'Are you sure?',
        es: 'Estas Seguru?',
        he: 'אתה בטוח?',
    },
    'what-title': {
        en: 'What is the title of the new book?',
        es: 'Que es el titulo del nuevo libro?',
        he: 'מה כותרת הספר החדש?',
    },
    'what-price': {
        en: 'What is the price of the new book?',
        es: 'Cuanto cuesta el nuevo libro?',
        he: 'כמה עולה הספר החדש?',
    },
    'NBF': {
        en: 'No books found...',
        es: 'No se encontraron libros...',
        he: 'לא נמצאו ספרים...',
    },
    'new-price': {
        en: 'New price?',
        es: 'Nuevo precio?',
        he: 'מחיר חדש?',
    },
}

var gCurrLang = 'en'

function getTrans(transKey) {

    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'
    let transTxt = transMap[gCurrLang]
    if (!transTxt) transTxt = transMap.en
    return transTxt
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        // console.log('transKey:', transKey)
        const transTxt = getTrans(transKey)
        // console.log('transTxt:', transTxt)
        if (el.placeholder) el.placeholder = transTxt
        else el.innerText = transTxt
    })
}

function setLang(lang) {
    gCurrLang = lang
}

// function formatNumSimple(num) {
//     return num.toLocaleString(gCurrLang)
// }

// function formatNum(num) {
//     return new Intl.NumberFormat(gCurrLang).format(num)
// }

// function formatCurrency(num) {
//     return new Intl.NumberFormat(gCurrLang, { style: 'currency', currency: 'ILS' }).format(num)
// }

// function formatDate(time) {

//     var options = {
//         year: 'numeric', month: 'numeric', day: 'numeric',
//         hour: 'numeric', minute: 'numeric'
//     }

//     return new Intl.DateTimeFormat(gCurrLang, options).format(time)
// }

// // Kilometers to Miles
// function kmToMiles(km) {
//     return km / 1.609
// }

// // Kilograms to Pounds:
// function kgToLbs(kg) {
//     return kg * 2.20462262185
// }

// function getPastRelativeFrom(ts) {
//     const diff = Date.now() - new Date(ts)
//     const seconds = diff / 1000
//     const minutes = seconds / 60
//     const hours = minutes / 60
//     const days = hours / 24

//     const formatter = new Intl.RelativeTimeFormat('en-US', {
//         numeric: 'auto'
//     })
//     if (seconds <= 60) return formatter.format(-seconds, 'seconds')
//     if (minutes <= 60) return formatter.format(-minutes, 'minutes')
//     if (hours <= 24) return formatter.format(-hours, 'hours')
//     return formatter.format(-days, 'days')
// }