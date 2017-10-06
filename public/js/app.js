// Models
let state = {
    games : []
}

let logos_pages_db = {
    Ravens: "baltimoreravens",
    Titans: "titansonline",
    Rams: "therams",
    Cowboys: "dallascowboys",
    Bears: "chicagobears",
    Bills: "buffalobills",
    Jets: "newyorkjets",
    Lions: "detroitlions",
    Eagles: "philadelphiaeagles",
    Cardinals: "azcardinals",
    Bears: "chicagobears",
    Texans: "houstontexans"
}


// Controllers
function obtener_juegos( url = "http://www.nfl.com/liveupdate/scorestrip/ss.json" ){
    fetch( url ).then(  
    function(response) {  
      if (response.status !== 200) {  
        console.log('Looks like there was a problem. Status Code: ' +  
          response.status);  
        return;  
      }
      response.json().then(function(data) { 
        state.games = data.gms
        display_game_cards( state )
      });  
    }  
  )  
  .catch(function(err) {  
    console.log('Fetch Error :-S', err);  
  });
}

function game_beating( game ){
    visita = get_visita(game)
    casa = get_casa(game)
    let winner, loser = "No One"
    if( casa.score > visita.score ){
        winner = casa.name
        loser = visita.name
    }else if( casa.score > visita.score ){
        winner = visita.name
        loser = casa.name
    }
    res = score_beating( visita.score, casa.score )
    return {
        beating: res.beating,
        diference: res.diference,
        winner: winner,
        loser: loser
    }
}

function get_visita( game ){ 
    return{
        acronym: game.v,
        name: game.vnn,
        score: game.vs
    }
}
function get_casa( game ){ 
    return{
        acronym: game.h,
        name: game.hnn,
        score: game.hs
    }
}
function score_diference(game){
    diference = game_beating( game ).diference
    return `Score diference of: ${ diference } pts`
}
function fuzzy_quote( game ){
    value = game_beating( game ).beating
    diference = game_beating( game ).diference
    quotes = [  "GG EZ PZ NO RE",
                "Do you even lift?",
                "Clearly beaten",
                "Fairly close",
                "Supah tight"]
    if( diference == 0){
        return "Game not played yet"   
    }else if( value < 0.2 ){
        return quotes[4]
    }else if(value < 0.4){
        return quotes[3]
    }else if(value < 0.6){
        return quotes[2]
    }else if(value < 0.8){
        return quotes[1]
    }else if(value < 1){
        return quotes[0]
    }
}
// VIEW
function result_card( game ){
    view = _.template(`
        <div class="ui segment">
            <div class="ui grid" >
              <div class="six wide column" > 
                <div class="ui two column grid">
                  <%= team_view( get_casa( game ) ) %>
                  <%= team_view( get_visita( game ) ) %>
                </div>
              </div>
              <div class="ten wide column" > 
                <h4><%= score_diference( game ) %></h4>
                <h1><%= fuzzy_quote( game ) %></h1>
              </div>
            </div>
        </div>`);
    return view( {game: game} )
}
function team_view( team ){
    view = _.template(`
        <div class="column">
            <div class="ui fluid raised card">
            <div class="image">
                <%= team_logo(team.name) %>
            </div>
            <div class="content">
                <p><%= team.name %></p>
                <a class="header"><%= team.score %></a>
            </div>
            </div>
        </div>`)
    return view( {team: team} )
}
function team_logo( team_name ){
    filtered_name = logos_pages_db[ team_name ] || team_name
    return `<img src="//logo.clearbit.com/${ filtered_name }.com">`
}
function display_game_cards( state ){
    container = document.getElementById( "games_container" )
    container.innerHTML = state.games.map( result_card ).join("")
}

function display_games(){
    obtener_juegos()
}