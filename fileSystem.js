const fs = require('fs')
const { promises: fsPromises } = require('fs')


/* Para melhor uso desse arquivo, comente e descomente as funções que deseja utilizar */

/* A biblioteca File System é relativamente simples, o principal problema que podemos ter quando usamos elas são as promises e tipos de dados.
 * Por isso, vou fazer um briefing delas.Rode o comando  'node fileSystem.js' no terminal para entender melhor e brincar 
 * com o código.
 * 
 * Javascript é uma linguagem síncrona, porém, muitas vezes queremos esperar algo ser feito para então continuar a execução do código,como
 * requisições ao banco de dados por exemplo. Isso são promises. A biblioteca FS trabalha sobre esse princípio. 
 * 
 * A biblioteca FS tem três principais forma de se lidar, as quais vou explicar aqui.
 */


/* PROMISES
 * Uma promise é uma função que recebe como parâmetro outra função com dois parâmetros, resolve e reject. A idéia é simples, 
 * se deu tudo certo a função retorna o que estiver dentro do resolve, podendo ser qualquer coisa. Se der errado é lançada 
 * uma exceção dentro do sistema, e assim, você pode pegar dentro de um trycatch, ou .catch(). 
 */

 /* Estou criando apenas duas promises que esperam dois segundos(por meio da função setTimeout) para resolver ou rejeitar */ 

const resolvedPromise = () => new Promise(resolve => setTimeout(() => { resolve({response: 'resolved'})}, 2000)) // Promessa resolvida
const rejectedPromise = () => new Promise((resolve, reject) => setTimeout(() => {reject({response: 'rejected'})}, 2000)) // Promessa rejeitada


const promises = () => {
  /* Eu vou mostrar as duas maneiras de se lidar com promises, a primeira é a old School, a forma como o JS funcionava antes do ES6
   * Isso por que a biblioteca FS ainda usa as promises dessa maneira dependendo de como você utilizar, e de qual comando usar.
   * Como as funções que eu criei previamente são promises, podemos usar os métodos que são nativos da linguagem.
   *
   * Na forma tradicional, usamos o .then() ao final da chamada da promessa para esperar ela resolver, o objeto recebido é o que 
   * está dentro do res() da promise original. Como no nosso caso ela apenas espera dois segundos e retorna um objeto, este objeto deve 
   * aparecer no console
   */ 

    resolvedPromise().then(response => console.log(response))

  /* Já para receber um erro, colocamos o método .catch() ao final da promise, e assim o objeto recebido será o erro que foi
   * cuspido pela promise
   */
    rejectedPromise().catch(err => console.log(err))

  /* Quando promises entram em jogo com callbacks, temos o cerne da biblioteca filesystem. 
   *
   * CALLBACKS
   * 
   * Uma função de callback nada mais é que uma função que é executada após algo ser feito, no nosso caso, quando a promise é finalizada. 
   * Isso funciona por conta da forma como declaramos funções em js. Se temos uma função "_func", e eu declado "_func", não estou
   * executando a função, estou apenas declarando o escopo dela. Agora se eu chamo "_func()" significa que eu quero o objeto de retono
   * dessa função, e, por consequência, eu executo a função chamada. Uma função de callback funciona assim, eu recebo um parâmetro "callback"
   * que é apenas a "formula" da função, e depois chamo callback() para executá-la.
   * 
   * Na prática:
   */
   /* Segundo parâmetro = "fórmula" da callback" */
    const callbackPromise = (someArg, callback) => new Promise(resolve => 
      setTimeout(
        () => { 
          /* A função resolve é chamada e dentro dela está a execução da callback */
          resolve(
            /* Posso passar quaisquer parãmetros que quiser */
            callback({first: 'Eu sou um argumento dentro do retorno da callback da promise'})
            /* Dessa maneira, quando resolve é chamada, callback é executada.*/
          )
      }, 2000)
    )
   /* 
    * Nessa promise, recebemos como parâmetro argumento qualquer e uma função, e quando a promise é resolvida, a função passada pelos parâmetros é executada,
    *  
    * Isso é essencialmente, a forma como a lib FS funciona. 
    * Agora vamos olhar a chamada a função: 
    */
    const teste = 'Igor Amoras :)'
    /*Segundo argumento é uma função que vai ser executada */ 
    callbackPromise(teste, (firstArg) => console.log(
      'Primeiro argumento retorado pela função de callback:\n', firstArg
    ))
    /*
     * Percebam, na chamada da função, eu passo como argumento uma string e outra função, um arrow function anônima, () => {}, que recebe um parâmetro
     * o wual, é passado dentro da resposta da callback da promise, vide linha 64, sendo assim um objeto.
     * 
     * Apenas para frisar novamente e realinhar a idéias. Você tem uma função X, que recebe os parâmetro param. Essa função é passada
     * para a promise, como uma "fórmula"(sem os "()"), e quando a promise é terminada ela executa essa função e passa o parãmetro param para ela.
     * 
     * A biblioteca FS roda nessa exata mesma lógica, é uma promise, que tem como argumento uma função de callback, onde o argumento que ela retorna
     * é essencialmente o que você quer daquele arquivo ou o que quer que seja. 
     */ 

}

