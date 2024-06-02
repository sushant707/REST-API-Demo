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
            <div id="details-${post.id}" class="post-details"></div>
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

        const detailsContainer = document.getElementById(`details-${postId}`);
        detailsContainer.innerHTML = `
            <h3>Post Details</h3>
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
            <button onclick="hidePostDetails(${postId})">Close</button>
        `;

        detailsContainer.style.display = 'block';
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoader(false);
    }
}

function hidePostDetails(postId) {
    const detailsContainer = document.getElementById(`details-${postId}`);
    detailsContainer.style.display = 'none';
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

function showLoader(show) {
    const loader = document.getElementById('loader');
    if (show) {
        loader.style.display = 'block';
    } else {
        loader.style.display = 'none';
    }
}

// Call the fetchPosts function to initialize
fetchPosts();
