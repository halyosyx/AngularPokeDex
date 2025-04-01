import { HttpClient } from '@angular/common/http';
import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription, switchMap, takeUntil } from 'rxjs';
import { DataService } from './service/data.service';
import { PokemonApiData, Result } from './interface/pokemon.interface';
import { Pokemon, Species, Sprites } from './interface/individualpokemon.interface';
import { PokemonSpecies } from './interface/individualPokemonSpecies.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit
{
  title = 'Pokedex';
  private pokeApiData = inject(DataService);
  pokeApi: PokemonApiData | undefined;
  pokemonResults: Array<Result> | undefined = [];
  pokemon: Pokemon | undefined;
  pokemonSpecies: PokemonSpecies | undefined;
  pokemonSpriteUrl: string | undefined;
  pokemonDescription: string | undefined;
  pokemonName: string = '';

  https = inject(HttpClient);

  count: number = 0;

  isComplete: boolean = true;


  ngOnInit(): void {

    this.LoadPokeApi();
  }

  LoadPokeApi()
  {
    this.pokeApiData.GetPost().subscribe({
      next: pokeApi => this.pokeApi = pokeApi,
      complete: () => 
        {
          this.pokemonResults = this.pokeApi?.results;
          this.GetIndividualPokemon(2);
        }
      }) 
  }
  

  GetIndividualPokemon(index: number)
  {    
    if (this.pokemonResults == undefined) {
      return;
    }

    this.pokemonName = this.pokemonResults[index].name;

    this.pokeApiData.GetPokemonApi(this.pokemonResults[index]).pipe(switchMap((pokemonResult) => this.pokeApiData.GetPokemonSpecies(pokemonResult.species)))
    .subscribe(
      {
        next: result => this.pokemonSpecies = result,
        complete: () => 
        {
          this.pokemonDescription = this.pokemonSpecies?.flavor_text_entries[0].flavor_text;
        }
      })

    this.pokeApiData.GetPokemonApi(this.pokemonResults[index])
    .subscribe(
      {
        next: result => this.pokemon = result,
        complete: () => 
        {
          this.pokemonSpriteUrl = this.pokemon?.sprites.versions['generation-i'].yellow.front_transparent;
        }
      })
  }
  
  IteratePokemon(next: boolean): void
  { 
    if(this.isComplete)
    {
      this.count += next ? 1 : -1;
      if (this.count < 0) this.count = 0;
      //if(this.count > this.pokemonResults.length - 1) this.count = this.pokemonResults.length - 1
      this.GetIndividualPokemon(this.count);
    }
  }
}