/* Entendendo o supracitado, a lib fica bem simples. Lembrem, a estrutura é da lib geralmente é: fs.someFunction(...args, promiseCallback)
*/ 

const callbackFileSystem = async () => {
  /* Vou passar pelas principais funções e assim, recomendo que dêem uma olhada na documentação pois a mesma é bem completa. E bem melhor
   * do que tudo que posso escrever aqui */ 

  /* CRIANDO ARQUIVOS E ESCREVENDO NELES */

  /* Existem diferentes manieras de se criar um arquivo com FS, mas vou usar uma que me acostumei  */ 
    fs.writeFile(`Umarquivo!.txt`, '', (err) => {
      if(err) throw err
      console.log('O arquivo foi criando quando a callback for chamada')
    })

  /* A função writeFile, como o nome sugere, escreve em um arquivo, porém se o arquivo não existe ele é, então, criado.
   * Essa função recebe trẽs parâmetros, o primeiro é o nome do arquivo, ou rota para sua criação. (recomendo utilizar a lib Path, mas não entrarei nesse critério)
   * no exemplo acima eu crio um arquivo com o nome 'Umarquivo!.txt'. O segundo argumento é uma string vazia, '', isso por que queremos
   * apenas criar um arquivo vazio, além disso o segundo agumento são os dados que serão criados junto dentro arquivo. Pode ser inserido nesse parãmetro uma string, um buffer, Typed Array 
   * ou DataView, esses são os tipos de dado aceitos. O terceiro arumento é a função de callback, que retorna após o arquivo ter sido criado, e recebe como parâmetro um erro(caso exista)
   * 
   * Ponto importante: A lib só consegue escrever dentro de aquivos os tipos de dados citados anteriormente, isso é, strings, buffers, dataview ou typedArrays
   * Então, se quisermos escrever um objeto dentro do arquivo, por exemplo, precisamos fazer um stringigy nele, JSON.stringify(object).
   * 
   * Outro ponto importante: A função writeFIle deleta o conteúdo que existe no arquivo antes de escrevẽ-lo(caso o arquivo já exista)
   * 
   * -- TÓPICO IMPORTANTE -- 
   * 
   * Algo que me gerou muitos erros foi não saber lidar com as funções de callbacks dentro da lib. No exemplo acima temos um exemplo clássico. Vamos supor o seguinte,
   * Você quer criar um arquivo, e logo em sequencia escrever algo dentro dele. Algo como:
   */

  await fs.writeFile('Um arquivo!.txt', '', (err) => {if(err) throw err})
  const textFromDatabase = 'Algum dado que venha do banco de dados'
  fs.appendFile('UmArquivo!.txt', textFromDatabase, (err) => {if(err) throw err})

  /* Isso não vai dar certo. Isso por que o arquivo é criado apenas quando a função de callback é retornada. A forma correta de usar essa função seria: */

  fs.writeFile('src/Umarquivo!.txt', 'ESCREVI ALGO', (err) => {
    if(err) throw err
    const textFromDatabase = 'Algum dado que venha do banco de dados'
    fs.writeFile('Umarquivo!.txt', textFromDatabase, (err) => {if(err) throw err})
  })

  /* Na forma errada, o arquivo pode não ter sido criado quando a função appendFile é chamada, e assim, geraria um erro. O correto é manipular o arquivo
   * dentro da callback da função. 
   * 
   * A função que eu chamei na linha 136 faz a mesma coisa que a função writeFile, porém, ao inves de sobreescrever os dados existentem no arquivo
   * ela apenas coloca os dados ao final dele. Ele concatena as strings, por assim dizer. 
   */ 

  /* MANIPULANDO DIRETÓRIOS */
   
  /* Para criar diretórios não existem muitos mistérios também */ 

  fs.mkdir('src/MeuDiretório', 0777 & (~process.umask()), (err) => {
    if(err) throw err
    /* diiretório criado */
  })

  /* Basicamente, você chama a função fs.mkdir. Onde o primeiro argumento é onde o diretório será alocado assim como nas funções supracitadas. O segundo argumento
   * por sua vez são as permissões do diretório e não é necessário especificá-lo, por padrão é "0777 & (~process.umask())", eu o coloquei ali para vocẽ saber que pode 
   * alterar os privilégios do diretório caso isso faça sentido para vocẽ.
   * 
   * Não vou entrar muito nesse mérito, mas a idéia vem de Read, Write and Execute. Onde o primeiro sete valida as permissões de leitura, o seugndo de escrita e o terceiro
   * de execução do diretório, o "(~process.umask())" é um pouco mais delicado e não cabe nesse momento. Caso queiram entender melhor: https://x-team.com/blog/file-system-permissions-umask-node-js/
   * Caso você tenha alguma requisição específica com permissões de diretórios basta perquisar "Directory permissions node", para entender mais sobre,
   */

  /* Para apagar um diretório */ 

   fs.rmdir('src/src2', { recursive: true }, (err) => { if (err) throw err; });

  /* A função rmdir deleta um diretório, o primeiro argumento é o caminho. O segundo argumento,  { recursive: true }, serve para evitar erros, pois, se o diretório 
   * já existir e tiver outros arquivos dentro é lançado uma exceção no sistema que diz que o diretório já existe e não é vazio, 
   * esse argumento faz com que a função seja chamada recursivamente, assim deletando todos os conteúdos do diretório. Caso você não 
   * queria deletar o diretório caso existam arquivos dentro, basta não colocar esse argumento. 
   */

  /* Limpando arquivos. Lendo os conteúdos de um diretório e entendendo arquivos */

   fs.truncate('Umarquivo!.txt', 100, (err) => {if(err) throw err})

 /* A função truncate altera o tamanho de um arquivo, e às vezes você pode querer diminuir ou aumentarr o tamanho dele. O segundo 
  * argumento nesse caso, é o tamanho desejado. No nosso caso é 0, ou seja, arquivo é limpo. Caso esse tamanho seja maior
  * que o próprio tamanho do arquivo, então ele é preenchido com bytes nulos(0x00) até atingir o tamanho
  * 
  * Exemplo de uso com mais funções interessantes: 
  */

 const cleanDirectory = (pathToDir) => 
   fs.readdir(pathToDir, (err, files) => { 
     if(err) throw err
      files.forEach(file => {
        const pathToFile = `${pathToDir}/${file}`
        fs.statSync(pathToFile).isFile() ? 
        fs.truncate(pathToFile, 0, (err) => {if(err) throw err}) : 
        cleanDirectory(pathToFile)
        })
    })
    
  fs.mkdir('src', (err) => {if(err) cleanDirectory('src')})

    /* Entendendo e explicando um pouco do que está acontecendo. Eu criei uma função que chama cleanDirectory, a idéia é que ela apague os dados de dentro dos files 
     * dentro de um folder, e dos folderes que existirem dentro dela. Ela recebe como parẫmetro o caminho para o diretório a ser limpado. Em sequência, 
     * a função fs.readdir lê todos os arquivos que constam dentro de um diretório, e retorna um array de strings com o nome do que foi encontrado no diretório.
     * (O nome dos folderes e files que forem constados dentro desse diretório)
     * Com esse array, fazemos um forEach para iterar pelos arquivos. A primeira coisa que eu faço é descobrir se aquele caminho encontrado é referente à um 
     * arquivo ou á um diretório. A função fs.statSync faz isso. A ideia dessa função é retornar stats, estatísticas, sobre o arquivo especificado no caminho que lhe foi
     * passado. No nosso caso queremos saber se aquele caminho é um file, para podermos limpá-lo, e para isso, usamos o .isFile() ao final. Também podemos usar .isDirectory(),
     * dentre outras coisas, como descobrir quando o arquivo foi criado e mais. Para detalhes recomendo: https://nodejs.dev/learn/nodejs-file-stats. Sabendo se o arquivo é
     * um file, podemos limpá-lo com a função truncate, e caso esse não seja eu considerei que o mesmo é um diretório, e assim, chamo a função cleanDirectory para limpar
     * esse novo diretório com um novo path, recursivamente.
     * 
     * Assim, caso a função mkdir dê um erro, garantiremos que dentro dos arquivos dentro dela não existirá lixo. 
     */


    /*  LEITURA DE ARQUIVOS */
    
    /* A leitura de arquivos segue a mesma lógica de todas as outras funções, porém existem algumas coisas que valem a pena serem faladas.
     * A primeira coisa e mais importante quando estamos lendo arquivos em FS, é entender os "tipos" de dados em JS. Por padrão, a biblioteca
     * fará a leitura dos conteúdos como se fossem um Buffer. Um Buffer nada mais é que uma sequencia de dados hexadecimais, então o log, no console
     * será "<Buffer aa bb 21 c5 ...>", onde cada número é um valor que vai de 0 a F, hexadecimal. Isso é importante por que muitas vezes podemos receber erros
     * referentes á isso. No seguinte exemplo, vou ler um arquivo com a string "teste", e fazer um log do mesmo 
     */
    fs.readFile('Umarquivo!.txt', (err, data) => {
      if(err) throw err
      console.log(data) // <Buffer 74 65 73 74 65>
    })
    /* O valor na frente do console é referente ao log do console. A ideia é que o fs leu, char por char, em hexadecimal. Agora, vamos supor que você
     * queira mudar isso. Existem diferentes tipo de codificação aceitos pelo readFile, e eles entram como segundo argumento nessa brincadeira. O tipo
     * mais comum para strings e dados que nós manipulamos é utf-8. UTF-8 é a abreviação Universal Coded Character Set - Transformation Format – 8-bit.
     * De forma resumida, é uma maneira padronizada do computador entender uma sequencia de caracteres representados em 8 bits. Se eu inserir o argumento
     * UTF8 como parãmetro, então o valor que consta nesse arquivo será "teste", pois ele lerá como se fosse uma string tradicional da forma como estamos
     * acostumados a lidar.
     */
    fs.readFile('Umarquivo!.txt', 'utf8', (err, data) => {
      if(err) throw err
      console.log(data) // teste
    })
    /* No exemplo de cima eu coloquei o encoding como sendo 'utf-8' então o dado será lido como sendo a string salva no arquivo. Existem diferentes
     * tipos de encoding, como por exemplo base64, hex, binary. Para dados de imagem é comum usar base64, binary para representação de bits e por ai vai.
     * O tipo de dado 'hex' retorna uma string com os valores hexadeciamsi, então no primeiro exemplo ao inves de recebermos <Buffer 74 65 73 74 65>, por padrão,
     * um objeto, receberiamos 7465737465, uma string.
     *  
     * Um ponto importante é que na hora de salvar dados em uma arquivo isso é feito implicitamente, isso é, se você passar para o arquivo um string, ele 
     * será salvo como uma string, se você passar um Buffer, ele salvará o buffer. 
     */

    /* Renomeando arquivos e movendo arquivos*/ 

    /* Podemos alterar o nome, tanto de arquivos, quanto de diretórios, e a ideia é a mesma de todas as funções anteriores. */
    fs.rename('Umarquivo!.txt', 'src/Outroarquivo!.txt', (err) => {
      if(err) throw err
    })
    /* Na função acima, o primeiro argumento é o caminho para o arquivo/diretório antigo e o segundo é o novo nome, podemos passar também um novo caminho
     * e assim, movê-los de lugar.  
     */

    /* Monitorando arquivos em fs com watch */

    /* A biblioca nos permite monitorar se arquivos foram alterados, apagados ou se ocorreu um erro neles.
     * A ideia é que seja adicionado um event listener em um arquivo para monitorar alterações feitas nele. */
    
    const watcher = fs.watch('src', 'utf-8')
    watcher.on('change', (event, fileName) => {
      console.log(`O arquivo ${fileName} sofreu um evento: ${event}`)
    })
    /* A const watch é um FSWatcher que monitora alterações feitas em nos arquivos de um diretório, assim, podemos usar como um event listener
     * watcher.on(eventName, nome do arquivo) o watcher pode monitorar por mudanças com 'change', mudanças de nome com 'rename' ou erros com 'error'
     */

    /* Copiando arquivos e diretórios */

    fs.copyFile('Novoarquivo.txt', 'src/aaa.txt', (err) => {
      if(err) throw err
      console.log('o arquivo foi copiado para "src/aaa.txt"')
    })
    /* A ideia segue a de todos as funções citadas, recebemos dois paths e a função de callback. Um ponto importante é que, se o caminho
     * para onde o arquivo está sendo copiado já exista, os dados nele serão sobreescritos, por isso podemos usar a função acess que retorna 
     * se o arquivo em questão existe ou não 
     */

    fs.access('src/aaa.txt', (err) => {
      if(!err) {console.log('O arquivo existe'); return}
      fs.copyFile('Novoarquivo.txt', 'src/aaa.txt', (err) => {
        if(err) throw err
        console.log('o arquivo foi copiado para "src/aaa.txt"')
      })
    })

    /* A função acess retorna erro "null" caso o arquivo exista, então o que podemos fazer é retornar da função caso o mesmo não exista, pois
     * assim, evitamos a sobreescrita de arquivos.
     */

    /* Deletando arquivos */
    /* A função de deletar arquivos é chamada unlink, a forma de funcionamento segue a de todos os outros do sistema,*/
    fs.unlink('Novoarquivo.txt', (err)=> {if(err) throw err})
}

