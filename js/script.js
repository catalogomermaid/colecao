document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DO FILTRO DE CATEGORIAS ---
    const botoesFiltro = document.querySelectorAll('.btn-categoria');
    const todosProdutos = document.querySelectorAll('.produto-card');

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

    // --- LÓGICA DO POPUP DE DETALHES DO PRODUTO (GALERIA) ---
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
        const btnWhatsapp = document.getElementById('btn-whatsapp');
        const btnInstagram = document.getElementById('btn-instagram');
        const popupCoresContainer = document.getElementById('popup-cores-container');
        const popupCores = document.getElementById('popup-cores');

        const imgSrc = produtoCard.querySelector('img').src;
        const titulo = produtoCard.querySelector('h3').innerText;
        const descricao = produtoCard.querySelector('.produto-descricao').innerText;
        const preco = produtoCard.querySelector('.produto-preco').innerText;
        const cores = produtoCard.dataset.colors;

        popupImg.src = imgSrc;
        popupTitulo.innerText = titulo;
        popupDescricao.innerText = descricao;
        popupPreco.innerText = preco;

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

    // --- MUDANÇA PRINCIPAL AQUI ---
    // Adiciona evento de clique para cada CARD de produto, em vez de apenas no botão
    todosProdutos.forEach((produtoCard) => {
        produtoCard.addEventListener('click', function() {
            // Atualiza a lista de produtos visíveis com base no filtro atual
            produtosVisiveis = Array.from(todosProdutos).filter(p => p.style.display !== 'none');
            
            // Encontra o índice do produto clicado na lista de visíveis
            currentIndex = produtosVisiveis.indexOf(produtoCard);
            
            mostrarProduto();
            popupOverlay.style.display = 'flex';
        });
    });

    btnNext.addEventListener('click', function(event) {
        event.stopPropagation(); // Impede que o clique na seta feche o popup
        currentIndex = (currentIndex + 1) % produtosVisiveis.length;
        mostrarProduto();
    });

    btnPrev.addEventListener('click', function(event) {
        event.stopPropagation(); // Impede que o clique na seta feche o popup
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