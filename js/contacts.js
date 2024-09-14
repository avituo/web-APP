document.addEventListener('DOMContentLoaded', function() {
    let usersMap = {};

    function fetchUsers() {
        return fetch('https://deepskyblue-boar-319363.hostingersite.com/users')
            .then(response => response.json())
            .then(users => {
                users.forEach(user => {
                    usersMap[user.id] = user.name;
                });
                populateUserSelect(users);
            })
            .catch(error => {
                console.error('Erro ao buscar usuários:', error);
            });
    }

    function populateUserSelect(users) {
        const userSelect = document.getElementById('userIdSelect');
        userSelect.innerHTML = '<option value="" disabled selected>Selecione um usuário</option>';

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.text = user.name;
            userSelect.appendChild(option);
        });
    }

    function fetchContacts() {
        showLoader();

        if ($.fn.DataTable.isDataTable('#contactsTable')) {
            $('#contactsTable').DataTable().destroy();
        }

        fetch('https://deepskyblue-boar-319363.hostingersite.com/contacts')
            .then(response => response.json())
            .then(data => {
                populateContactTable(data);
                $('#contactsTable').DataTable({
                    language: {
                        "sEmptyTable": "Nenhum dado disponível na tabela",
                        "sInfo": "Mostrando _START_ até _END_ de _TOTAL_ registros",
                        "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                        "sInfoFiltered": "(Filtrados de _MAX_ registros no total)",
                        "sLengthMenu": "Mostrar _MENU_ registros",
                        "sLoadingRecords": "Carregando...",
                        "sProcessing": "Processando...",
                        "sZeroRecords": "Nenhum registro encontrado",
                        "sSearch": "Buscar",
                        "oPaginate": {
                            "sNext": "Próximo",
                            "sPrevious": "Anterior",
                            "sFirst": "Primeiro",
                            "sLast": "Último"
                        },
                        "oAria": {
                            "sSortAscending": ": Ordenar colunas de forma ascendente",
                            "sSortDescending": ": Ordenar colunas de forma descendente"
                        }
                    },
                    destroy: true
                });
            })
            .catch(error => {
                console.error('Erro ao buscar contatos:', error);
            })
            .finally(() => {
                hideLoader();
            });
    }

    function populateContactTable(contacts) {
        const tbody = document.querySelector('#contactsTable tbody');
        tbody.innerHTML = '';
        contacts.forEach(contact => {
            const userName = usersMap[contact.user_id] || 'Usuário não encontrado';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.id}</td>
                <td>${userName}</td>
                <td>${contact.type}</td>
                <td>${contact.value}</td>
                <td><button class="btn btn-warning btn-sm" onclick="editContact(${contact.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteContact(${contact.id})">Apagar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    window.editContact = function(id) {
        alert('Editar contato com ID: ' + id);
    };

    window.deleteContact = function(id) {
        alert('Apagar contato com ID: ' + id);
    };

    function resetContactForm() {
        const createContactForm = document.getElementById('createContactForm');
        createContactForm.reset();

        document.getElementById('userIdSelect').selectedIndex = 0;
        document.getElementById('contactType').selectedIndex = 0;

        removeMask();
    }

    function applyMask() {
        const contactValue = document.getElementById('contactValue');
        if (contactValue) {
            try {
                Inputmask("(99) 99999-9999").mask(contactValue);
            } catch (error) {
                console.error('Erro ao aplicar máscara:', error);
            }
        }
    }

    function removeMask() {
        const contactValue = document.getElementById('contactValue');
        if (contactValue) {
            try {
                Inputmask.remove(contactValue);
            } catch (error) {
                console.error('Erro ao remover máscara:', error);
            }
        }
    }

    document.getElementById('contactType').addEventListener('change', function() {
        const contactType = this.value;
        const contactValue = document.getElementById('contactValue');

        // Clear the contact value field
        if (contactValue) {
            contactValue.value = '';
        }

        if (contactType === 'Whatsapp' || contactType === 'Telefone') {
            applyMask();
        } else if (contactType === 'Email') {
            removeMask();
        }
    });

    document.getElementById('createContactButton').addEventListener('click', function() {
        resetContactForm();
    });

    // Apply or remove mask when modal is shown
    document.getElementById('createContactModal').addEventListener('shown.bs.modal', function () {
        const contactType = document.getElementById('contactType').value;
        if (contactType === 'Whatsapp' || contactType === 'Telefone') {
            applyMask();
        }
    });

    // Remove mask when modal is hidden
    document.getElementById('createContactModal').addEventListener('hidden.bs.modal', function () {
        removeMask();
        resetContactForm();
    });

    document.getElementById('createContactForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const userId = document.getElementById('userIdSelect').value;
        const contactType = document.getElementById('contactType').value;
        const contactValue = document.getElementById('contactValue').value;

        if (!userId) {
            alert('Por favor, selecione um usuário!');
            return;
        }

        if (!contactType) {
            alert('Por favor, selecione um tipo de contato!');
            return;
        }

        if (contactType === 'email' && !validateEmail(contactValue)) {
            alert('Por favor, insira um e-mail válido!');
            return;
        }

        showLoader();

        fetch('https://deepskyblue-boar-319363.hostingersite.com/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                type: contactType,
                value: contactValue
            })
        })
            .then(response => response.json())
            .then(() => {
                alert('Contato criado com sucesso!');
                let createContactModal = bootstrap.Modal.getInstance(document.getElementById('createContactModal'));
                createContactModal.hide();
                fetchContacts();
            })
            .catch(error => {
                console.error('Erro ao criar o contato:', error);
                alert('Erro ao criar o contato.');
            })
            .finally(() => {
                hideLoader();
            });
    });

    fetchUsers().then(fetchContacts);
});
