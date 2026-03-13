import { Injectable } from '@angular/core';
import type { MenuItem } from '@shared/interfaces';

@Injectable({ providedIn: 'root' })
export class MenuStore {
  public readonly menuItems: MenuItem[] = [
    { label: 'Clientes', route: '/client' },
    { label: 'Cuentas', route: '/account' },
    { label: 'Movimientos', route: '/movement' },
    { label: 'Reportes', route: '/report' },
  ];
}
