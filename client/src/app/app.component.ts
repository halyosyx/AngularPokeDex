import { HttpClient } from '@angular/common/http';
import { Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription, switchMap, takeUntil } from 'rxjs';
import { DataService } from './service/data.service';
import { PokemonApiData, Result } from './interface/pokemon.interface';
import { Pokemon, Species, Sprites } from './interface/individualpokemon.interface';
import { PokemonSpecies } from './interface/individualPokemonSpecies.interface';
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, SearchBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit, OnDestroy
{
  title = 'PokeDex Entries'
  generation = 'Generation 1'

  https = inject(HttpClient);

  private pokeApiData = inject(DataService);
  private formBuilder = new FormBuilder().nonNullable;

  pokeApi: PokemonApiData | undefined;
  pokemonResults: Array<Result> = [];
  pokemon: Pokemon | undefined;
  pokemonSpecies: PokemonSpecies | undefined;

  pokemonType: string = '';
  pokemonSpriteUrl: string = '';
  pokemonDescription: string = '';
  pokemonName: string = '';
  pokeIndex: number = 0;
  isComplete: boolean = true;


  searchValue = '';
  searchForm = this.formBuilder.group({searchValue: ''})

  pokemonResultsSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.loadPokeApi();
  }

  ngOnDestroy(): void {

    this.pokemonResultsSubscription?.unsubscribe();

  }

  //Write a more typescript centric way of filtering through the list of pokemon to get the result. Maybe use maps for this one
  //TODO: Move this functionality to a search component
  onSearchSubmit()
  {
    let searchedName = this.searchForm.value.searchValue ?? '';
    if (searchedName == '') return;

    if (this.pokemonResults == undefined || this.pokemonResults.length <= 0) {
      console.error('Missing Pokemon Results');
      return;
    }

    for (let index = 0; index < this.pokemonResults.length; index++) {
      let pokemonName = this.pokemonResults[index].name;
      if (pokemonName.toLowerCase() == searchedName.toLowerCase()) {
        this.getIndividualPokemon(index);
        this.pokeIndex = index;
        return;
      }
    }

    this.invalidEntry(`"${searchedName}" does not exist in this pokeDex database!`);
  }

  loadPokeApi()
  {
    this.pokeApiData.GetPost().subscribe({
      next: pokeApi => this.pokeApi = pokeApi,
      complete: () => 
        {
          if(this.pokeApi != undefined)
          {
            this.pokemonResults = this.pokeApi.results;
          }

          this.getIndividualPokemon(0);
        }
      }) 
  }
  
  invalidEntry(failReason: string)
  {
    this.pokemonName = 'ERROR!!!'
    this.pokemonDescription = failReason;
    this.pokemonSpriteUrl = '../assets/MissingNo.png';
  }

  getIndividualPokemon(index: number)
  {    
    if (this.pokemonResults == undefined) {
      return;
    }

    this.pokemonName = this.pokemonResults[index].name;

    this.pokemonResultsSubscription = this.pokeApiData.GetPokemonApi(this.pokemonResults[index])
    .subscribe(
      {
        next: result => this.pokemon = result,
        complete: () => 
        {
          if(this.pokemon != undefined)
          {
            this.pokemonSpriteUrl = this.pokemon.sprites.versions['generation-i'].yellow.front_transparent;
            this.pokemonType = this.pokemon.types[0].type.name;
          }
        }
      })

    // Gets PokemonSpecies API
    this.pokeApiData.GetPokemonApi(this.pokemonResults[index]).pipe(switchMap((pokemonResult) => this.pokeApiData.GetPokemonSpecies(pokemonResult.species)))
    .subscribe(
      {
        next: result => this.pokemonSpecies = result,
        complete: () => 
        {
          if(this.pokemonSpecies != undefined)
            this.pokemonDescription = this.pokemonSpecies?.flavor_text_entries[2].flavor_text;
        }
      })    
  }
  
  iteratePokemon(next: boolean): void
  { 
    this.pokeIndex += next ? 1 : -1;
    if (this.pokeIndex < 0) this.pokeIndex = 0;

    if(this.pokeIndex > this.pokemonResults.length - 1) this.pokeIndex = this.pokemonResults.length - 1
    this.getIndividualPokemon(this.pokeIndex);
  }
}
