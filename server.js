/*** Express setup & start ***/

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Importeer het npm pakket express uit de node_modules map
import express, { response } from 'express'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorgt dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

/*** Routes & data***/
// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items/'

// Haal alle squads uit tribe 1 uit de WHOIS API op
const squadData = await fetchJson(apiUrl + 'squad/?filter={"tribe_id":1}')

// Maak een array met alle style bestanden en geef ze de squadid van de squad die deze starter hebben
const typeCss = [
  {uri: '/styles/home.css', squad_id: '0' },
  {uri: '/styles/fire.css', squad_id: '3' },
  {uri: '/styles/water.css', squad_id: '4'},
  {uri: '/styles/grass.css', squad_id: '5'},
]

const typeImg = [
  {type: 'fire', uri: '/assets/Type_Fire.webp', squad_id: '3'},
  {type: 'water', uri: '/assets/Type_Water.webp', squad_id: '4'},
  {type: 'grass', uri: '/assets/Type_Grass.webp', squad_id: '5'},
]

const comments = []

// 2. Routes die HTTP Requests and Responses afhandelen

// Maak een GET route voor de index
app.get('/', function (request, response) {
  // Haal alle personen uit de WHOIS API op
  fetchJson(apiUrl + 'person').then((persons) => {
    // apiData bevat gegevens van alle personen uit alle squads
    
    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
    // HTML maken op basis van JSON data
    response.render('index', {persons: persons.data, squads: squadData.data, styles: typeCss, images: typeImg})
  })
})

// Maak een POST route voor de index
app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, '/')
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/squad/:id', function (request, response) {
  // Maak een let aan die sortBy heet.
  let sortBy = ''

  // Als er een sort is maak het als inhoud "&sort=" 
  if(request.param('sort')) {
    sortBy = `&sort=${request.param('sort')}`
  }

  // Gebruik de request parameter id en haal de juiste personen uit de squad uit de WHOIS API op
  fetchJson(apiUrl + 'person/?filter={"squad_id":' + request.params.id + '}' + sortBy).then((person) => {
    //Filter de squadData zodat hij alleen maar de squad info van de squad met dit id heeft
    let filterData = squadData.data.filter(squad => {
      return squad.id == request.params.id
    })

    //Filter de typeCss zodat het juiste css bestand wordt geladen
    let filterCss = typeCss.filter( typeCss => {
      return typeCss.squad_id == request.params.id
    })

    // Het custom field is een String, dus die moeten we eerst omzetten (= parsen)
    // naar een Object, zodat we er mee kunnen werken
    try {
      person.data.custom = JSON.parse(person.data.custom)
    } catch (error) {}

    // Render squad.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd squad
    response.render('squad', {persons: person.data, squad: filterData, styles: filterCss})
  })
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste personen uit de squad uit de WHOIS API op
  fetchJson(apiUrl + 'person/' + request.params.id).then((person) => {
    // Het custom field is een String, dus die moeten we eerst omzetten (= parsen)
    // naar een Object, zodat we er mee kunnen werken
    try {
      person.data.custom = JSON.parse(person.data.custom)
    } catch (error) {}
    // Render squad.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd squad
    response.render('person', {person: person.data, squad: squadData.data, styles: typeCss})
  })
})

// Als we vanuit de browser een POST doen op de detailpagina van een persoon
app.post('/person/:id', function(request, response) {
  // Stap 1: Haal de huidige data op, zodat we altijd up-to-date zijn, en niks weggooien van anderen
  // Haal eerst de huidige gegevens voor deze persoon op, uit de WHOIS API
  fetchJson(apiUrl + 'person/' + request.params.id).then((apiResponse) => {
    // Het custom field is een String, dus die moeten we eerst
    // omzetten (= parsen) naar een Object, zodat we er mee kunnen werken
    try {
      apiResponse.data.custom = JSON.parse(apiResponse.data.custom)
    } catch (error) {
      apiResponse.data.custom = {}
    }

    // Stap 2: Gebruik de data uit het formulier
    // Deze stap zal voor iedereen net even anders zijn, afhankelijk van de functionaliteit

    // Controleer eerst welke actie is uitgevoerd, aan de hand van de submit button
    // Dit kan ook op andere manieren, of in een andere POST route
    if (request.body.actie == 'sent') {
      // Als het custom object nog geen messages Array als eigenschap heeft, voeg deze dan toe
      if (!apiResponse.data.custom.comments) {
        apiResponse.data.custom.comments = []
      }
     
      // Als het custom object nog geen vote heeft, voeg deze dan toe
      if(!apiResponse.data.custom.vote) {
        apiResponse.data.custom.vote = 0;
      }

      // Voeg een nieuwe message toe voor deze persoon, aan de hand van het bericht uit het formulier
      apiResponse.data.custom.comments.push(request.body.comment)

    } else if (request.body.vote == 'upvote') {
      apiResponse.data.custom.vote = apiResponse.data.custom.vote + 1;

    } else if (request.body.vote == 'downvote') {
       apiResponse.data.custom.vote = apiResponse.data.custom.vote - 1;
    }
  
    // Stap 3: Sla de data op in de API
    // Voeg de nieuwe lijst messages toe in de WHOIS API,
    // via een PATCH request
    fetch(apiUrl + 'person/' + request.params.id, {
      method: 'PATCH',
      body: JSON.stringify({
        custom: apiResponse.data.custom
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then((patchResponse) => {
      // Redirect naar de persoon pagina
      response.redirect(303, '/person/' + request.params.id)
    })
  })
})
