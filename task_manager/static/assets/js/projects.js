async function fetchUsers() {
    try {
        const response = await fetch('http://127.0.0.1:8000/user/all');
        if (response.ok) {
            const users = await response.json();
            const userSelect = document.getElementById('project-user');
            const editUserSelect = document.getElementById('edit-project-user');

            userSelect.innerHTML = '<option value="">Select User</option>';
            editUserSelect.innerHTML = '<option value="">Select User</option>';

            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username;
                userSelect.appendChild(option);
                editUserSelect.appendChild(option.cloneNode(true));
            });
        } else {
            console.error('Failed to fetch users');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function fetchProjects() {
    try {
        const response = await fetch('http://127.0.0.1:8000/projects/');
        if (response.ok) {
            const projects = await response.json();
            const projectList = document.getElementById('project-list');
            projectList.innerHTML = '';

            projects.forEach(project => {
                const userName = project.user && project.user.username ? project.user.username : 'No user';

                const projectItem = document.createElement('div');
                projectItem.className = 'project-item';
                projectItem.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <p><small>Assigned to: ${userName}</small></p>
                    <p><small>Created at: ${project.created_at}</small></p>
                    <button onclick="editProject(${project.id})">Edit</button>
                    <button class="delete-button" onclick="deleteProject(${project.id})">Delete</button>
                `;
                projectList.appendChild(projectItem);
            });
        } else {
            console.error('Failed to fetch projects');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
async function editProject(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/projects/${id}/`);
        if (response.ok) {
            const project = await response.json();
            document.getElementById('edit-project-id').value = project.id;
            document.getElementById('edit-project-title').value = project.title;
            document.getElementById('edit-project-description').value = project.description;
            document.getElementById('edit-project-user').value = project.user; // Default to current user
            document.getElementById('edit-modal').style.display = 'block';
        } else {
            console.error('Failed to fetch project details');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

document.getElementById('edit-project-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-project-id').value;
    const title = document.getElementById('edit-project-title').value;
    const description = document.getElementById('edit-project-description').value;
    const userId = document.getElementById('edit-project-user').value;

    try {
        const response = await fetch(`http://127.0.0.1:8000/projects/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({
                title,
                description,
                user: userId ? userId : undefined // If userId is empty, send undefined
            })
        });

        if (response.ok) {
            document.getElementById('message').innerHTML = `<div style="color: green;">Project updated successfully!</div>`;
            document.getElementById('edit-modal').style.display = 'none';
            fetchProjects();
        } else {
            const result = await response.json();
            document.getElementById('message').innerHTML = `<div style="color: red;">${result.message || 'Update failed'}</div>`;
        }
    } catch (error) {
        document.getElementById('message').innerHTML = `<div style="color: red;">An error occurred: ${error.message}</div>`;
    }
});

document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
});

async function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/projects/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            });

            if (response.ok) {
                document.getElementById('message').innerHTML = `<div style="color: green;">Project deleted successfully!</div>`;
                fetchProjects();
            } else {
                const result = await response.json();
                document.getElementById('message').innerHTML = `<div style="color: red;">${result.message || 'Delete failed'}</div>`;
            }
        } catch (error) {
            document.getElementById('message').innerHTML = `<div style="color: red;">An error occurred: ${error.message}</div>`;
        }
    }
}

document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('project-title').value;
    const description = document.getElementById('project-description').value;
    const userId = document.getElementById('project-user').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/projects/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({
                title,
                description,
                user: userId
            })
        });

        if (response.ok) {
            document.getElementById('message').innerHTML = `<div style="color: green;">Project added successfully!</div>`;
            document.getElementById('project-form').reset();
            fetchProjects();
        } else {
            const result = await response.json();
            document.getElementById('message').innerHTML = `<div style="color: red;">${result.message || 'Add failed'}</div>`;
        }
    } catch (error) {
        document.getElementById('message').innerHTML = `<div style="color: red;">An error occurred: ${error.message}</div>`;
    }
});

// Initial data fetch
fetchUsers();
fetchProjects();
