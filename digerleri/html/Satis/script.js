// Ürün bilgileri
const products = [
    {
        id: 1,
        name: "Elmas Kılıç",
        image: "https://via.placeholder.com/300",
        description: "Bu güçlü elmas kılıç, BoxPvP'de rakiplerini alt etmek için mükemmel bir seçim!",
        features: ["Dayanıklılık: 1561", "Hasar: 7", "Büyü: Keskinlik V"]
    },
    {
        id: 2,
        name: "Netherit Göğüslük (Koruma 10)",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe1wsC1DSnFRB24qz2CcNiPmBcVTquBhRtMw&s",
        description: "Sadece göğüslük",
        features: ["Koruma: 10"]
    },
    {
        id: 3,
        name: "Netherit Kazma",
        image: "https://via.placeholder.com/300",
        description: "Hızlı ve dayanıklı bir kazma ile madencilik artık çok kolay!",
        features: ["Dayanıklılık: 1561", "Hız: 8", "Büyü: Verimlilik V"]
    },
    {
        id: 4,
        name: "Savaşçı Paketi",
        image: "https://via.placeholder.com/300",
        description: "Bu paket, Elmas Kılıç ve Elmas Zırh Seti’ni içerir. Savaşta tam donanımlı ol!",
        features: ["Elmas Kılıç", "Elmas Zırh Seti", "Bonus: 10 Coin Hediye"]
    },
    {
        id: 5,
        name: "Obsidyen Blok",
        image: "https://via.placeholder.com/300",
        description: "Bu sağlam blok, üssünü korumak için ideal bir seçim!",
        features: ["Dayanıklılık: 1200", "Patlama Direnci: Yüksek", "Kullanım: Yapı"]
    }
];

function redirectToDiscord() {
    const discordLink = "https://discord.gg/DEĞİŞTİR"; // Kendi Discord linkinle değiştir
    window.location.href = discordLink;
}

function searchItems() {
    const searchValue = document.getElementById('searchBar').value.toLowerCase();
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        const itemName = item.querySelector('h2').textContent.toLowerCase();
        item.style.display = itemName.includes(searchValue) ? 'block' : 'none';
    });
}

function filterItems(category) {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        item.style.display = (category === 'all' || itemCategory === category) ? 'block' : 'none';
    });
}

function loadProduct(id) {
    const product = products.find(p => p.id == id);
    if (product) {
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-image').alt = product.name;
        document.getElementById('product-description').textContent = product.description;

        const featuresList = document.getElementById('product-features');
        featuresList.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    } else {
        document.querySelector('.container').innerHTML = '<p>Ürün bulunamadı!</p>';
    }
}

function openImageModal(src) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    modalImage.src = src;
    modal.style.display = 'flex';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}