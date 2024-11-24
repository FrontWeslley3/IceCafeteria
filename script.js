const searchIcon = document.getElementById('searchIcon');
const searchContainer = document.querySelector('.search-container');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const cartIcon = document.getElementById('cartIcon');
const itemCount = document.getElementById('item-count');
const cartModal = document.getElementById('cart-modal');
const cartList = document.getElementById('cart-list');
const cartTotal = document.getElementById('cart-total');
const closeModalBtn = document.getElementById('close-modal-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const deliveryAddress = document.getElementById('delivery-address');
const productBoxes = document.querySelectorAll('.box'); // Seleciona todos os produtos do menu
let cart = [];

// Abrir/fechar barra de pesquisa ao clicar no ícone de pesquisa
searchIcon.addEventListener('click', () => {
    const isHidden = searchContainer.style.display === 'none' || searchContainer.style.display === '';
    searchContainer.style.display = isHidden ? 'block' : 'none';
});

// Função de busca reutilizável
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase(); // Obtem o termo pesquisado e converte para minúsculas

    // Loop pelos produtos para ver se o nome corresponde ao termo pesquisado
    productBoxes.forEach(box => {
        const productName = box.querySelector('h3').textContent.toLowerCase(); // Pega o nome do produto e converte para minúsculas

        if (productName.includes(searchTerm)) {
            box.style.display = 'block'; // Exibe o produto se o nome corresponder ao termo pesquisado
        } else {
            box.style.display = 'none'; // Oculta o produto se não corresponder
        }
    });

    console.log('Pesquisando por:', searchTerm);
}

// Evento de clique no botão de pesquisa
searchButton.addEventListener('click', searchProducts);

// Evento para detectar "Enter" pressionado no campo de busca
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Impede o comportamento padrão de envio de formulário
        searchProducts(); // Executa a função de busca
    }
});

// Função para abrir o modal do carrinho
function openCartModal() {
    cartModal.classList.remove('hidden');
    updateCart();
}

// Função para fechar o modal do carrinho
function closeCartModal() {
    cartModal.classList.add('hidden');
}

// Função para atualizar o carrinho e mostrar os itens
function updateCart() {
    cartList.innerHTML = ''; // Limpa a lista de itens antes de adicionar novamente
    let total = 0;

    if (cart.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Seu carrinho está vazio.';
        cartList.appendChild(emptyMessage);
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - R$ ${item.price.toFixed(2)} (${item.quantity})`;
            cartList.appendChild(li);
            total += item.price * item.quantity;
        });
    }

    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
    updateItemCount(); // Atualiza o contador de itens após atualizar o carrinho
}

// Função para adicionar um item ao carrinho
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();
    updateItemCount();
}

// Atualizar o contador de itens no ícone do carrinho
function updateItemCount() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (totalItems > 0) {
        itemCount.textContent = totalItems;
        itemCount.classList.remove('hidden');
    } else {
        itemCount.textContent = 0; // Garante que o contador seja zerado
        itemCount.classList.add('hidden');
    }
}

// Fechar o modal ao clicar no botão de fechar
closeModalBtn.addEventListener('click', closeCartModal);

// Limpar todos os itens do carrinho
clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCart(); // Atualiza o carrinho para exibir "carrinho vazio"
    updateItemCount(); // Garante que o contador seja zerado
});

// Finalizar compra e redirecionar para o WhatsApp com os dados
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    const address = deliveryAddress.value.trim(); // Remove espaços extras

    if (!address) {
        alert('Por favor, forneça o endereço de entrega.');
        return;
    }

    // Cria uma mensagem com os itens do carrinho
    let message = `Olá, gostaria de finalizar a compra do Café R$ ${total} com entrega no endereço: ${address}.\n\nQual forma de pagamento?:\n`;

    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    // Insira seu número de WhatsApp no lugar de SEU_NUMERO
    const phoneNumber = '5511978827562'; // Número no formato correto (sem +)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// Evento de clique no ícone do carrinho para abrir o modal
cartIcon.addEventListener('click', openCartModal);

// Adicionar o evento de clique para os botões "Adicione ao Carrinho"
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        
        const item = { name, price };
        addToCart(item); // Adiciona o item ao carrinho
    });
});


