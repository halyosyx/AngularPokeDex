import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PokemonApiData, Result } from "../interface/pokemon.interface";
import { Pokemon, Species } from "../interface/individualpokemon.interface";
import { PokemonSpecies } from "../interface/individualPokemonSpecies.interface";

@Injectable({
    providedIn: 'root'
})

export class DataService
{
    private http = inject(HttpClient);
    apiUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151"
    
    GetPost()
    {
        return this.http.get<PokemonApiData>(this.apiUrl);
    }

    GetPokemonApi(result: Result)
    {
        return this.http.get<Pokemon>(result.url);
    }

    GetPokemonSpecies(species: Species)
    {
        return this.http.get<PokemonSpecies>(species.url);
    }

}