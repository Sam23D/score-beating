

function score_beating( first, second ){
    diff = Math.abs( first - second )
    return fuzzy_of(diff)
}

function fuzzy_of( value, config = { inflexion: 11.878504672897197 , slope: 0.2 , max: 38 , min: 1 } ){
    return ( 1 / ( 1 + Math.exp( -config.slope*( value -(config.inflexion * 1.5 ) ))) )
}