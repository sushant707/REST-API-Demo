async function fetchPosts() {
    showLoader(true);
    try {
        const [postsResponse, usersResponse] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/posts'),
            fetch('https://jsonplaceholder.typicode.com/users')
        ]);

        if (!postsResponse.ok || !usersResponse.ok) {
            throw new Error('Failed to fetch posts or users');
        }

        const posts = await postsResponse.json();
        const users = await usersResponse.json();

        const usersMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        displayPosts(posts, usersMap);
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoader(false);
    }
}

function displayPosts(posts, users) {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const user = users[post.userId];

        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <p><strong>Author:</strong> ${user.name} (${user.email})</p>
        `;

        postElement.addEventListener('click', () => displayPostDetails(post.id));

        postsContainer.appendChild(postElement);
    });
}

async function displayPostDetails(postId) {
    showLoader(true);
    try {
        const [postResponse, commentsResponse] = await Promise.all([
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`),
            fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        ]);

        if (!postResponse.ok || !commentsResponse.ok) {
            throw new Error('Failed to fetch post details or comments');
        }

        const post = await postResponse.json();
        const comments = await commentsResponse.json();

        const postDetailsContainer = document.getElementById('postDetailsContainer');
        postDetailsContainer.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <h3>Comments</h3>
            <ul>
                ${comments.map(comment => `
                    <li>
                        <p><strong>${comment.name}:</strong> ${comment.body}</p>
                        <p><em>${comment.email}</em></p>
                    </li>
                `).join('')}
            </ul>
            <button onclick="hidePostDetails()">Close</button>
        `;

        postDetailsContainer.style.display = 'block';
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoader(false);
    }
}

function displayError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

function hideError() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.style.display = 'none';
}

function hidePostDetails() {
    const postDetailsContainer = document.getElementById('postDetailsContainer');
    postDetailsContainer.style.display = 'none';
}

function showLoader(show) {
    const postsContainer = document.getElementById('postsContainer');
    const loader = document.createElement('div');
    loader.className = 'loader';
    if (show) {
        postsContainer.appendChild(loader);
    } else {
        const loaderElement = document.querySelector('.loader');
        if (loaderElement) loaderElement.remove();
    }
}

// Call the fetchPosts function to initialize
fetchPosts();
