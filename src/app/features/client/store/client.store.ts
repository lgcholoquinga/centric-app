import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import type { Client } from '@features/client/interfaces';
import { tap, type Observable } from 'rxjs';

@Injectable()
export class ClientStore {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/clients`;

  #clients = signal<Client[]>([]);
  #searchQuery = signal('');
  #loading = signal(false);

  public clients = computed(() => this.#clients());
  public loading = computed(() => this.#loading());

  public filteredClients = computed(() => {
    const query = this.#searchQuery().toLowerCase().trim();
    if (!query) return this.#clients();
    return this.#clients().filter(
      client =>
        client.name.toLowerCase().includes(query) ||
        client.adress.toLowerCase().includes(query) ||
        client.phone.includes(query)
    );
  });

  public setSearchQuery(query: string): void {
    this.#searchQuery.set(query);
  }

  public loadAll(): Observable<Client[]> {
    this.#loading.set(true);
    return this.http.get<Client[]>(this.apiUrl).pipe(
      tap({
        next: clients => {
          this.#clients.set(clients);
          this.#loading.set(false);
        },
        error: () => {
          this.#loading.set(false);
        },
      })
    );
  }

  public add(client: Omit<Client, 'id'>): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(
      tap(newClient => {
        this.#clients.update(clients => [...clients, newClient]);
      })
    );
  }

  public update(updatedClient: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${updatedClient.id}`, updatedClient).pipe(
      tap(client => {
        this.#clients.update(clients => clients.map(c => (c.id === client.id ? client : c)));
      })
    );
  }

  public delete(clientId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clientId}`).pipe(
      tap(() => {
        this.#clients.update(clients => clients.filter(c => c.id !== clientId));
      })
    );
  }

  public getClientById(clientId: string): Client | undefined {
    return this.#clients().find(client => client.id === clientId);
  }
}
