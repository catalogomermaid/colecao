document.addEventListener('DOMContentLoaded', function() {

    const todosProdutos = document.querySelectorAll('.produto-card');

    // --- FUNÇÃO PARA CALCULAR E EXIBIR PARCELAMENTO ---
    function calcularParcelamento() {
        todosProdutos.forEach(produto => {
            const precoEl = produto.querySelector('.produto-preco');
            const parcelamentoEl = produto.querySelector('.produto-parcelamento');
            const precoTexto = precoEl.innerText; 

            if (parcelamentoEl) { // Verifica se o elemento existe
                if (precoTexto.includes('60,00')) {
                    parcelamentoEl.innerText = 'R$ 65,00 parcelado em até 2x';
                } else if (precoTexto.includes('70,00')) {
                    parcelamentoEl.innerText = 'R$ 75,00 parcelado em até 2x';
                } else if (precoTexto.includes('100,00')) {
                    parcelamentoEl.innerText = 'R$ 105,00 parcelado em até 2x';
                } else {
                    parcelamentoEl.innerText = ''; 
                }
            }
        });
    }

    calcularParcelamento();

    // --- LÓGICA DO FILTRO DE CATEGORIAS ---
    const botoesFiltro = document.querySelectorAll('.btn-categoria');
    botoesFiltro.forEach(function(botao) {
        botao.addEventListener('click', function() {
            document.querySelector('.btn-categoria.ativo').classList.remove('ativo');
            botao.classList.add('ativo');
            const filtro = botao.getAttribute('data-filtro');
            
            todosProdutos.forEach(function(produto) {
                const categoriaProduto = produto.getAttribute('data-categoria');
                if (filtro === 'todos' || filtro === categoriaProduto) {
                    produto.style.display = 'flex';
                } else {
                    produto.style.display = 'none';
                }
            });
        });
    });

    // --- LÓGICA PARA PRODUTOS ESGOTADOS ---
    todosProdutos.forEach(produtoCard => {
        if (produtoCard.dataset.esgotado === 'true') {
            produtoCard.classList.add('esgotado');
            const botao = produtoCard.querySelector('.btn-detalhes');
            if (botao) {
                botao.innerText = 'Avise-me quando chegar';
            }
        }
    });

    // --- LÓGICA DO POPUP E CLIQUE NOS CARDS ---
    const linkInstagram = "https://www.instagram.com/mermaid_cajazeiras";

    const popupOverlay = document.getElementById('popup-overlay');
    const btnFecharPopup = document.getElementById('btn-fechar-popup');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    let produtosVisiveis = [];
    let currentIndex = 0;

    function preencherPopup(produtoCard) {
        const popupImg = document.getElementById('popup-img');
        const popupTitulo = document.getElementById('popup-titulo');
        const popupDescricao = document.getElementById('popup-descricao');
        const popupPreco = document.getElementById('popup-preco');
        const popupParcelamento = document.getElementById('popup-parcelamento');
        const btnWhatsapp = document.getElementById('btn-whatsapp');
        const btnInstagram = document.getElementById('btn-instagram');
        const popupCoresContainer = document.getElementById('popup-cores-container');
        const popupCores = document.getElementById('popup-cores');

        const imgSrc = produtoCard.querySelector('img').src;
        const titulo = produtoCard.querySelector('h3').innerText;
        const descricao = produtoCard.querySelector('.produto-descricao').innerText;
        const preco = produtoCard.querySelector('.produto-preco').innerText;
        const parcelamento = produtoCard.querySelector('.produto-parcelamento').innerText;
        const cores = produtoCard.dataset.colors;

        popupImg.src = imgSrc;
        popupTitulo.innerText = titulo;
        popupDescricao.innerText = descricao;
        popupPreco.innerText = preco;
        popupParcelamento.innerText = parcelamento;

        const nomeArquivo = imgSrc.split('/').pop(); 
        const codigoProduto = nomeArquivo.split('.').slice(0, -1).join('.'); 

        const mensagem = `Olá! Gostaria de mais informações sobre o modelo: ${titulo} (Ref: ${codigoProduto})`;
        const linkWhatsapp = `https://api.whatsapp.com/send?phone=+5583991034549&text=${encodeURIComponent(mensagem)}`;
        
        btnWhatsapp.href = linkWhatsapp;
        btnInstagram.href = linkInstagram;

        popupCores.innerHTML = '';
        if (cores) {
            popupCoresContainer.style.display = 'block';
            const coresArray = cores.split(',');
            coresArray.forEach(cor => {
                const corOpcao = document.createElement('div');
                corOpcao.classList.add('cor-opcao');
                corOpcao.style.backgroundColor = cor;
                popupCores.appendChild(corOpcao);
            });
        } else {
            popupCoresContainer.style.display = 'none';
        }
    }

    function mostrarProduto() {
        if (produtosVisiveis.length > 0) {
            preencherPopup(produtosVisiveis[currentIndex]);
        }
    }

    todosProdutos.forEach((produtoCard) => {
        produtoCard.addEventListener('click', function(event) {
            // --- LÓGICA ATUALIZADA PARA ESGOTADOS ---
            if (this.classList.contains('esgotado')) {
                // Verifica se o clique foi especificamente no botão
                if (event.target.classList.contains('btn-detalhes')) {
                    const titulo = this.querySelector('h3').innerText;
                    const imgSrc = this.querySelector('img').src;
                    const nomeArquivo = imgSrc.split('/').pop();
                    const codigoProduto = nomeArquivo.split('.').slice(0, -1).join('.');

                    const mensagem = `Olá, gostaria que me avisasse quando esse modelo estiver novamente disponível!\nProduto: ${titulo} (Ref: ${codigoProduto})`;
                    const linkWhatsapp = `https://api.whatsapp.com/send?phone=+5583991034549&text=${encodeURIComponent(mensagem)}`;
                    
                    window.open(linkWhatsapp, '_blank'); // Abre o WhatsApp em uma nova aba
                }
                // Impede a abertura do popup para qualquer outro clique
                return; 
            }
            
            // Lógica para produtos em estoque (continua a mesma)
            produtosVisiveis = Array.from(todosProdutos).filter(p => p.style.display !== 'none' && !p.classList.contains('esgotado'));
            currentIndex = produtosVisiveis.indexOf(produtoCard);
            
            if (currentIndex === -1) return;

            mostrarProduto();
            popupOverlay.style.display = 'flex';
        });
    });

    btnNext.addEventListener('click', function(event) {
        event.stopPropagation();
        currentIndex = (currentIndex + 1) % produtosVisiveis.length;
        mostrarProduto();
    });

    btnPrev.addEventListener('click', function(event) {
        event.stopPropagation();
        currentIndex = (currentIndex - 1 + produtosVisiveis.length) % produtosVisiveis.length;
        mostrarProduto();
    });

    function fecharPopup() {
        popupOverlay.style.display = 'none';
    }

    btnFecharPopup.addEventListener('click', fecharPopup);
    popupOverlay.addEventListener('click', function(event) {
        if (event.target === popupOverlay) {
            fecharPopup();
        }
    });
});