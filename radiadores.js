// Variáveis globais
let currentRadiador = null;
let currentImageIndex = 0;
let filteredRadiadores = [...radiadoresData];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderRadiadores(radiadoresData);
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Busca em tempo real
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value;
        if (searchTerm.length >= 2 || searchTerm.length === 0) {
            performSearch(searchTerm);
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Navegação da galeria com setas
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('galeriaModal').style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                previousImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });
}

// Renderizar radiadores
function renderRadiadores(radiadores) {
    const grid = document.getElementById('radiadoresGrid');
    
    if (radiadores.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <h3>Nenhum radiador encontrado</h3>
                <p>Tente ajustar os filtros ou termo de busca</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = radiadores.map(radiador => `
        <div class="radiador-card" onclick="openModal(${radiador.id})">
            <div class="radiador-image">
                <img src="${radiador.imagem}" alt="${radiador.nome}">
                <div class="radiador-badge">${radiador.categoria}</div>
            </div>
            <div class="radiador-content">
                <div class="radiador-codigo">${radiador.codigo}</div>
                <h3 class="radiador-nome">${radiador.nome}</h3>
                <div class="radiador-specs">
                    <div class="spec-item">
                        <div class="spec-label">Aplicação:</div>
                        <div class="spec-value">${radiador.aplicacao}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Motor:</div>
                        <div class="spec-value">${radiador.motor}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Anos:</div>
                        <div class="spec-value">${radiador.anos}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Transmissão:</div>
                        <div class="spec-value">${radiador.transmissao}</div>
                    </div>
                </div>
                <div class="radiador-preco">${radiador.preco}</div>
                <div class="radiador-actions">
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); openModal(${radiador.id})">
                        <i class="fas fa-eye"></i>
                        Ver Detalhes
                    </button>
                    <button class="btn btn-outline btn-small" onclick="event.stopPropagation(); solicitarOrcamentoRapido(${radiador.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Orçamento
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Busca
function searchRadiadores() {
    const searchTerm = document.getElementById('searchInput').value;
    performSearch(searchTerm);
}

function performSearch(searchTerm) {
    if (!searchTerm) {
        filteredRadiadores = [...radiadoresData];
    } else {
        filteredRadiadores = searchRadiadores(searchTerm);
    }
    renderRadiadores(filteredRadiadores);
    updateActiveFilter('todos');
}

// Filtros por marca
function filterByMarca(marca) {
    updateActiveFilter(marca);
    
    if (marca === 'todos') {
        filteredRadiadores = [...radiadoresData];
    } else {
        filteredRadiadores = getRadiadoresByMarca(marca);
    }
    
    renderRadiadores(filteredRadiadores);
    document.getElementById('searchInput').value = '';
}

function updateActiveFilter(marca) {
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (marca === 'todos') {
        document.querySelector('.filtro-btn').classList.add('active');
    } else {
        const targetBtn = Array.from(document.querySelectorAll('.filtro-btn'))
            .find(btn => btn.textContent.toLowerCase().includes(marca));
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }
}

// Modal
function openModal(radiadorId) {
    currentRadiador = getRadiadorById(radiadorId);
    if (!currentRadiador) return;

    currentImageIndex = 0;
    
    // Preencher dados do modal
    document.getElementById('modalTitle').textContent = currentRadiador.nome;
    document.getElementById('modalCodigo').textContent = currentRadiador.codigo;
    document.getElementById('modalAplicacao').textContent = currentRadiador.aplicacao;
    document.getElementById('modalMotor').textContent = currentRadiador.motor;
    document.getElementById('modalAnos').textContent = currentRadiador.anos;
    document.getElementById('modalTransmissao').textContent = currentRadiador.transmissao;
    document.getElementById('modalPreco').textContent = currentRadiador.preco;
    
    // Carregar galeria
    loadGallery();
    
    // Mostrar modal
    document.getElementById('galeriaModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('galeriaModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentRadiador = null;
    currentImageIndex = 0;
}

function loadGallery() {
    if (!currentRadiador) return;
    
    const mainImage = document.getElementById('mainImage');
    const thumbnailsContainer = document.getElementById('thumbnails');
    
    // Imagem principal
    mainImage.src = currentRadiador.galeria[currentImageIndex];
    mainImage.alt = currentRadiador.nome;
    
    // Thumbnails
    thumbnailsContainer.innerHTML = currentRadiador.galeria.map((img, index) => `
        <div class="thumbnail ${index === currentImageIndex ? 'active' : ''}" onclick="selectImage(${index})">
            <img src="${img}" alt="Imagem ${index + 1}">
        </div>
    `).join('');
}

function selectImage(index) {
    currentImageIndex = index;
    loadGallery();
}

function previousImage() {
    if (!currentRadiador) return;
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentRadiador.galeria.length - 1;
    loadGallery();
}

function nextImage() {
    if (!currentRadiador) return;
    currentImageIndex = currentImageIndex < currentRadiador.galeria.length - 1 ? currentImageIndex + 1 : 0;
    loadGallery();
}

// Ações
function solicitarOrcamento() {
    if (!currentRadiador) return;
    
    const mensagem = `Olá! Gostaria de solicitar um orçamento para o radiador:
    
Código: ${currentRadiador.codigo}
Produto: ${currentRadiador.nome}
Aplicação: ${currentRadiador.aplicacao}
Motor: ${currentRadiador.motor}
Anos: ${currentRadiador.anos}

Aguardo retorno. Obrigado!`;
    
    const whatsappUrl = `https://wa.me/5527999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
}

function solicitarOrcamentoRapido(radiadorId) {
    const radiador = getRadiadorById(radiadorId);
    if (!radiador) return;
    
    const mensagem = `Olá! Gostaria de um orçamento para o radiador ${radiador.codigo} - ${radiador.nome}`;
    const whatsappUrl = `https://wa.me/5527999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
}

function compartilhar() {
    if (!currentRadiador) return;
    
    if (navigator.share) {
        navigator.share({
            title: currentRadiador.nome,
            text: `Confira este radiador: ${currentRadiador.nome}`,
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    }
}

// Menu mobile
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const btn = document.querySelector('.mobile-menu-btn');
    
    nav.classList.toggle('mobile-open');
    btn.classList.toggle('active');
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading para imagens
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Animações de entrada
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.radiador-card').forEach(card => {
        observer.observe(card);
    });
}

// Inicializar animações após renderizar
function initializeAnimations() {
    setTimeout(() => {
        setupAnimations();
    }, 100);
}

// Atualizar renderização para incluir animações
const originalRenderRadiadores = renderRadiadores;
renderRadiadores = function(radiadores) {
    originalRenderRadiadores(radiadores);
    initializeAnimations();
};

console.log('Página de radiadores carregada com sucesso!');
