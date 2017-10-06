let state = {
    games : []
}

let logos_pages_db = {
    Ravens: "baltimoreravens"
}

function obtener_juegos( url = "http://www.nfl.com/liveupdate/scorestrip/ss.json" ){
    fetch( url ).then(  
    function(response) {  
      if (response.status !== 200) {  
        console.log('Looks like there was a problem. Status Code: ' +  
          response.status);  
        return;  
      }
      response.json().then(function(data) {  
        console.log(data);
        state.games = data.gms
        display_game_cards( state )
      });  
    }  
  )  
  .catch(function(err) {  
    console.log('Fetch Error :-S', err);  
  });
}

function team_logo( team_name ){
    return `<img src="//logo.clearbit.com/${ team_name }.com">`
}

function game_beating( game ){
    visita = get_visita(game)
    casa = get_casa(game)
    let winner, loser = "No One"
    if( casa.score > visita.score ){
        winner = casa.name
        loser = visita.name
    }else{
        winner = visita.name
        loser = casa.name
    }
    return {
        beating: score_beating( visita.score, casa.score ),
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
              <div class="six wide column" > 
                <h1>You got REKT</h1>
              </div>
            </div>
        </div>
    `);
    return view( {game: game} )
}
function team_view( team ){
    view = _.template(`
        <div class="column">
            <div class="ui fluid raised card">
            <div class="image">
                <img src="//logo.clearbit.com/<%= team.name %>.com">
            </div>
            <div class="content">
                <p><%= team.name %></p>
                <a class="header"><%= team.score %></a>
            </div>
            </div>
        </div>
    `)
    return view( {team: team} )
}

function display_game_cards( state ){
    container = document.getElementById( "games_container" )
    container.innerHTML = state.games.map( result_card )
}

function display_games(){
    obtener_juegos()
}