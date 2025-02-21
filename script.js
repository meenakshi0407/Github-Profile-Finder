const APIURL = 'https://api.github.com/users/';
const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');
const loading = document.getElementById('loading');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = search.value.trim();
    if (username) {
        search.value = '';
        getUser(username);
    }
});

async function getUser(username) {
    main.innerHTML = '';  
    loading.style.display = 'block';

    try {
        const res = await fetch(APIURL + username);
        if (!res.ok) throw new Error('User not found');
        const user = await res.json();
        showUser(user);
        getRepos(username);
    } catch (error) {
        showError(error.message);
    } finally {
        loading.style.display = 'none';  
    }
}

async function getRepos(username) {
    try {
        const res = await fetch(APIURL + username + '/repos?sort=created');
        if (!res.ok) throw new Error('Error fetching repos');
        const repos = await res.json();
        showRepos(repos);
    } catch {
        showError('Error fetching repos');
    }
}

function showUser(user) {
    main.innerHTML = `
        <div class="card">
            <img src="${user.avatar_url}" class="avatar" alt="Avatar">
            <h2>${user.name || user.login}</h2>
            <p>${user.bio || 'No bio available'}</p>
            <p>${user.followers} Followers | ${user.following} Following</p>
            <div id="repos"></div>
        </div>
    `;
}

function showRepos(repos) {
    const reposEl = document.getElementById('repos');
    repos.slice(0, 5).forEach(repo => {
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo');
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.innerText = repo.name;
        reposEl.appendChild(repoEl);
    });
}

function showError(msg) {
    main.innerHTML = `<p style="color: red;">${msg}</p>`;
}