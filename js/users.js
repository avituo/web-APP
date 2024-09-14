document.addEventListener('DOMContentLoaded', function() {
    let selectedUserId = null;

    function fetchUsers() {
        showLoader();
        fetch('https://deepskyblue-boar-319363.hostingersite.com/users')
            .then(response => response.json())
            .then(data => {
                populateUserTable(data);
                $('#userTable').DataTable({
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
                    }
                });
            })
            .catch(error => {
                console.error('Erro ao buscar usuários:', error);
            })
            .finally(() => {
                hideLoader();
            });
    }

    function populateUserTable(users) {
        const tbody = document.querySelector('#userTable tbody');
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="editUser(${user.id}, '${user.name}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Apagar</button>
        </td>
    `;
            tbody.appendChild(row);
        });
    }

    window.editUser = function(id, name) {
        selectedUserId = id;
        document.getElementById('editUserName').value = name;
        const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editModal.show();
    };


    window.deleteUser = function(id) {
        if (confirm("Tem certeza de que deseja apagar este usuário?")) {
            showLoader();
            fetch(`https://deepskyblue-boar-319363.hostingersite.com/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erro ao apagar o usuário.");
                    }
                    return response.json();
                })
                .then(() => {
                    showToast("Sucesso", "Usuário apagado com sucesso.", "success");
                    location.reload();
                })
                .catch(error => {
                    alert(error.message);
                })
                .finally(() => {
                    hideLoader();
                });
        }
    }

    document.getElementById('saveUserChanges').addEventListener('click', function() {
        const updatedName = document.getElementById('editUserName').value;
        showLoader();
        if (updatedName.trim() !== '') {
            fetch(`https://deepskyblue-boar-319363.hostingersite.com/users/${selectedUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: updatedName
                })
            })
                .then(response => {
                    if (response.ok) {
                        alert('Usuário atualizado com sucesso!');
                        const editModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
                        editModal.hide();
                    } else {
                        alert('Erro ao atualizar o usuário.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao atualizar o usuário:', error);
                })
                .finally(() => {
                    location.reload();
                });
        } else {
            alert('O nome não pode estar vazio!');
        }
    });

    document.getElementById('createUserForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const userName = document.getElementById('newUserName').value;

        showLoader();

        fetch('https://deepskyblue-boar-319363.hostingersite.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: userName })
        })
            .then(response => response.text())
            .then(text => {
                console.log('Resposta do servidor:', text);
                try {
                    const data = JSON.parse(text);
                    console.log('Usuário criado com sucesso:', data);
                    var createUserModal = bootstrap.Modal.getInstance(document.getElementById('createUserModal'));
                    createUserModal.hide();
                    location.reload();
                } catch (e) {
                    console.error('Erro ao fazer o parse do JSON:', e);
                    alert('Erro ao criar o usuário. Resposta inválida do servidor.');
                }
            })
            .catch(error => {
                console.error('Erro ao criar o usuário:', error);
                alert('Erro ao criar o usuário.');
            })
            .finally(() => {
                hideLoader();
            });
    });

    fetchUsers();
});





