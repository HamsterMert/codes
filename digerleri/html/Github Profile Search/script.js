document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const usernameInput = document.getElementById('username');
    const profileCard = document.getElementById('profile-card');
    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');
    const themeToggle = document.getElementById('theme-toggle');
    const showMoreBtn = document.getElementById('show-more-btn');
    const detailedInfo = document.getElementById('detailed-info');
    
    // Tema değiştirme
    themeToggle.addEventListener('click', toggleTheme);
    
    // Varsayılan tema kontrolü
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Arama butonu ve Enter tuşu
    searchBtn.addEventListener('click', searchProfile);
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProfile();
        }
    });
    
    // Detaylı bilgi butonu
    showMoreBtn.addEventListener('click', toggleDetailedInfo);
    
    function searchProfile() {
        const username = usernameInput.value.trim();
        
        if (!username) {
            showError('Lütfen bir kullanıcı adı girin!');
            return;
        }
        
        // Yükleme animasyonunu göster
        loading.classList.remove('hidden');
        profileCard.classList.add('hidden');
        errorMessage.classList.add('hidden');
        detailedInfo.classList.remove('expanded');
        showMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Daha Fazla Bilgi';
        
        fetch(`https://api.github.com/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Kullanıcı bulunamadı');
                }
                return response.json();
            })
            .then(data => {
                displayProfile(data);
                loading.classList.add('hidden');
                errorMessage.classList.add('hidden');
                profileCard.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Hata:', error);
                loading.classList.add('hidden');
                showError('Kullanıcı bulunamadı. Lütfen geçerli bir GitHub kullanıcı adı girin.');
            });
    }
    
    function displayProfile(user) {
        // Temel bilgiler
        document.getElementById('avatar').src = user.avatar_url;
        document.getElementById('name').textContent = user.name || user.login;
        document.getElementById('login').textContent = `@${user.login}`;
        document.getElementById('bio').textContent = user.bio || 'Bu kullanıcının bio bilgisi yok.';
        
        // İstatistikler
        document.getElementById('followers').textContent = user.followers;
        document.getElementById('following').textContent = user.following;
        document.getElementById('repos').textContent = user.public_repos;
        
        // Linkler
        const profileLink = document.getElementById('profile-link');
        profileLink.href = user.html_url;
        
        // Meta bilgileri
        updateMetaItem('location-item', 'location', user.location);
        updateMetaItem('company-item', 'company', user.company);
        updateMetaItem('twitter-item', 'twitter', user.twitter_username);
        
        // Detaylı bilgiler
        document.getElementById('public-repos').textContent = user.public_repos || '0';
        document.getElementById('private-repos').textContent = user.total_private_repos || '0';
        document.getElementById('gists').textContent = user.public_gists || '0';
        document.getElementById('created-at').textContent = user.created_at ? 
            new Date(user.created_at).toLocaleDateString() : 'Bilinmiyor';
        
        // Repoları yükle
        if (user.public_repos > 0) {
            fetch(user.repos_url)
                .then(response => response.json())
                .then(repos => {
                    displayTopRepos(repos);
                })
                .catch(error => {
                    console.error('Repolar yüklenirken hata:', error);
                    document.getElementById('repos-container').classList.add('hidden');
                });
        } else {
            document.getElementById('repos-container').classList.add('hidden');
        }
    }
    
    function displayTopRepos(repos) {
        const reposList = document.getElementById('repos-list');
        reposList.innerHTML = '';
        
        // En çok yıldız alan 5 repo
        const topRepos = repos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5);
        
        if (topRepos.length === 0) {
            document.getElementById('repos-container').classList.add('hidden');
            return;
        }
        
        topRepos.forEach(repo => {
            const repoItem = document.createElement('div');
            repoItem.className = 'repo-item';
            
            repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                <div class="repo-stats">
                    <span class="repo-stat">
                        <i class="fas fa-star"></i> ${repo.stargazers_count}
                    </span>
                    <span class="repo-stat">
                        <i class="fas fa-code-branch"></i> ${repo.forks_count}
                    </span>
                </div>
            `;
            
            reposList.appendChild(repoItem);
        });
        
        document.getElementById('repos-container').classList.remove('hidden');
    }
    
    function toggleDetailedInfo() {
        detailedInfo.classList.toggle('expanded');
        if (detailedInfo.classList.contains('expanded')) {
            showMoreBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Daha Az Bilgi';
        } else {
            showMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Daha Fazla Bilgi';
        }
    }
    
    function updateMetaItem(itemId, spanId, value) {
        const item = document.getElementById(itemId);
        const span = document.getElementById(spanId);
        
        if (value) {
            span.textContent = value;
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    }
    
    function showError(message) {
        errorMessage.querySelector('p').textContent = message;
        errorMessage.classList.remove('hidden');
        profileCard.classList.add('hidden');
        loading.classList.add('hidden');
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
});