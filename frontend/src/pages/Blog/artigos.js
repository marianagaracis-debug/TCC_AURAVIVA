export const criarSlugArtigo = (titulo) =>
  titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const artigos = [
  {
    categoria: "Conceitos Básicos",
    titulo: "O que são sementes transgênicas? Entenda de forma simples",
    subtitulo: "Descubra o que são sementes transgênicas, como a modificação genética está relacionada às plantas e por que essa tecnologia é utilizada na agricultura.",
    conteudo: [
      {
        titulo: "Introdução",
        texto: "As sementes transgênicas fazem parte de uma das áreas mais conhecidas da biotecnologia aplicada à agricultura. Elas são associadas ao desenvolvimento de plantas que receberam uma alteração específica em seu material genético com o objetivo de apresentar determinada característica. O termo transgênico está relacionado aos organismos geneticamente modificados (OGMs), nos quais o material genético foi alterado utilizando técnicas de engenharia genética. Essas técnicas permitem trabalhar com genes e características de interesse de maneira direcionada.",
      },
      {
        titulo: "O que significa “transgênico”?",
        texto: "O DNA contém as informações genéticas que participam da determinação das características dos organismos. Na engenharia genética, pesquisadores podem introduzir ou modificar determinadas sequências de DNA para obter uma característica desejada. Uma planta transgênica, portanto, não é simplesmente uma planta “diferente”. Ela possui uma alteração genética específica que foi desenvolvida para produzir determinada característica. Entre as características estudadas e utilizadas em plantas geneticamente modificadas estão resistência a determinados insetos, tolerância a determinados herbicidas e resistência a algumas doenças. Também existem pesquisas envolvendo características nutricionais e tolerância a condições ambientais.",
      },
      {
        titulo: "Por que criar sementes transgênicas?",
        texto: "O desenvolvimento de plantas geneticamente modificadas está relacionado à busca por características que possam apresentar utilidade agrícola, industrial ou nutricional. Entre os objetivos estão:",
        itens: [
          "Proteção contra determinadas pragas",
          "Tolerância a determinados herbicidas",
          "Resistência a algumas doenças",
          "Alterações em características nutricionais",
          "Pesquisas relacionadas à tolerância a condições ambientais",
        ],
      },
      {
        texto: "A aplicação depende da cultura, da característica introduzida e das condições em que a planta será utilizada.",
      },
      {
        titulo: "Transgênicos são iguais em todos os casos?",
        texto: "Não. Uma característica importante é que cada organismo geneticamente modificado precisa ser considerado individualmente. Diferentes plantas podem receber diferentes modificações e apresentar características distintas. Por isso, não é cientificamente adequado tratar todos os organismos transgênicos como se fossem um único produto. A avaliação deve considerar a planta, a modificação realizada e sua finalidade.",
      },
      {
        titulo: "Conclusão",
        texto: "As sementes transgênicas são resultado da aplicação da engenharia genética à agricultura. Seu desenvolvimento busca introduzir características específicas nas plantas e representa uma das ferramentas utilizadas pela biotecnologia vegetal.",
      },
    ],
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhbXdgMR0hFQMvmEmEtKlt7WxaLWuje-KyfbcvPS2x8w&s=10",
  },
  {
    categoria: "Conceitos Básicos",
    titulo: "Transgênico, OGM e engenharia genética: Qual é a diferença?",
    subtitulo: "Entenda o significado de OGM, transgênico e engenharia genética e descubra como esses conceitos se relacionam à biotecnologia vegetal",
    conteudo: [
      {
        titulo: "O que é um OGM?",
        texto: "OGM significa Organismo Geneticamente Modificado. É um organismo cujo material genético foi alterado por técnicas de engenharia genética. O termo pode ser aplicado a diferentes tipos de organismos, incluindo plantas, animais e microrganismos.",
      },
      {
        titulo: "O que é transgênico?",
        texto: "“Transgênico” é um termo utilizado para determinados organismos geneticamente modificados nos quais houve a introdução de material genético por técnicas de engenharia genética. No uso cotidiano, os termos OGM e transgênico muitas vezes aparecem como sinônimos. Em um conteúdo educativo, é importante explicar que OGM é um conceito mais amplo, enquanto transgenia se refere a uma forma específica de modificação genética.",
      },
      {
        titulo: "E a engenharia genética?",
        texto: "A engenharia genética é o conjunto de técnicas utilizadas para trabalhar diretamente com o material genético. Ela permite, por exemplo, identificar genes de interesse e introduzir determinadas sequências de DNA em um organismo para estudar ou obter uma característica específica. A biotecnologia moderna pode ser utilizada para desenvolver características de maneira direcionada.",
      },
      {
        titulo: "Edição genética é a mesma coisa?",
        texto: "Não necessariamente. A edição genética é um conjunto de técnicas moleculares utilizadas para realizar alterações direcionadas no genoma. Uma das tecnologias mais conhecidas é o CRISPR-Cas. Não se deve colocar automaticamente toda edição genética na mesma categoria de transgenia: as técnicas e os produtos resultantes podem ser diferentes e estar sujeitos a discussões regulatórias específicas.",
      },
      {
        titulo: "Resumindo",
        itens: [
          "OGM: organismo geneticamente modificado.",
          "Transgênico: organismo produzido por uma forma específica de modificação genética.",
          "Engenharia genética: conjunto de técnicas utilizadas para modificar ou manipular material genético.",
          "Edição genética: conjunto de técnicas capazes de realizar alterações direcionadas no genoma.",
        ],
      },
    ],
    imagem: "https://profissaobiotec.com.br/wp-content/uploads/2020/02/BIOTEC.jpg",
  },
  {
    categoria: "Conceitos Básicos",
    titulo: "Sementes Convencionais, híbridas e transgênicas: Entenda as diferenças",
    subtitulo: "Conheça as diferenças entre sementes convencionais, híbridas e transgênicas e entenda como cada uma está relacionada ao melhoramento das plantas.",
    conteudo: [
      {
        titulo: "Sementes convencionais",
        texto: "O melhoramento convencional utiliza métodos tradicionais de cruzamento e seleção para combinar características desejáveis presentes em diferentes plantas. Ao longo de gerações, pesquisadores selecionam indivíduos que apresentam características de interesse.",
      },
      {
        titulo: "Sementes híbridas",
        texto: "As sementes híbridas são produzidas a partir do cruzamento planejado entre linhagens ou variedades parentais. O objetivo é combinar determinadas características dos parentais. Em muitos casos, os híbridos podem apresentar características agronômicas desejáveis, como maior uniformidade ou desempenho.",
      },
      {
        titulo: "Sementes transgênicas",
        texto: "As sementes transgênicas estão relacionadas à modificação genética realizada por técnicas de engenharia genética. Nesse caso, o objetivo é introduzir ou alterar uma característica específica por meio de uma modificação no material genético.",
      },
      {
        titulo: "Uma não significa necessariamente “melhor” que a outra",
        texto: "É importante entender que convencional, híbrida e transgênica não são simplesmente níveis de qualidade. São conceitos diferentes relacionados ao modo como uma variedade ou característica foi obtida. Além disso, uma planta pode envolver diferentes estratégias de melhoramento. A transgenia é uma das ferramentas disponíveis dentro de um conjunto maior de tecnologias utilizadas na agricultura. O melhoramento vegetal possui uma longa história de seleção e cruzamentos, enquanto a biotecnologia moderna acrescentou novas ferramentas para obtenção de características específicas.",
      },
    ],
    imagem: "https://blog.jacto.com.br/wp-content/uploads/2022/08/sementes-transgenicas.jpeg",
  },
  {
    categoria: "Como são produzidas",
    titulo: "Como é criada uma planta transgênica?",
    subtitulo: "Conheça as etapas básicas da criação de uma planta transgênica e descubra como a engenharia genética pode introduzir características específicas.",
    conteudo: [
      {
        titulo: "1. Identificação da característica desejada",
        texto: "O primeiro passo é definir qual característica se deseja estudar ou obter. Pode ser, por exemplo, uma característica relacionada à resistência a determinados insetos, à tolerância a determinado herbicida ou a algum aspecto nutricional.",
      },
      {
        titulo: "2. Identificação do gene ou mecanismo relacionado",
        texto: "Os pesquisadores procuram compreender quais genes ou mecanismos biológicos estão relacionados à característica de interesse. A partir dessas informações, podem ser planejadas estratégias de engenharia genética.",
      },
      {
        titulo: "3. Introdução do material genético",
        texto: "Uma sequência de DNA pode ser introduzida em células vegetais utilizando técnicas apropriadas. A tecnologia de DNA recombinante é uma das ferramentas utilizadas para alterar material genético e obter características desejadas.",
      },
      {
        titulo: "4. Seleção das células modificadas",
        texto: "Após a introdução do material genético, é necessário identificar as células que apresentam a alteração desejada. Essas células podem ser utilizadas em processos de regeneração vegetal.",
      },
      {
        titulo: "5. Regeneração da planta",
        texto: "A partir de células vegetais adequadas, técnicas de cultura de tecidos podem permitir a regeneração de uma planta inteira. Essa etapa é importante porque a planta resultante precisa manter a característica genética introduzida.",
      },
      {
        titulo: "6. Testes e avaliação",
        texto: "A planta passa por diferentes análises para verificar sua característica, estabilidade e segurança. Dependendo da finalidade e da legislação aplicável, são avaliados aspectos relacionados à saúde, ao ambiente e ao desempenho da planta.",
      },
      {
        texto: "Portanto, uma planta transgênica não surge simplesmente pela “colocação de um gene”. Existe um processo de pesquisa, desenvolvimento, seleção e avaliação.",
      },
    ],
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX2PUxrrbVif5k7bDNGsrffqD3yZzjf6IsQcwcMkcykw&s=10",
  },
  {
    categoria: "Como são produzidas",
    titulo: "Do laboratório ao campo: O caminho de uma semente transgênica",
    subtitulo: "Acompanhe as principais etapas de pesquisa, desenvolvimento, avaliação e autorização envolvidas na utilização de plantas geneticamente modificadas.",
    conteudo: [
      {
        texto: "O desenvolvimento de uma planta geneticamente modificada envolve várias etapas.",
      },
      {
        titulo: "1. Pesquisa",
        texto: "Os pesquisadores estudam uma característica de interesse e procuram compreender sua base genética.",
      },
      {
        titulo: "2. Desenvolvimento",
        texto: "São utilizadas técnicas de engenharia genética e biotecnologia para desenvolver plantas que apresentem a característica desejada.",
      },
      {
        titulo: "3. Seleção",
        texto: "As plantas são avaliadas para identificar aquelas que apresentam o comportamento esperado.",
      },
      {
        titulo: "4. Avaliação",
        texto: "São realizados estudos para avaliar características agronômicas, estabilidade genética, segurança e possíveis efeitos não intencionais. A avaliação de segurança de alimentos geneticamente modificados pode considerar toxicidade, potencial alergênico, características nutricionais, estabilidade do gene introduzido e efeitos não intencionais.",
      },
      {
        titulo: "5. Ensaios",
        texto: "Dependendo da legislação e da finalidade, podem ser realizados estudos em condições controladas e, posteriormente, avaliações em campo.",
      },
      {
        titulo: "6. Avaliação regulatória",
        texto: "No Brasil, atividades envolvendo OGMs estão sujeitas ao sistema de biossegurança previsto na legislação e à atuação dos órgãos competentes, incluindo a CTNBio.",
      },
      {
        titulo: "7. Utilização",
        texto: "Somente após o cumprimento dos requisitos aplicáveis é que determinada variedade ou produto pode chegar à utilização comercial.",
      },
      {
        texto: "Esse processo demonstra que uma semente comercial não é simplesmente resultado de uma alteração genética feita em laboratório. Existe uma cadeia de pesquisa, testes e avaliações.",
      },
    ],
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZo3G5ghSPe818ZaG4fP6AG8f893emYYhBdWWbQhE9ITcRSRxiRyzHT90&s=10",
  },
  {
    categoria: "Tipos e aplicações",
    titulo: "Quais culturas possuem variedades transgênicas?",
    subtitulo: "Conheça culturas agrícolas que possuem variedades geneticamente modificadas, como soja, milho e algodão, e entenda suas diferentes aplicações.",
    conteudo: [
      {
        texto: "A utilização de biotecnologia na agricultura ocorre em diferentes culturas. Entre as culturas que possuem variedades geneticamente modificadas em diferentes países estão:",
        itens: ["Soja", "Milho", "Algodão", "Canola", "Entre outras"],
      },
      {
        texto: "A presença e a autorização de uma variedade geneticamente modificada dependem da legislação de cada país. No Brasil, por exemplo, a utilização de determinado OGM depende das avaliações e autorizações previstas no sistema regulatório.",
      },
      {
        titulo: "Características diferentes",
        texto: "As variedades transgênicas não possuem todas a mesma característica. Algumas foram desenvolvidas para resistência a determinados insetos, outras para tolerância a determinados herbicidas e outras podem apresentar diferentes características. Culturas GM comercializadas internacionalmente foram desenvolvidas principalmente para resistência a insetos, resistência a vírus e tolerância a determinados herbicidas. Também existem pesquisas envolvendo culturas como café, algodão, cana-de-açúcar e alface com características específicas.",
      },
      {
        titulo: "A situação varia de país para país",
        texto: "Uma variedade autorizada em um país não necessariamente possui autorização para cultivo ou consumo em outro. Por isso, quando se fala em “culturas transgênicas”, é importante considerar qual país e qual variedade estão sendo analisados.",
      },
    ],
    imagem: "https://sucroenergetico.revistaopinioes.com.br/media/upload/ckeditor/2014/07/07/Sabrina%20Moutinho%20Chabregas%20-%20Ilust%201.jpg",
  },
  {
    categoria: "Tipos e aplicações",
    titulo: "Por que existem plantas transgênicas?",
    subtitulo: "Descubra quais características os pesquisadores buscam desenvolver nas plantas e como elas podem ser aplicadas à agricultura.",
    conteudo: [
      {
        texto: "A principal razão para desenvolver uma planta transgênica é buscar uma característica específica.",
      },
      {
        titulo: "Proteção contra insetos",
        texto: "Algumas plantas foram desenvolvidas para produzir proteínas que atuam contra determinados insetos-praga. Um exemplo são as plantas Bt.",
      },
      {
        titulo: "Tolerância a herbicidas",
        texto: "Algumas variedades foram desenvolvidas para tolerar determinados herbicidas, permitindo estratégias específicas de manejo de plantas daninhas.",
      },
      {
        titulo: "Resistência a doenças",
        texto: "Também existem plantas desenvolvidas para apresentar resistência ou tolerância a determinadas doenças.",
      },
      {
        titulo: "Características nutricionais",
        texto: "A engenharia genética também pode ser utilizada para pesquisar alterações relacionadas à composição nutricional. Há pesquisas envolvendo plantas com alterações nutricionais, incluindo uma alface com maior quantidade de ácido fólico.",
      },
      {
        titulo: "Tolerância a condições ambientais",
        texto: "A biotecnologia também vem sendo estudada para características relacionadas a condições ambientais, como seca e inundação. A aplicação e o resultado dependem de cada cultura e tecnologia.",
      },
    ],
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRUrX5CvopAabS-rzgx7WCO2DeWo5xh7qVPgHj01KobmjmzWvWS3zJexk&s=10",
  },
  {
    categoria: "Tipos e aplicações",
    titulo: "Plantas Bt: como funciona essa tecnologia?",
    subtitulo: "Entenda o que significa Bt, como essa tecnologia atua contra determinados insetos-praga e por que seu uso exige manejo adequado.",
    conteudo: [
      {
        titulo: "O que significa Bt?",
        texto: "Bt vem de Bacillus thuringiensis, uma bactéria conhecida por produzir proteínas que apresentam atividade contra determinados grupos de insetos. Na agricultura convencional, produtos baseados em Bt podem ser utilizados como inseticidas biológicos.",
      },
      {
        titulo: "Como funciona uma planta Bt?",
        texto: "Em determinadas plantas geneticamente modificadas, um gene relacionado à produção de uma proteína Bt é introduzido na planta, que passa a produzir essa proteína. Quando um inseto-alvo se alimenta da planta, a proteína pode atuar sobre ele, dependendo da espécie e das condições biológicas envolvidas. Plantas Bt receberam genes relacionados à produção de proteínas da bactéria Bacillus thuringiensis.",
      },
      {
        titulo: "Por que essa tecnologia é utilizada?",
        texto: "O objetivo é reduzir os danos provocados por determinados insetos-praga. Em situações específicas de alta pressão de pragas, culturas Bt podem reduzir a necessidade de determinadas aplicações de inseticidas. Entretanto, o resultado depende da cultura, da praga, da região e do manejo agrícola.",
      },
      {
        titulo: "Resistência dos insetos",
        texto: "Populações de insetos podem desenvolver resistência quando existe pressão de seleção. Por isso, o uso de tecnologias Bt precisa estar associado a estratégias de manejo de resistência. Uma tecnologia transgênica não substitui automaticamente todo o manejo agrícola: ela faz parte de um sistema mais amplo.",
      },
    ],
    imagem: "https://agriq.com.br/wp-content/uploads/2021/12/Blog-AgriQ-Lagarta-Falsa-medideira-Chrysodeixis_Foto-Mais-Soja-scaled-1.jpg",
  },
  {
    categoria: "Ciência e curiosidades",
    titulo: "O que acontece com a modificação genética quando a semente germina?",
    subtitulo: "Descubra o que acontece com o material genético durante a germinação e como a característica modificada acompanha o desenvolvimento da planta.",
    conteudo: [
      {
        texto: "A semente contém um embrião vegetal que dará origem à nova planta. Quando ocorre a germinação, as células começam a se multiplicar e a planta se desenvolve. Se a modificação genética estiver presente no material genético da planta, ela acompanha as células que possuem essa alteração durante o desenvolvimento. Por isso, uma planta transgênica não deixa de possuir a característica genética simplesmente porque a semente germinou.",
      },
      {
        titulo: "E o que isso significa?",
        texto: "Imagine uma semente que possui uma determinada característica geneticamente modificada. Quando ela germina, essa característica está relacionada ao material genético das células da planta que se desenvolve. Assim, o termo “transgênico” não descreve apenas a semente física, mas a condição genética do organismo vegetal.",
      },
      {
        titulo: "E a próxima geração?",
        texto: "Dependendo da característica e da forma como o material genético está presente e é herdado, a modificação pode ser transmitida para a descendência. Por isso, a estabilidade genética e o padrão de herança são aspectos importantes na avaliação de plantas geneticamente modificadas.",
      },
    ],
    imagem: "https://cdn-shopkit.com/usercontent/loja-groho-hidroponia/media/images/a06d74b-germinar_sementes.jpg",
  },
  {
    categoria: "Ciência e curiosidades",
    titulo: "Como um novo gene pode ser introduzido em uma planta?",
    subtitulo: "Conheça os princípios da engenharia genética vegetal e entenda, de forma simples, como o material genético pode ser introduzido e estudado nas células das plantas.",
    conteudo: [
      {
        texto: "A introdução de material genético em uma planta é uma das etapas fundamentais da engenharia genética vegetal.",
      },
      {
        titulo: "Primeiro: identificar o material genético de interesse",
        texto: "Os pesquisadores precisam saber qual sequência genética está relacionada à característica desejada.",
      },
      {
        titulo: "Segundo: preparar o material genético",
        texto: "A sequência de interesse pode ser preparada dentro de uma construção genética adequada para funcionar nas células da planta.",
      },
      {
        titulo: "Terceiro: introdução nas células",
        texto: "Existem diferentes métodos laboratoriais capazes de permitir a introdução de material genético em células vegetais. O método escolhido depende da espécie vegetal e da estratégia experimental.",
      },
      {
        titulo: "Quarto: seleção",
        texto: "Após a transformação, os pesquisadores precisam identificar quais células receberam a alteração desejada.",
      },
      {
        titulo: "Quinto: regeneração",
        texto: "Quando possível, células selecionadas podem ser utilizadas para regenerar plantas inteiras.",
      },
      {
        titulo: "Sexto: caracterização",
        texto: "As plantas resultantes são analisadas para verificar se a modificação está presente, se apresenta o efeito esperado e como ela se comporta. A tecnologia de DNA recombinante permite inserir fragmentos de DNA provenientes de diferentes fontes em um organismo hospedeiro para obter características desejadas.",
      },
    ],
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtXVjhO6xHPbWf6IzuEwr0WYnbJ6ZtcE_jmglUkCPGnZhi8AacCt-0HZM&s=10",
  },
  {
    categoria: "Ciência e curiosidades",
    titulo: "É possível modificar geneticamente uma planta pra melhorar seu valor nutricional?",
    subtitulo: "Explore como a biotecnologia pode contribuir para pesquisas sobre a composição nutricional das plantas e o desenvolvimento de características específicas.",
    conteudo: [
      {
        texto: "Sim. A biotecnologia pode ser utilizada para pesquisar alterações na composição nutricional das plantas. O objetivo pode envolver características relacionadas à quantidade ou à composição de determinados nutrientes.",
      },
      {
        titulo: "Por que isso é interessante?",
        texto: "Muitas pessoas não consomem quantidades suficientes de determinados nutrientes. A biofortificação por diferentes métodos pode ser estudada como uma estratégia complementar para melhorar características nutricionais de culturas.",
      },
      {
        titulo: "Um exemplo",
        texto: "A Embrapa apresenta pesquisas envolvendo uma variedade de alface com 15 vezes mais ácido fólico (vitamina B9) que variedades convencionais. Esse exemplo mostra que a engenharia genética pode ser aplicada não apenas a características relacionadas a pragas e herbicidas, mas também a características nutricionais.",
      },
      {
        titulo: "Isso significa que todo alimento transgênico é mais nutritivo?",
        texto: "Não. A característica nutricional depende da modificação realizada. Uma planta transgênica não é automaticamente mais nutritiva simplesmente por ser transgênica. É necessário analisar qual característica foi modificada e qual foi o resultado obtido. Alterações nutricionais também estão entre os aspectos considerados nas avaliações de segurança de alimentos geneticamente modificados.",
      },
    ],
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMozXujyy5dAw7b3Rqa8hn-B5DIJGDRpTuvnqD-LORIg&s=10",
  },
  {
    categoria: "Benefícios, riscos e controvérsias",
    titulo: "Quais são os possíveis benefícios dos transgênicos?",
    subtitulo: "Conheça os possíveis benefícios das plantas geneticamente modificadas, considerando o controle de pragas, o manejo agrícola e as características nutricionais.",
    conteudo: [
      {
        texto: "Os benefícios potenciais dependem da característica introduzida, da cultura e do contexto agrícola.",
      },
      {
        titulo: "Controle de determinadas pragas",
        texto: "Algumas culturas geneticamente modificadas foram desenvolvidas para apresentar resistência a determinados insetos. Isso pode reduzir danos causados por essas pragas e, em determinadas situações, diminuir a necessidade de aplicações de inseticidas.",
      },
      {
        titulo: "Manejo de plantas daninhas",
        texto: "Culturas tolerantes a determinados herbicidas podem facilitar estratégias de controle de plantas daninhas. Entretanto, isso não significa que o uso da tecnologia elimine os desafios relacionados a essas plantas.",
      },
      {
        titulo: "Características nutricionais",
        texto: "A engenharia genética pode ser utilizada para pesquisar alterações na composição nutricional.",
      },
      {
        titulo: "Tolerância a condições ambientais",
        texto: "A biotecnologia também apresenta potencial para desenvolver características relacionadas a condições como seca e inundação.",
      },
      {
        titulo: "Potencial para a agricultura",
        texto: "A biotecnologia moderna pode contribuir para diferentes objetivos agrícolas, mas também é necessário considerar questões ambientais, de segurança e socioeconômicas. Por isso, é mais adequado falar em possíveis benefícios, e não afirmar que todos os transgênicos produzem os mesmos benefícios.",
      },
    ],
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOfshbemhOa8QvXzJJapi5MF_4oF86Ut09ii7Ak05htUIvd8Hi33aZ3Cw&s=10",
  },
  {
    categoria: "Benefícios, riscos e controvérsias",
    titulo: "Transgênicos fazem mal? O que a ciência investiga?",
    subtitulo: "Saiba como são avaliados os possíveis riscos dos organismos geneticamente modificados para a saúde e o meio ambiente, com base em evidências científicas.",
    conteudo: [
      {
        texto: "Essa é uma das perguntas mais frequentes quando o assunto é transgenia. A resposta científica não deve ser simplesmente “sim” ou “não”, porque existem diferentes organismos geneticamente modificados, genes e características. Os alimentos geneticamente modificados devem ser avaliados caso a caso.",
      },
      {
        titulo: "O que é analisado?",
        texto: "As avaliações podem considerar:",
        itens: [
          "Toxicidade e potencial alergênico",
          "Composição nutricional",
          "Estabilidade do gene introduzido",
          "Possíveis efeitos não intencionais",
          "Efeitos ambientais",
          "Possibilidade de transferência genética ou cruzamento com outras plantas",
        ],
      },
      {
        titulo: "Alergenicidade",
        texto: "Uma preocupação importante é verificar se a modificação pode introduzir ou aumentar potencial alergênico. Por isso, avaliações específicas são realizadas para identificar possíveis riscos.",
      },
      {
        titulo: "Transferência de genes",
        texto: "Outra questão estudada é a possibilidade de transferência do material genético para outros organismos. Essa possibilidade faz parte das avaliações de segurança, embora determinados cenários possuam probabilidades muito baixas.",
      },
      {
        titulo: "Meio ambiente",
        texto: "A avaliação ambiental pode considerar características como:",
        itens: [
          "Possibilidade de disseminação e persistência",
          "Efeitos sobre organismos que não são alvo",
          "Biodiversidade",
          "Interação com espécies relacionadas",
        ],
      },
      {
        titulo: "Então os transgênicos são seguros?",
        texto: "A forma cientificamente adequada de apresentar a questão é que a segurança deve ser avaliada individualmente para cada organismo geneticamente modificado e seu uso pretendido. A OMS informa que os alimentos GM comercializados internacionalmente passaram por avaliações das autoridades responsáveis e que não foram demonstrados efeitos à saúde decorrentes do consumo dos alimentos aprovados.",
      },
    ],
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShnWyppuJlFsDMnwVjL26Ncx9J2g-m_NHL0wpUe5u0Hs33R5dgG4YyaX0&s=10",
  },
  {
    categoria: "Transgênicos no Brasil",
    titulo: "Como funciona a regulamentação dos transgênicos no Brasil?",
    subtitulo: "Entenda como funciona o sistema brasileiro de biossegurança e quais avaliações e autorizações podem ser necessárias para o uso de organismos geneticamente modificados.",
    conteudo: [
      {
        texto: "O Brasil possui um sistema de biossegurança para regulamentar atividades envolvendo organismos geneticamente modificados. Um dos principais órgãos desse sistema é a CTNBio — Comissão Técnica Nacional de Biossegurança. A comissão possui caráter multidisciplinar e presta apoio técnico ao Governo Federal em questões relacionadas à biossegurança de OGMs.",
      },
      {
        titulo: "O que é avaliado?",
        texto: "A avaliação pode envolver aspectos relacionados à saúde humana, à saúde animal, à saúde vegetal, ao meio ambiente e à biossegurança. A CTNBio estabelece normas técnicas e emite pareceres relacionados a atividades envolvendo OGMs.",
      },
      {
        titulo: "E as sementes?",
        texto: "Atividades envolvendo sementes e outros materiais geneticamente modificados também estão sujeitas às regras aplicáveis. Determinadas situações envolvendo a importação de sementes ou mudas geneticamente modificadas para liberação planejada no meio ambiente exigem procedimentos junto à CTNBio e ao Ministério da Agricultura, conforme o caso.",
      },
      {
        titulo: "Por que existe regulamentação?",
        texto: "A regulamentação busca estabelecer critérios para que atividades com organismos geneticamente modificados sejam avaliadas considerando aspectos de biossegurança. Assim, a utilização de um OGM não depende apenas de sua criação em laboratório: existem requisitos regulatórios que precisam ser observados.",
      },
    ],
    imagem: "https://cursinhoparamedicina.com.br/wp-content/uploads/2021/08/alimentos-producao.jpg",
  },
  {
    categoria: "Transgênicos no Brasil",
    titulo: "O que é CTNBio e qual é o seu papel?",
    subtitulo: "Conheça a Comissão Técnica Nacional de Biossegurança, suas principais atribuições e sua importância na avaliação de organismos geneticamente modificados no Brasil.",
    conteudo: [
      {
        titulo: "O que significa CTNBio?",
        texto: "CTNBio significa Comissão Técnica Nacional de Biossegurança. Ela é uma instância colegiada e multidisciplinar integrante da estrutura do Ministério da Ciência, Tecnologia e Inovação. Sua finalidade inclui fornecer apoio técnico e assessoramento ao Governo Federal em assuntos relacionados à Política Nacional de Biossegurança de organismos geneticamente modificados e seus derivados.",
      },
      {
        titulo: "Qual é sua função?",
        texto: "Entre suas atribuições estão o estabelecimento de normas técnicas de segurança e a emissão de pareceres técnicos relacionados a atividades que envolvam pesquisa e uso comercial de OGMs.",
      },
      {
        titulo: "Como os organismos são avaliados?",
        texto: "A avaliação considera cada organismo geneticamente modificado individualmente e o uso pretendido. Essa análise faz parte do processo de biossegurança relacionado às atividades com OGMs.",
      },
    ],
    imagem: "https://profissaobiotec.com.br/wp-content/uploads/2021/07/ctnbio-logo.png",
  },
];
