const unidadeResult = [];

unidadeResult[1] = 'um';
unidadeResult[2] = 'dois';
unidadeResult[3] = 'três';
unidadeResult[4] = 'quatro';
unidadeResult[5] = 'cinco';
unidadeResult[6] = 'seis';
unidadeResult[7] = 'sete';
unidadeResult[8] = 'oito';
unidadeResult[9] = 'nove';

const dezenaResult = [];

dezenaResult[1] = 'dez';
dezenaResult[2] = 'vinte';
dezenaResult[3] = 'trinta';
dezenaResult[4] = 'quarenta';
dezenaResult[5] = 'cinquenta';
dezenaResult[6] = 'sessenta';
dezenaResult[7] = 'setenta';
dezenaResult[8] = 'oitenta';
dezenaResult[9] = 'noventa';
dezenaResult[10] = 'dez';
dezenaResult[11] = 'onze';
dezenaResult[12] = 'doze';
dezenaResult[13] = 'treze';
dezenaResult[14] = 'quatorze';
dezenaResult[15] = 'quinze';
dezenaResult[16] = 'dezesseis';
dezenaResult[17] = 'dezessete';
dezenaResult[18] = 'dezoito';
dezenaResult[19] = 'dezenove';

const centenaResult = [];

centenaResult[1] = 'cento';
centenaResult[2] = 'duzentos';
centenaResult[3] = 'trezentos';
centenaResult[4] = 'quatrocentos';
centenaResult[5] = 'quinhentos';
centenaResult[6] = 'seiscentos';
centenaResult[7] = 'setecentos';
centenaResult[8] = 'oitocentos';
centenaResult[9] = 'novecentos';

var dezenaUnidadeEscrita = '';
var acimaMilharEscrita = '';
var abaixoMilharEscrita = '';
var urlNumerica = 0;
var fs = require('fs');

function dezenaEUnidade(numAux){

	if(numAux >= 10 && numAux < 20){ // caso as unidades estejam entre 10 e 19, ele vai retornar entre 'dez' e 'dezenove'

		dezenaUnidadeEscrita = dezenaResult[numAux];

	} else {

		if(numAux % 10 == 0){ // verifica por exemplo se não é apenas vinte -> nesse caso não teria o ' e '
		
			dezenaUnidadeEscrita = dezenaResult[(numAux - numAux % 10) / 10];
		
		} else {

			dezenaUnidadeEscrita = dezenaResult[(numAux - numAux % 10) / 10] + ' e ' + unidadeResult[(numAux % 10)];

		}
	}

	return dezenaUnidadeEscrita;

}



function abaixoMilhar(numAux){

	if((numAux % 1000) >= 100){ // verifica se tem centena

		if((numAux % 100) == 0){ // verifica se não tem nada de 0 a 99

			if((numAux % 1000) == 100){ // verifica se é igual a 100 ou outra centena

				abaixoMilharEscrita = 'cem';

			} else {

				abaixoMilharEscrita = centenaResult[(((numAux % 1000) - (numAux % 100)) / 100)];

			}

		} else {

			if((((numAux % 100) - (numAux % 10)) / 10) > 0){ // verifica se tem dezena

				abaixoMilharEscrita = centenaResult[(((numAux % 1000) - (numAux % 100)) / 100)] + ' e ' + dezenaEUnidade((numAux % 100));

			} else { // caso o numero tenha apenas unidade

				abaixoMilharEscrita = centenaResult[(((numAux % 1000) - (numAux % 100)) / 100)] + ' e ' + unidadeResult[(numAux % 10)];

			}
		}

	} else { // caso não tenha centena

		if((numAux % 100) >= 10){ // possua uma dezena

			abaixoMilharEscrita = dezenaEUnidade((numAux % 100));
		
		} else { // apenas unidade

			abaixoMilharEscrita = unidadeResult[(numAux % 10)];

		}

	}

	return abaixoMilharEscrita;

}



function acimaMilhar(numAux){

	if((((numAux % 100000) - (numAux % 10000)) / 10000 ) > 0){ // para numeros acima de 10 mil e 99 mil

		acimaMilharEscrita = dezenaEUnidade((((numAux % 100000) - (numAux % 1000)) / 1000)) + ' mil';

		if((numAux % 1000) > 0){

			acimaMilharEscrita = acimaMilharEscrita + ' e '; // verifica se tem mais além dos milhares, e coloca o 'e'

		}

	} else {

		if((((numAux % 10000) - (numAux % 1000)) / 1000) >= 1){ // para numeros entre 1 mil e 9 mil

			if((((numAux % 10000) - (numAux % 1000)) / 1000) == 1){

				acimaMilharEscrita = 'mil'; // se for apenas mil

			} else {

				acimaMilharEscrita = unidadeResult[(((numAux % 10000) - (numAux % 1000)) / 1000)] + ' mil'; // o numero e depois escrito mil

			}

			if((numAux % 1000) > 0){

				acimaMilharEscrita = acimaMilharEscrita + ' e '; // verifica se tem mais além dos milhares, e coloca o 'e'

			}
		}
	}

	return acimaMilharEscrita;

}



const http = require('http');

const servidor = http.createServer((req, res) => {

	var escritaFinal = '';

	if(req.url != '/favicon.ico'){

		urlNumerica = parseInt(req.url.replace(/^./, ""));

		if(urlNumerica == 0){ // verificar se é zero -> para não escrever menos zero

			escritaFinal = 'zero';

		} else {

			if(urlNumerica < 0){ // escrever o número negativo caso ele seja

				urlNumerica = parseInt(urlNumerica.toString().replace(/^./, ""));

				escritaFinal = 'menos ' + acimaMilhar(urlNumerica) + abaixoMilhar(urlNumerica);

			} else {

				escritaFinal = acimaMilhar(urlNumerica) + abaixoMilhar(urlNumerica);

			}
		}

		if(escritaFinal != 'undefined'){

			res.end('<h1><br>' + escritaFinal + '</h1>'); // isso será escrito na página
		
			fs.appendFile("numeracoes.json", '{ "extenso": "' + escritaFinal + '" }', (err) => { // para salvar no arquivo
				
				if(err){
					throw err;
				}
			
			});

		} else {

			res.end('<h1><br>Escolha um numero e coloque apos ":3000/"</h1>');

		}

	}

});

servidor.listen(3000, 'localhost', () => {
	console.log('Pra fechar o programa/servidor: crtl + c');
})