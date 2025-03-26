import { HttpClient } from '@angular/common/http';
import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

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
  https = inject(HttpClient);
  pokeApi: any;
  pokemons: any;
  pokemon: string = '';

  count: number = 0;

  pokemonData: any;
  pokemonTypes: any;
  sprite: any;
  pokemonDescription: string = '';

  pokemonSpecies: any;
  isComplete: boolean = true;
  audio: any = new Audio();

  ngOnInit(): void {
      this.https.get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151').subscribe(
        {
          next: response => this.pokeApi = response,
          error: err => console.log(err),
          complete: () => 
            {
              this.pokemons = this.pokeApi.results;
              this.pokemon = this.pokemons[0].name;
              this.GetPokemonData(0);
              console.log("Initialized Data");
            }
          })
  }

  IteratePokemon(next: boolean): void
  {
    this.count += next ? 1 : -1;
    if (this.count < 0) this.count = 0;
    if(this.count > this.pokemons.length - 1) this.count = this.pokemons.length - 1

    if(this.isComplete)
    {
      this.GetPokemonData(this.count);
    }
  }

  GetPokemonData(id: number): void
  {
    this.isComplete = false;
    
    this.https.get(`https://pokeapi.co/api/v2/pokemon-species/${id + 1}`).subscribe(
      {
        next: response => this.pokemonSpecies = response,
        error: err => console.log(err),
        complete: () => 
          {
            this.pokemonDescription = this.pokemonSpecies.flavor_text_entries[2].flavor_text;
          }
        })
        
        this.https.get(this.pokemons[id].url).subscribe(
          {
            next: response => this.pokemonData = response,
            error: err => console.log(err),
            complete: () => 
            {
              let pokemonName = this.pokemons[id].name;

              this.pokemon = String(pokemonName).toUpperCase();
              this.pokemonTypes = this.pokemonData.types;
              this.isComplete = true;

              //NOTE: Might be better to cache an array of png.
              this.sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/${id + 1}.png`;
              this.audio.src = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id + 1}.ogg`;
              
              this.audio.load();
              this.audio.play();
              this.audio.volume = 0.5;
            }
      })
  }
}
