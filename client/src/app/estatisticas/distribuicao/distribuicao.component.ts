import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Conta } from '../../conta/conta';
import { Pagamento } from '../../pagamento/pagamento';
import { Categoria } from '../../categoria/categoria';
import { Empresa } from '../../empresa/empresa';
import { ContaService } from '../../conta/conta.service';
import { CategoriaService } from '../../categoria/categoria.service';
import { EmpresaService } from '../../empresa/empresa.service';
import { PagamentoService } from '../../pagamento/pagamento.service';
import { RosquinhaData, RosquinhaOptions} from './rosquinhaoptions';


@Component({
  selector: 'app-distribuicao-chart',
  templateUrl: './distribuicao.component.html',
  styleUrls: ['./distribuicao.component.css']
})
export class DistribuicaoComponent implements OnInit {

  rosquinhaCanvas: any;
  rosquinhaContext: any;
  rosquinhaChart: any;
  rosquinhaOptions = new RosquinhaOptions();
  rosquinhaData: RosquinhaData[] = [];

  rosquinhaChoice = 'empresa';

  constructor(
    public contaService: ContaService,
    public categoriaService: CategoriaService,
    public empresaService: EmpresaService,
    public pagamentoService: PagamentoService,
  ) { }

  categorias: Categoria[] = [];
  empresas: Empresa[] = [];
  contas: Conta[] = [];
  pagamentos: Pagamento[] = [];

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe((categ: Categoria[]) => {
      this.categorias = categ;
      this.empresaService.getAll().subscribe((data: Empresa[]) => {
        this.empresas = data;
        this.contaService.getAll().subscribe((data1: Conta[]) => {
          this.contas = data1;
          this.pagamentoService.getAll().subscribe((data2: Pagamento[]) => {
            this.pagamentos = data2;
            this.iniciaChart();
            this.atualizaChart();
          });
        });
      });
    });
  }

  preparaDados(): void {
    const newRosquinhaData: RosquinhaData[] = [];
    if (this.rosquinhaChoice === 'categoria') {
      this.categorias.forEach(categoria => {
        const contasAssociadas = this.contas.filter(conta => conta.categoria === categoria._id);
        let total = 0;
        contasAssociadas.forEach(conta => {
          total = total + conta.valor;
        });
        const roscaItem = new RosquinhaData();
        roscaItem.nome = categoria.nome;
        roscaItem.valor = total;
        newRosquinhaData.push(roscaItem);
      });
    } else {
      this.empresas.forEach(empresa => {
        const contasAssociadas = this.contas.filter(conta => conta.empresa === empresa._id);
        let total = 0;
        contasAssociadas.forEach(conta => {
          total = total + conta.valor;
        });
        const roscaItem = new RosquinhaData();
        roscaItem.nome = empresa.nome;
        roscaItem.valor = total;
        newRosquinhaData.push(roscaItem);
      });
    }
    newRosquinhaData.sort(this.rosquinhaOptions.compareValues('valor', 'desc'));
    // Agora é hora de limitar em no máximo 10 para nao poluir muito a rosquinha
    this.rosquinhaData = [];
    for (let i = 0 ; i < 9; i++){
      if (newRosquinhaData[i]) {
        this.rosquinhaData.push(newRosquinhaData[i]);
      }
    }
    if (newRosquinhaData.length >= 9) {
      let total = 0;
      for (let i = 8 ; i < newRosquinhaData.length ; i++) {
        total += newRosquinhaData[i].valor;
      }

      const roscaItem = new RosquinhaData();
      roscaItem.valor = total;
      roscaItem.nome = 'Outros';
      this.rosquinhaData.push(roscaItem);
    }
  }

  iniciaChart(): void {
    this.rosquinhaCanvas = document.getElementById('rosquinha');
    this.rosquinhaContext = this.rosquinhaCanvas.getContext('2d');
    this.rosquinhaChart = new Chart(this.rosquinhaContext, this.rosquinhaOptions.RosquinhaOptions);
  }

  atualizaChart(): void {
    this.preparaDados();
    this.rosquinhaOptions.setData(this.rosquinhaData);
    this.rosquinhaChart.update();
  }

  getCategoriaName(categoriaId): string {
    if (categoriaId) {
      return this.categorias.find(categoria => categoria._id === categoriaId).nome;
    } else {
      return 'N/A';
    }
  }

  getEmpresaName(idEmpresa): string {
    return this.empresas.find(empresa => empresa._id === idEmpresa).nome;
  }

}
