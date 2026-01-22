// endpoint per oggi: https://striveschool-api.herokuapp.com/api/agenda
const eventsURL = 'https://striveschool-api.herokuapp.com/api/agenda'

const footerYear = () => {
  const yearSpan = document.getElementById('year')
  const currentYear = new Date().getFullYear() // ora torna 2026
  yearSpan.innerText = currentYear
}

const getEvents = function () {
  fetch(eventsURL)
    .then((res) => {
      console.log('RESPONSE', res)
      if (res.ok) {
        // la response sta riportando i dati richiesti e possiamo proseguire
        // come proseguiamo? estraendo il JSON dalla response
        return res.json()
      } else {
        // auto-trasportarmi nel blocco catch, sollevando a mano un errore
        throw new Error('La response ha un problema')
      }
    })
    .then((data) => {
      console.log('EVENTI RICEVUTI:', data)
      // a questo punto dovremmo avere i concerti, inseriamoli nella pagina
      // però prima nascondiamo lo spinner, che non serve più
      const spinner = document.getElementById('spinner-container')
      spinner.classList.add('d-none')
      const row = document.getElementById('events-row')
      data.forEach((concert) => {
        row.innerHTML += `
            <div class="col">
                <div class="card d-flex">
                    <img src="https://thumbs.dreamstime.com/b/rock-concert-large-group-happy-people-enjoying-clapping-raised-up-hands-blue-lights-stage-new-year-celebration-46521228.jpg" class="card-img-top" alt="concert-picture">
                    <div class="card-body">
                        <h5 class="card-title">${concert.name}</h5>
                        <p class="card-text">${concert.description}</p>
                        <p class="card-text">${concert.time}</p>
                        <p class="card-text">${concert.price}€</p>
                        <a href="./details.html?concertID=${concert._id}" class="btn btn-primary w-100">VAI AI DETTAGLI</a>
                    </div>
                </div>
            </div>
        `
      })
    })
    .catch((err) => {
      console.log('ERRORE NELLA FETCH', err)
      const spinner = document.getElementById('spinner-container')
      spinner.classList.add('d-none')
    })
}

footerYear()

getEvents()
