import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap, type Observable } from 'rxjs';
import { environment } from '@env/environment';
import type { Account } from '@features/account/interfaces';

@Injectable()
export class AccountStore {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/accounts`;

  #accounts = signal<Account[]>([]);
  #searchQuery = signal('');
  #loading = signal(false);

  public accounts = computed(() => this.#accounts());
  public loading = computed(() => this.#loading());

  public filteredAccounts = computed(() => {
    const query = this.#searchQuery().toLowerCase().trim();
    if (!query) return this.#accounts();
    return this.#accounts().filter(
      account =>
        account.accountNumber.toLowerCase().includes(query) ||
        account.type.toLowerCase().includes(query)
    );
  });

  public setSearchQuery(query: string): void {
    this.#searchQuery.set(query);
  }

  public loadAll(): Observable<Account[]> {
    this.#loading.set(true);
    return this.http.get<Account[]>(this.apiUrl).pipe(
      tap({
        next: accounts => {
          this.#accounts.set(accounts);
          this.#loading.set(false);
        },
        error: () => {
          this.#loading.set(false);
        },
      })
    );
  }

  public add(account: Omit<Account, 'id'>): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account).pipe(
      tap(newAccount => {
        this.#accounts.update(accounts => [...accounts, newAccount]);
      })
    );
  }

  public update(updatedAccount: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${updatedAccount.id}`, updatedAccount).pipe(
      tap(account => {
        this.#accounts.update(accounts => accounts.map(a => (a.id === account.id ? account : a)));
      })
    );
  }

  public delete(accountId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${accountId}`).pipe(
      tap(() => {
        this.#accounts.update(accounts => accounts.filter(a => a.id !== accountId));
      })
    );
  }

  public getAccountById(accountId: string): Account | undefined {
    return this.#accounts().find(account => account.id === accountId);
  }
}
