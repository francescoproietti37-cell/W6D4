// endpoint per oggi: https://striveschool-api.herokuapp.com/api/agenda
const eventsURL = 'https://striveschool-api.herokuapp.com/api/agenda'

const footerYear = () => {
  const yearSpan = document.getElementById('year')
  const currentYear = new Date().getFullYear() // ora torna 2026
  yearSpan.innerText = currentYear
}

footerYear()

// ora la pagina dettagli si sta caricando con un parametro nell'URL, di nome "concertID"
// ora recupereremo quel parametro, e lo utilizzeremo per recuperare dalle API un SINGOLO CONCERTO
// (quello di cui volevamo vedere i dettagli) -> creeremo la card

const url = location.search // tutto il contenuto della barra degli indirizzi
console.log('url', url)
const allTheParameters = new URLSearchParams(url) // un oggetto con dentro tutti i parametri
console.log('allTheParameters', allTheParameters)
const concertID = allTheParameters.get('concertID') // l'_id del concerto di cui voglio recuperare i dettagli
console.log('ID DEL CONCERTO', concertID) // 6971f5a7287cba001534be1d

// ora grazie a questo _id posso fare una fetch MOLTO SPECIFICA:
// GET su https://striveschool-api.herokuapp.com/api/agenda -> ARRAY DI CONCERTI
// GET su https://striveschool-api.herokuapp.com/api/agenda/6971f941287cba001534be21 -> OGGETTO DI DETTAGLIO

const turnOffSpinner = function () {
  // spengo lo spinner
  const spinner = document.getElementById('spinner-container')
  spinner.classList.add('d-none')
}

const getConcertDetails = function () {
  fetch(eventsURL + '/' + concertID)
    .then((res) => {
      console.log(res)
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Errore nel recupero del dettaglio concerto')
      }
    })
    .then((details) => {
      console.log('DETTAGLI RECUPERATI', details)
      turnOffSpinner()
      // creo la card
      const row = document.getElementById('events-row')
      row.innerHTML = `
        <div class="col col-12 col-md-8 col-lg-6">
            <div class="card d-flex">
                <img src="https://thumbs.dreamstime.com/b/rock-concert-large-group-happy-people-enjoying-clapping-raised-up-hands-blue-lights-stage-new-year-celebration-46521228.jpg" class="card-img-top" alt="concert-picture">
                <div class="card-body">
                    <h5 class="card-title">${details.name}</h5>
                    <p class="card-text">${details.description}</p>
                    <p class="card-text">${details.time}</p>
                    <p class="card-text">${details.price}€</p>
                    <div class="d-flex justify-content-center gap-3">
                        <a href="./backoffice.html?concertID=${details._id}" class="btn btn-warning">MODIFICA</a>
                        <button class="btn btn-danger" onclick="deleteConcert()">ELIMINA</button>
                    </div>
                </div>
            </div>
        </div>
      `
    })
    .catch((err) => {
      console.log('ERRORE', err)
      turnOffSpinner()
    })
}

const deleteConcert = function () {
  // questa funzione servirà ad eliminare un concerto, quello attualmente visualizzato
  fetch(eventsURL + '/' + concertID, {
    method: 'DELETE',
  })
    .then((res) => {
      console.log(res)
      if (res.ok) {
        // elemento eliminato!
        alert('CONCERTO ELIMINATO!')
        // riportiamo l'utente in home
        location.assign('./index.html')
      } else {
        // elemento NON eliminato!
        throw new Error('Errore durante eliminazione concerto')
      }
    })
    .catch((err) => {
      console.log('ERRORE', err)
      alert('CONCERTO NON ELIMINATO!')
    })
}

getConcertDetails()
