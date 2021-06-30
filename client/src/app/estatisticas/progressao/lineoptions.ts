import {ChartType} from 'chart.js/auto';

export class LineData {
  nome: string;
  valor: number;
  constructor() { }
}

export class LineOptions {

  ChartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    rafa:  'rgb(22, 222, 236)'
  };
  colorNames = Object.keys(this.ChartColors);

  ConfigOptions = {
    type: 'line' as ChartType,
    data: {
      labels: [],
      datasets: [{
        label: '',
        fill: false,
        backgroundColor: this.ChartColors.rafa,
        borderColor: this.ChartColors.rafa,
        tension: 0.3,
        data: [],
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    var label = '';
                    if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                    }
                    return label;
                }
            }
        }
      }
    }

  };

  constructor() { }

  public setData(data: LineData[]): void {
    this.ConfigOptions.data.datasets[0].data = [];
    this.ConfigOptions.data.labels = [];
    data.forEach(item => {
      this.ConfigOptions.data.datasets[0].data.push(item.valor);
      this.ConfigOptions.data.labels.push(item.nome);
    });
  }

  public compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }
  private getColor(index) {
    const colorName = this.colorNames[index % this.colorNames.length];
    return this.ChartColors[colorName];
  }

  public getMonthString(month): string {
    switch (month) {
      case 0: return 'Janeiro';
      case 1: return 'Fevereiro';
      case 2: return 'Março';
      case 3: return 'Abril';
      case 4: return 'Maio';
      case 5: return 'Junho';
      case 6: return 'Julho';
      case 7: return 'Agosto';
      case 8: return 'Setembro';
      case 9: return 'Outubro';
      case 10: return 'Novembro';
      case 11: return 'Dezembro';
      default: return '';
    }
  }


}
