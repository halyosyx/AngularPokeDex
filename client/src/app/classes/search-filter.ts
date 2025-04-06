import { Pipe, PipeTransform } from "@angular/core";
import { Result } from "../interface/pokemon.interface";
@Pipe({name: 'searchFilter',
    standalone: true
})

export class SearchFilter implements PipeTransform {
    transform(value: Array<Result>, search:string | undefined) {
        if(!search){return value};
        return value.filter(val => {
                if (!val) return;
                return val.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            })
    }
}