/* Outras maneiras de se lidar com a biblioteca FS. 
 * 
 *
 * A lib fs nós permite não trabalhar com callbacks, mas com async await e de forma síncrona. Eu expliquei da maneira supracitada pois foi como
 * aprendi e por que cada caso tem seu uso. A grande diferença é apenas como a funções são chamadas e trabalhadas, o conceito base permanece o mesmo
 * 
 * Vamos às promises. 
 * No inicio do arquivo é importei promises da lib fs, vide linha 2. Vàmos ao seu uso
 */

const asyncAwaitFileSystem = async () => {
  try {
    const dataRead = await fsPromises.mkdir('src/aaa.txt')
    console.log(dataRead)    
  } catch (error) {
    console.log(error)
  }
  /* No exemplo acima mostro como isso funciona. Ao invés de passar uma função de callback com os arquivos lidos, peço para fazer um await na leitura
   * e então, os dados lidos do arquivo 'aaa.txt' serão repassados para dataRead. Quando utilizamos essa forma, precisamos envolver o trecho de codigo
   * em um trycatch para podemos pegar as exceções lançadas.
   * 
   * Esse exemplo vale para, basicamente, todos os exemplos, as funções serão as mesmas, porém ao inves de usar a callback, usamos um await e um trycath
   * todas as lógicas citadas se propagam para seu uso
   */

}

/* Além disso, podemos utilizar também, a forma sincrona*/

const syncFileSystem = () => {

  try {
    const dataRead = fs.readFileSync('Umarquivo!.txt', 'utf-8')
    console.log(dataRead)
  } catch (error) {
    console.log(error)
  }
  
  /* Para funções sincronas, temos que usar o sync, ao final da chamada da função, então, como queremos ler o arquivo, usamos readFileSync
   * Nem todas as funções tem sua forma síncrona, e, como eu disse, cada caso é um caso, o mais comum é utilizar essa maneira, mas podemos fazer
   * das trẽ formas. 
   *  => Callback promise
   *  => Async await
   *  => Sync
   */
}


promises()
callbackFileSystem()
asyncAwaitFileSystem()
syncFileSystem()