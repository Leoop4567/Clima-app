export class Clima {

  constructor(dados, nomeCustomizado = null) {

    this.cidade = nomeCustomizado || dados.name; 
    this.temperatura = Math.round(dados.main.temp);
    this.sensacaoTermica = Math.round(dados.main.feels_like);
    this.descricao = dados.weather[0].description;
    this.icone = dados.weather[0].icon;
    this.umidade = dados.main.humidity;
  }
}