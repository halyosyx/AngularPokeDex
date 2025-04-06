import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { PokemonApiData } from '../../interface/pokemon.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent{

  private pokeApi = inject(DataService);
  postSubscription: Subscription | undefined;
  pokemonApi: PokemonApiData | undefined;
  pokemonNamesArray: Array<string> | undefined;
  

  //Filter throughList
  filterList(pokemonName: string)
  {

  }

  initialize(): void {

    this.postSubscription = this.pokeApi.GetPost().subscribe(
      {
        next: results => this.pokemonApi = results,
        error: err => console.log(err),
        complete: () => 
          {
            if (this.pokemonApi == undefined) return;

            this.pokemonApi.results.forEach(element => {
              this.pokemonNamesArray?.push(element.name);
            });

            this.printNames();
          }
      })
  }

  destroy(): void {
    this.postSubscription?.unsubscribe();
  }

  printNames(): void {
    if (this.pokemonNamesArray != null) {
      this.pokemonNamesArray.forEach((name) => 
        {
          console.log(name);
        })
    }

  }


}
