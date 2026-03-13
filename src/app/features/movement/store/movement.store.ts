import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import type { Movement } from '@features/movement/interfaces';
import { tap, type Observable } from 'rxjs';

@Injectable()
export class MovementStore {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/movements`;

  #movements = signal<Movement[]>([]);
  #loading = signal(false);

  public movements = computed(() => this.#movements());
  public loading = computed(() => this.#loading());

  public getLastBalanceByAccount(accountId: string, openingBalance: number): number {
    const accountMovements = this.#movements().filter(m => m.accountId === accountId);
    if (accountMovements.length === 0) return openingBalance;
    return accountMovements[accountMovements.length - 1].balance;
  }

  public loadAll(): Observable<Movement[]> {
    this.#loading.set(true);
    return this.http.get<Movement[]>(this.apiUrl).pipe(
      tap({
        next: movements => {
          this.#movements.set(movements);
          this.#loading.set(false);
        },
        error: () => {
          this.#loading.set(false);
        },
      })
    );
  }

  public add(movement: Omit<Movement, 'id'>): Observable<Movement> {
    return this.http.post<Movement>(this.apiUrl, movement).pipe(
      tap(newMovement => {
        this.#movements.update(movements => [...movements, newMovement]);
      })
    );
  }

  public delete(movementId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${movementId}`).pipe(
      tap(() => {
        this.#movements.update(movements => movements.filter(m => m.id !== movementId));
      })
    );
  }
}
