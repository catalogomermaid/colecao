document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DO FILTRO DE CATEGORIAS ---
    const botoesFiltro = document.querySelectorAll('.btn-categoria');
    const produtos = document.querySelectorAll('.produto-card');

    botoesFiltro.forEach(function(botao) {
        botao.addEventListener('click', function() {
            document.querySelector('.btn-categoria.ativo').classList.remove('ativo');
            botao.classList.add('ativo');
            const filtro = botao.getAttribute('data-filtro');
            produtos.forEach(function(produto) {
                const categoriaProduto = produto.getAttribute('data-categoria');
                if (filtro === 'todos' || filtro === categoriaProduto) {
                    produto.style.display = 'flex';
                } else {
                    produto.style.display = 'none';
                }
            });
        });
    });

    // --- LÓGICA DO POPUP DE DETALHES DO PRODUTO ---
    const linkInstagram = "https://www.instagram.com/SEUUSUARIO";

    const popupOverlay = document.getElementById('popup-overlay');
    const btnFecharPopup = document.getElementById('btn-fechar-popup');
    const botoesDetalhes = document.querySelectorAll('.btn-detalhes');

    const popupImg = document.getElementById('popup-img');
    const popupTitulo = document.getElementById('popup-titulo');
    const popupDescricao = document.getElementById('popup-descricao');
    const popupPreco = document.getElementById('popup-preco');
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const btnInstagram = document.getElementById('btn-instagram');
    const popupCoresContainer = document.getElementById('popup-cores-container');
    const popupCores = document.getElementById('popup-cores');

    botoesDetalhes.forEach(botao => {
        botao.addEventListener('click', function() {
            const produtoCard = this.closest('.produto-card');
            
            const imgSrc = produtoCard.querySelector('img').src;
            const titulo = produtoCard.querySelector('h3').innerText;
            const descricao = produtoCard.querySelector('.produto-descricao').innerText;
            const preco = produtoCard.querySelector('.produto-preco').innerText;
            const cores = produtoCard.dataset.colors;

            popupImg.src = imgSrc;
            popupTitulo.innerText = titulo;
            popupDescricao.innerText = descricao;
            popupPreco.innerText = preco;

            // --- NOVO CÓDIGO PARA EXTRAIR O ID DO PRODUTO ---
            // 1. Pega o nome do arquivo da URL da imagem (ex: "vestido_red.jpg")
            const nomeArquivo = imgSrc.split('/').pop(); 
            // 2. Remove a extensão do arquivo (ex: "vestido_red")
            const codigoProduto = nomeArquivo.split('.').slice(0, -1).join('.'); 

            // Monta a mensagem para o WhatsApp com o título e o código do produto
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

            popupOverlay.style.display = 'flex';
        });
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