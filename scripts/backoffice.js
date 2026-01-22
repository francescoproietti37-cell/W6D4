// endpoint per oggi: https://striveschool-api.herokuapp.com/api/agenda
const eventsURL = 'https://striveschool-api.herokuapp.com/api/agenda'

const footerYear = () => {
  const yearSpan = document.getElementById('year')
  const currentYear = new Date().getFullYear() // ora torna 2026
  yearSpan.innerText = currentYear
}

footerYear()

// ------! PARTE FINALE DELLA LEZIONE !---------
// dobbiamo ora permettere a questa pagina ANCHE di modificare eventi esistenti
// il tasto "MODIFICA" della pagina dettaglio mi riporterà in backoffice.html con un parametro ("concertID")
// SE questo parametro esiste, la pagina backoffice entrerà in "modalità modifica"

const url = location.search // tutto il contenuto della barra degli indirizzi
console.log('url', url)
const allTheParameters = new URLSearchParams(url) // un oggetto con dentro tutti i parametri
console.log('allTheParameters', allTheParameters)
const concertID = allTheParameters.get('concertID') // l'_id del concerto di cui voglio recuperare i dettagli
console.log('ID DEL CONCERTO', concertID) // 6971f5a7287cba001534be1d

// se ho cliccato il tasto "Backoffice" nella navbar -> CREAZIONE -> concertID è null
// se ho cliccato il tasto "MODIFICA" nella details.html -> MODIFICA -> concertID è una stringa
if (concertID !== null) {
  // MODALITÀ MODIFICA
  // RECUPERO I DETTAGLI DEL SINGOLO CONCERTO DA MODIFICARE
  fetch(eventsURL + '/' + concertID)
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Errore nel recupero dettagli concerto da modificare')
      }
    })
    .then((details) => {
      console.log('DETTAGLI CONCERTO DA MODIFICARE', details)
      // RI-POPOLO IL FORM CON I VALORI RECUPERATI
      // PRIMA RECUPERO I RIFERIMENTI AGLI INPUT
      const nameInput = document.getElementById('name')
      const descriptionInput = document.getElementById('description')
      const timeInput = document.getElementById('time')
      const priceInput = document.getElementById('price')
      // ORA RIEMPIO FISICAMENTE I CAMPI
      nameInput.value = details.name
      descriptionInput.value = details.description
      timeInput.value = details.time.slice(0, -5) // tolgo gli ultimi 5 chars perchè non serve la timezone
      priceInput.value = details.price
    })
    .catch((err) => {
      console.log('ERRORE', err)
    })
}

// ------! PARTE FINALE DELLA LEZIONE !---------

class Concert {
  constructor(_name, _description, _time, _price) {
    this.name = _name
    this.description = _description
    this.time = _time
    this.price = _price
  }
}

// recuperiamo il riferimento al form, lavoriamo con il suo evento di submit
// e raccogliamo i valori dei campi
const form = document.getElementById('event-form')
form.addEventListener('submit', function (e) {
  e.preventDefault()
  // raccolgo i dati inseriti nel form
  const name = document.getElementById('name').value // 'Gianni Morandi in concerto'
  const description = document.getElementById('description').value // 'Imperdibile'
  const time = document.getElementById('time').value // '2026-01-22T19:00:00'
  const price = document.getElementById('price').value // 100
  // li compattiamo in un oggetto
  const concert = new Concert(name, description, time, price)
  console.log('CONCERTO DA SALVARE', concert)

  // ---- WARNING PARTE FINALE ----
  // il metodo POST crea una nuova risorsa e si fa SEMPRE sull'enpoint "generico"
  // il metodo PUT modifica una risorsa esistente e si fa SEMPRE sull'enpoint "specifico" (completo di id)
  let method
  let finalURL

  if (concertID !== null) {
    // PUT
    method = 'PUT'
    finalURL = eventsURL + '/' + concertID
  } else {
    // POST
    method = 'POST'
    finalURL = eventsURL // indirizzo generico
  }
  // ---- WARNING PARTE FINALE ----

  // bene! ora lo salveremo nel DB collegato all'api "/agenda"
  // con una chiamata POST
  fetch(finalURL, {
    // specifico che il metodo deve essere 'POST'
    method: method,
    // allego alla chiamata il concerto da salvare
    // in formato JSON
    body: JSON.stringify(concert),
    headers: {
      // forniscono cose come l'autorizzazione
      // Authorization: 'xxxxxxxxx'
      // ma in questo caso l'unico header obbligatorio è content-type
      // serve a specificare in che formato stiamo inviando i dati
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      console.log('RES', res)
      if (res.ok) {
        // vuol dire che il concerto è stato correttamente salvato
        // noi qua di solito proseguivamo ed tiravamo fuori il JSON dalla risposta...
        // ...volendo qua non serve proseguire!
        alert('CONCERTO SALVATO!')
        form.reset() // azzeriamo i campi
      } else {
        throw new Error('Errore nel salvataggio del concerto')
      }
    })
    .catch((err) => {
      console.log('ERRORE', err)
      alert('ERRORE')
    })
})
