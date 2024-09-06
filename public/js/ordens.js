document.addEventListener('DOMContentLoaded', () => {
    const ordersTableBody = document.querySelector('#ordersTable tbody');
    const createOrderForm = document.getElementById('createOrderForm');
    const editOrderContainer = document.getElementById('editOrderContainer');
    const editOrderForm = document.getElementById('editOrderForm');
    const cancelEditButton = document.getElementById('cancelEdit');
    const idclieSelect = document.getElementById('idclie');
    const editIdclieSelect = document.getElementById('editIdclie');
    const addServiceButton = document.getElementById('addServiceButton');
    const serviceNameInput = document.getElementById('serviceName');
    const servicePriceInput = document.getElementById('servicePrice');
    const servicesList = document.getElementById('servicesList');
    const valorInput = document.getElementById('valor');
    const editValor = document.getElementById('editValor');
    const services = [];
    
    const token = document.cookie.split('sessionToken=')[1];
    if (!token) {
        console.error('Token de autenticação ausente');
        window.location.href = '/login.html';
        return;
    }

    addServiceButton.addEventListener('click', () => {
        const name = serviceNameInput.value.trim();
        const price = parseFloat(servicePriceInput.value);

        if (name && !isNaN(price)) {
            services.push({ name, price });
            updateServicesList();
            updateTotalValue();
            serviceNameInput.value = '';
            servicePriceInput.value = '';
        }
    });

    function updateServicesList() {
        servicesList.innerHTML = services.map((service, index) => `
            <li>${service.name} - R$${service.price.toFixed(2)}
                <button type="button" onclick="removeService(${index})">Remover</button>
            </li>
        `).join('');
    }

    function updateTotalValue() {
        const total = services.reduce((total, service) => total + service.price, 0);
        if (createOrderForm.style.display === 'none') {
            editValor.value = total.toFixed(2);
        } else {
            valorInput.value = total.toFixed(2);
        }
    }

    window.removeService = (index) => {
        services.splice(index, 1);
        updateServicesList();
        updateTotalValue();
    };

    let currentEditOrderId = null;

    async function loadOrders() {
        try {
            const response = await fetch('/api/os', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${document.cookie.split('sessionToken=')[1]}`
                }
            });

            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text();
                throw new Error(`Resposta inesperada: ${response.status} - ${errorText}`);
            }

            const ordens = await response.json();

            ordens.sort((a, b) => b.os - a.os);

            ordersTableBody.innerHTML = ordens.map(ordem => `
                <tr>
                    <td>${ordem.os}</td>
                    <td>${new Date(ordem.data_os).toLocaleDateString()}</td>
                    <td>${ordem.carro}</td>
                    <td>${ordem.placa}</td>
                    <td>${ordem.tecnico}</td>
                    <td>${ordem.valor}</td>
                    <td>${ordem.servico}</td>
                    <td>${ordem.cliente || 'Não disponível'}</td>
                    <td>${ordem.status}</td>
                    <td>
                        <button class="action-button edit-button" onclick="editOrder(${ordem.os})">Editar</button>
                        <button class="action-button delete-button" onclick="deleteOrder(${ordem.os})">Excluir</button>
                        <button class="action-button print-button" onclick="printOrder(${ordem.os})">Imprimir</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar ordens:', error);
        }
    }

    async function loadClients() {
        try {
            const response = await fetch('/api/clientes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${document.cookie.split('sessionToken=')[1]}`
                }
            });

            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text();
                throw new Error(`Resposta inesperada: ${response.status} - ${errorText}`);
            }

            window.clientesCache = await response.json();

            idclieSelect.innerHTML = window.clientesCache.map(cliente => `
                <option value="${cliente.id}">${cliente.nome}</option>
            `).join('');

            editIdclieSelect.innerHTML = window.clientesCache.map(cliente => `
                <option value="${cliente.id}">${cliente.nome}</option>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }

    createOrderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(createOrderForm);
        const data = {
            data_os: formData.get('data_os'),
            carro: formData.get('carro'),
            placa: formData.get('placa'),
            tecnico: formData.get('tecnico'),
            valor: parseFloat(valorInput.value),
            servico: formData.get('servico'),
            idclie: parseInt(formData.get('idclie')),
            status: formData.get('status'),
            lista_servicos: JSON.stringify(services)
        };

        try {
            const response = await fetch('/api/os', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro na criação da ordem');
            }

            createOrderForm.reset();
            services.length = 0;
            updateServicesList();
            updateTotalValue();
            loadOrders();
        } catch (error) {
            console.error('Erro ao criar ordem:', error);
        }
    });

    window.editOrder = async (id) => {
        try {
            const response = await fetch(`/api/os/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${document.cookie.split('sessionToken=')[1]}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao buscar ordem: ${response.status} - ${errorText}`);
            }

            const ordem = await response.json();
            

            const editOrderId = document.getElementById('editOrderId');
            const editData_os = document.getElementById('editData_os');
            const editCarro = document.getElementById('editCarro');
            const editPlaca = document.getElementById('editPlaca');
            const editTecnico = document.getElementById('editTecnico');
            const editValor = document.getElementById('editValor');
            const editServico = document.getElementById('editServico');
            const editIdclieSelect = document.getElementById('editIdclie');
            const editStatusSelect = document.getElementById('editStatus');

            if (editOrderId && editData_os && editCarro && editPlaca && editTecnico && editValor && editServico && editIdclieSelect && editStatusSelect) {
                editOrderId.value = ordem.os;
                editData_os.value = new Date(ordem.data_os).toISOString().split('T')[0];
                editCarro.value = ordem.carro;
                editPlaca.value = ordem.placa;
                editTecnico.value = ordem.tecnico;
                editValor.value = ordem.valor;
                editServico.value = ordem.servico;
                editIdclieSelect.value = ordem.idclie;
                editStatusSelect.value = ordem.status;

                services.length = 0;
                if (ordem.lista_servicos) {
                    JSON.parse(ordem.lista_servicos).forEach(service => services.push(service));
                    updateServicesList();
                    updateTotalValue();
                }

                editOrderContainer.style.display = 'block';
                currentEditOrderId = id;
            } else {
                console.error('Um ou mais elementos do formulário de edição estão ausentes.');
            }
        } catch (error) {
            console.error('Erro ao editar ordem:', error);
        }
    };

    window.deleteOrder = async (id) => {
        try {
            const response = await fetch(`/api/os/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${document.cookie.split('sessionToken=')[1]}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir ordem');
            }

            loadOrders();
        } catch (error) {
            console.error('Erro ao excluir ordem:', error);
        }
    };

    cancelEditButton.addEventListener('click', () => {
        editOrderContainer.style.display = 'none';
        currentEditOrderId = null;
        services.length = 0;
        updateServicesList();
        updateTotalValue();
    });

    function atualizarValorTotal() {
        let valorTotal = 0;
        const listaServicos = document.querySelectorAll('.servico-item'); // Ajuste o seletor conforme necessário
    
        listaServicos.forEach(servico => {
            const valorServico = parseFloat(servico.querySelector('.valor-servico').textContent) || 0;
            valorTotal += valorServico;
        });
    
        document.querySelector('#campo-valor').value = valorTotal.toFixed(2);
    }
    
    function salvarEdicao() {
        const formData = new FormData(document.querySelector('#form-edicao'));
        const listaServicos = [];
        
        document.querySelectorAll('.servico-item').forEach(servico => {
            listaServicos.push({
                descricao: servico.querySelector('.descricao-servico').textContent,
                valor: parseFloat(servico.querySelector('.valor-servico').textContent) || 0
            });
        });
    
        formData.append('lista_servicos', JSON.stringify(listaServicos));
        formData.append('valor', listaServicos.reduce((acc, s) => acc + s.valor, 0).toFixed(2));
        
        fetch('/api/os/' + id, {
            method: 'PUT',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Ordem de serviço atualizada com sucesso') {
                alert('Ordem de serviço atualizada com sucesso');
            } else {
                alert('Erro ao atualizar ordem de serviço');
            }
        });
    }

    editOrderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (currentEditOrderId === null) return;

        const formData = new FormData(editOrderForm);
        const data = {
            data_os: formData.get('data_os'),
            carro: formData.get('carro'),
            placa: formData.get('placa'),
            tecnico: formData.get('tecnico'),
            valor: parseFloat(editValor.value),
            servico: formData.get('servico'),
            idclie: parseInt(formData.get('idclie')),
            status: formData.get('status'),
            lista_servicos: JSON.stringify(services)
        };

        try {
            const response = await fetch(`/api/os/${currentEditOrderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split('sessionToken=')[1]}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro na atualização da ordem');
            }

            editOrderContainer.style.display = 'none';
            currentEditOrderId = null;
            services.length = 0;
            updateServicesList();
            updateTotalValue();
            loadOrders();
        } catch (error) {
            console.error('Erro ao atualizar ordem:', error);
        }
    });

    loadOrders();
    loadClients();
});
