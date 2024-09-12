document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    document.getElementById('add-user-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        let username = document.getElementById('username').value;
        let email = document.getElementById('email').value;
        username = username.replace(/\s+/g, '_');
        email = email.replace(/\s+/g, '_');

        try {
            const response = await fetch('http://127.0.0.1:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),
                },
                body: JSON.stringify({ username, email }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                fetchUsers();  // Refresh the user list
                document.getElementById('username').value = '';
                document.getElementById('email').value = '';
            } else {
                const errorData = await response.json();
                console.error('Failed to add user:', errorData.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
});

async function fetchUsers() {
    try {
        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            console.warn('CSRF token is not available.');
        }
        const response = await fetch('http://127.0.0.1:8000/user/all');
        if (response.ok) {
            const users = await response.json();
            const userTableBody = document.getElementById('user-table-body');
            userTableBody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                `;
                userTableBody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch users');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function getCsrfToken() {
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfMeta) {
        return csrfMeta.getAttribute('content');
    } else {
        console.error('CSRF token meta tag not found');
        return null;
    }
}
