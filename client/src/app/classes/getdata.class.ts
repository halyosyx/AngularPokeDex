import { catchError, Observable } from "rxjs";

export class GetData<T>
{
    private action$: Observable<T> | undefined;

    data: T | undefined;
    isFetching = false;
    error = false;

    LoadData(action$: Observable<T>): void 
    {
        this.isFetching = true;
        this.error = false;

        this.action$?.pipe(catchError(() => 
            {
                this.data = undefined;
                this.isFetching = false;
                this.error = true;
                return[]
            }))
            .subscribe((data: T) => 
                {
                    this.data = data;
                    this.isFetching = false;
                    this.error = false;
                })
    }
}