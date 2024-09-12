
async function fetchProjects() {
    try {
        const response = await fetch('/projects/');
        if (response.ok) {
            const projects = await response.json();
            const taskProjectSelect = document.getElementById('task-project');
            const editTaskProjectSelect = document.getElementById('edit-task-project');

            taskProjectSelect.innerHTML = '<option value="">Select Project</option>';
            editTaskProjectSelect.innerHTML = '<option value="">Select Project</option>';

            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.title;
                taskProjectSelect.appendChild(option);
                editTaskProjectSelect.appendChild(option.cloneNode(true));
            });
        } else {
            console.error('Failed to fetch projects');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
async function updateTask(taskId, taskData) {
    try {
        const response = await fetch(`/tasks/${taskId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),  // Include CSRF token if necessary
            },
            body: JSON.stringify(taskData),
        });

        if (response.ok) {
            const updatedTask = await response.json();
            console.log('Task updated successfully:', updatedTask);
            fetchTasks();  // Refresh task list
        } else {
            const errorData = await response.json();
            console.error('Failed to update task:', errorData);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function getCsrfToken() {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    return token;
}


async function fetchTasks() {
    try {
        const response = await fetch('/tasks/');
        if (response.ok) {
            const tasks = await response.json();
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';

            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                // Create priority element with appropriate class
                const priorityClass = `priority-${task.priority}`;
                const priorityIcon = task.priority === 'high' ? '🔥' : (task.priority === 'medium' ? '✨' : '✔️');
                const priorityElement = document.createElement('p');
                priorityElement.className = `priority ${priorityClass}`;
                priorityElement.innerHTML = `${priorityIcon} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`;
                // Create status element with appropriate class
                const statusElement = document.createElement('p');
                statusElement.className = `status ${task.status}`;
                statusElement.textContent = task.status.replace('_', ' '); // Replace underscore with space for display

                taskItem.innerHTML = `
                    <h2>${task.project.title}</h2>
                    <h4>Task : ${task.title}</h4>
                    <p> Description : ${task.description}</p>
                    <p>Task Assign Date : ${task.created_at}</p>
                    <p>${statusElement.outerHTML}</p>
                    <p>${priorityElement.outerHTML}</p>
                    <button class="delete-button" data-id="${task.id}">Delete</button>
                    <button class="edit-button" data-id="${task.id}">Edit</button>
                `;
                
                taskList.appendChild(taskItem);
            });

            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', handleEdit);
            });

            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', handleDelete);
            });
        } else {
            console.error('Failed to fetch tasks');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    const priorityElement = document.getElementById('task-priority');
    if (!priorityElement) {
        console.error('Priority element not found');
        return;
    }
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const project = document.getElementById('task-project').value;
    const priority = priorityElement.value;
    const status = document.getElementById('task-status').value; // Ensure this is a single string

    try {
        const response = await fetch('http://127.0.0.1:8000/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({ title, description, project, status,priority })
        });

        if (response.ok) {
            document.getElementById('task-form').reset();
            fetchTasks();
        } else {
            const errorData = await response.json();
            console.error('Failed to add task:', errorData);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


async function handleEdit(event) {
    const id = event.target.dataset.id;
    try {
        const response = await fetch(`/tasks/${id}/`);
        if (response.ok) {
            const task = await response.json();
            document.getElementById('edit-task-id').value = task.id;
            document.getElementById('edit-task-title').value = task.title;
            document.getElementById('edit-task-description').value = task.description;
            document.getElementById('edit-task-priority').value = task.priority;
            document.getElementById('edit-task-status').value = task.status;

            const editTaskProjectSelect = document.getElementById('edit-task-project');
            editTaskProjectSelect.value = task.project.id;

            document.getElementById('edit-modal').style.display = 'block';
        } else {
            console.error('Failed to fetch task');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function handleSaveEdit(event) {
    event.preventDefault();
    const id = document.getElementById('edit-task-id').value;
    const title = document.getElementById('edit-task-title').value;
    const description = document.getElementById('edit-task-description').value;
    const project = document.getElementById('edit-task-project').value;
    const priority = document.getElementById('edit-task-priority').value;
    const status = document.getElementById('edit-task-status').value;

    try {
        const response = await fetch(`/tasks/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({ title, description, project, status,priority  })
        });

        if (response.ok) {
            document.getElementById('edit-modal').style.display = 'none';
            fetchTasks();
        } else {
            console.error('Failed to update task');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function handleDelete(event) {
    const id = event.target.dataset.id;
    try {
        const response = await fetch(`/tasks/${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        if (response.ok) {
            fetchTasks();
        } else {
            console.error('Failed to delete task');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

document.getElementById('task-form').addEventListener('submit', handleSubmit);
document.getElementById('edit-task-form').addEventListener('submit', handleSaveEdit);
document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
});
document.getElementById('cancel-button').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
});


// Initial data fetch
fetchProjects();
fetchTasks();
