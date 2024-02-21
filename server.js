// 1. Opzetten van de webserver

// Importeer het npm pakket express uit de node_modules map
import express, { response } from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'

// Haal alle squads uit tribe 1 uit de WHOIS API op
const squadData = await fetchJson(apiUrl + '/squad/?filter={"tribe_id":1}')

// Maak een array met alle style bestanden en geef ze de squadid van de squad die deze starter hebben
const typeCss = [
  {uri: '/styles/home.css', squad_id: '0'},
  {uri: '/styles/grass.css', squad_id: '5' },
  {uri: '/styles/water.css', squad_id: '4' },
  {uri: '/styles/fire.css', squad_id: '3' },
]

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// 2. Routes die HTTP Requests and Responses afhandelen

// Maak een GET route voor de index
app.get('/', function (request, response) {
  // Haal alle personen uit de WHOIS API op
  fetchJson(apiUrl + '/person').then((persons) => {
    // apiData bevat gegevens van alle personen uit alle squads
    
    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
    // HTML maken op basis van JSON data
    response.render('index', {persons: persons.data, squads: squadData.data, styles: typeCss})
  })
})

// Maak een POST route voor de index
app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, '/')
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(apiUrl + '/person/' + request.params.id).then((apiData) => {
    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('person', {person: apiData.data, squads: squadData.data})
  })
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/squad/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste personen uit de squad uit de WHOIS API op
  fetchJson(apiUrl + '/person/?filter={"squad_id":' + request.params.id + '}').then((person) => {
    //Filter de squadData zodat hij alleen maar de squad info van de squad met dit id heeft
    let filterData = squadData.data.filter(squad => {
      return squad.id == request.params.id
    })

    //Filter de typeCss zodat het juiste css bestand wordt geladen
    let filterCss = typeCss.filter( typeCss => {
      return typeCss.squad_id == request.params.id
    })
    // Render squad.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd squad
    response.render('squad', {persons: person.data, squad: filterData, styles: filterCss})
  })
})

// 3. Start de webserver

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})



