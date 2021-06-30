import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetMonthItem } from '../budgetmonth';

@Component({
  selector: 'app-budget-mensal',
  templateUrl: './mensal.component.html',
  styleUrls: ['./mensal.component.css']
})
export class MensalComponent implements OnInit {
  @Input() items: BudgetMonthItem[];
  dataSource;
  displayedColumns;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.items);
    this.displayedColumns = ['empresa', 'conta', 'data', 'valor', 'observacoes'];
    this.dataSource.sort = this.sort;
  }

}
