import {ChartType} from 'chart.js/auto';
export class RosquinhaData {
  nome: string;
  valor: number;
  constructor() { }
}


export class RosquinhaOptions {

  ChartColors = {
    color1: 'rgb(255, 99, 132)',
    color2: 'rgb(255, 159, 64)',
    color3: 'rgb(75, 192, 192)',
    color4: 'rgb(153, 102, 255)',
    color5: 'rgb(255, 205, 86)',
    color6: 'rgb(201, 203, 207)',
    color7: 'rgb(54, 162, 235)',
    color8: 'rgb(133, 139, 46)',
    color9: 'rgb(12, 143, 99)',
    color10: 'rgb(173, 98, 63)'
  };
  colorNames = Object.keys(this.ChartColors);

  RosquinhaOptions = {
    type: 'doughnut' as ChartType,
    data: {
      labels: [], // <--- This
      fill: false,
      backgroundColor: this.ChartColors.color7,
      borderColor: this.ChartColors.color7,
      datasets: [{
        label: 'Total cases.',
        data: [], // <--- This
        backgroundColor: [], // <--- This
        borderColor: '#303030',
        borderWidth: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'top',
      },
      plugins: {
        tooltip: {
            callbacks: {
                label: function(context) {
                    var label = context.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed !== null) {
                        label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
                    }
                    return label;
                }
            }
        }
      }
    }
  };

  constructor() {}

  private getColor(index) {
    const colorName = this.colorNames[index % this.colorNames.length];
    return this.ChartColors[colorName];
  }

  public setData(data: RosquinhaData[]): void {
    this.RosquinhaOptions.data.datasets[0].data = [];
    this.RosquinhaOptions.data.labels = [];
    this.RosquinhaOptions.data.datasets[0].backgroundColor = [];
    let i = 0;
    data.forEach(item => {
      this.RosquinhaOptions.data.datasets[0].data.push(item.valor);
      this.RosquinhaOptions.data.labels.push(item.nome);
      this.RosquinhaOptions.data.datasets[0].backgroundColor.push(this.getColor(i));
      i++;
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

}
