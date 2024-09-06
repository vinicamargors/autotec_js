document.addEventListener('DOMContentLoaded', () => {
    const clientsTableBody = document.querySelector('#clientsTable tbody');
    const createClientForm = document.getElementById('createClientForm');
    const editClientContainer = document.getElementById('editClientContainer');
    const editClientForm = document.getElementById('editClientForm');
    const cancelEditButton = document.getElementById('cancelEdit');
    const errorMessageSpan = document.getElementById('error-message');
    let currentEditClientId = null;

    const token = document.cookie.split('sessionToken=')[1];
    if (!token) {
        console.error('Token de autenticação ausente');
        window.location.href = '/login.html';
        return;
    }

    async function loadClients() {
        try {
            const response = await fetch('/api/clientes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
            }

            const clientes = await response.json();

            clientsTableBody.innerHTML = clientes.map(cliente => `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.endereco}</td>
                    <td>${cliente.cpf}</td>
                    <td>
                        <button class="action-button edit-button" onclick="editClient(${cliente.id})">Editar</button>
                        <button class="action-button delete-button" onclick="confirmDelete(${cliente.id})">Excluir</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }

    createClientForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(createClientForm);
        const data = {
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            endereco: formData.get('endereco'),
            cpf: formData.get('cpf')
        };

        try {
            const response = await fetch('/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro na criação do cliente');
            }

            createClientForm.reset();
            loadClients();
            errorMessageSpan.style.display = 'none';
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            errorMessageSpan.textContent = 'Erro ao criar cliente. Tente novamente.';
            errorMessageSpan.style.display = 'block';
        }
    });

    window.editClient = async (id) => {
        try {
            const response = await fetch(`/api/clientes/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao buscar cliente: ${response.status} - ${errorText}`);
            }

            const cliente = await response.json();

            document.getElementById('editClientId').value = cliente.id;
            document.getElementById('editNome').value = cliente.nome;
            document.getElementById('editTelefone').value = cliente.telefone;
            document.getElementById('editEndereco').value = cliente.endereco;
            document.getElementById('editCpf').value = cliente.cpf;

            editClientContainer.style.display = 'block';
            currentEditClientId = id;
        } catch (error) {
            console.error('Erro ao editar cliente:', error);
        }
    };

    editClientForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(editClientForm);
        const data = {
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            endereco: formData.get('endereco'),
            cpf: formData.get('cpf')
        };

        try {
            const response = await fetch(`/api/clientes/${currentEditClientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro na atualização do cliente');
            }

            editClientContainer.style.display = 'none';
            loadClients();
            errorMessageSpan.style.display = 'none';
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            errorMessageSpan.textContent = 'Erro ao atualizar cliente. Tente novamente.';
            errorMessageSpan.style.display = 'block';
        }
    });

    // Função para confirmar a exclusão
    window.confirmDelete = (clientId) => {
        const userConfirmed = confirm("Você tem certeza que deseja excluir este cliente?");
        
        if (userConfirmed) {
            deleteClient(clientId);
        }
    }

    // Função para excluir um cliente
    window.deleteClient = async (id) => {
        try {
            const response = await fetch(`/api/clientes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao excluir cliente: ${response.status} - ${errorText}`);
            }

            loadClients(); // Atualiza a lista de clientes após exclusão
            errorMessageSpan.style.display = 'none';
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            errorMessageSpan.textContent = 'Não é possível excluir cliente. Tente novamente.';
            errorMessageSpan.style.display = 'block';
        }
    };


    cancelEditButton.addEventListener('click', () => {
        editClientContainer.style.display = 'none';
        currentEditClientId = null;
    });

    loadClients();
});
