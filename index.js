const express = require('express');
require('dotenv').config();
const cors = require('cors');
const database = require('./db');  
const Usuarios = require('./models/usuarios'); 
const Diario = require('./models/diario');
const Remedios = require('./models/remedios');
const Eventos = require('./models/eventos');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');  

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
    try {
        await database.sync();
        console.log('Banco de dados sincronizado com sucesso.');
    } catch (error) {
        console.error('Erro ao sincronizar o banco de dados:', error);
    }
})();

app.get("/", (req, res) => {
    res.send("Hello World");
});

// Rota para cadastro de usuários
app.post('/api/cadastro', async (req, res) => {
    console.log("Recebendo requisição de cadastro...");
    try {
        const { nome, cpf, nascimento, email, senha } = req.body;

        if (!nome || !cpf || !nascimento || !email || !senha) {
            console.log("Tem que ter tudo");
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const existingUser = await Usuarios.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        const hashedSenha = await bcrypt.hash(senha, 10);
        console.log("Ta indo");
        const novoUsuario = await Usuarios.create({
            nome,
            cpf,
            nascimento,
            email,
            senha: hashedSenha
        });

        return res.status(201).json({ status: "success", message: 'Usuário criado com sucesso!', usuario: novoUsuario });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return res.status(500).json({ error: 'Erro ao criar o usuário.' });
    }
});

// Rota para login de usuários
app.post('/api/login', async (req, res) => {
    console.log("Recebendo requisição de login...");
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
            console.log("Email e senha são obrigatório");
        }

        const usuario = await Usuarios.findOne({ where: { email } });

        if (!usuario) {
            console.log("Usuario não encontrado");
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
        if (!isPasswordValid) {
            console.log("Senha incorreta");
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        res.json({ 
            message: 'Login bem-sucedido!', 
            id: usuario.id // Envia o ID do usuário
        });
        console.log("Foi!");
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro no login.' });
    }
});

// Rota para criar um novo registro no Diário
app.post('/api/diario', async (req, res) => {
    console.log("Recebendo requisição para adicionar um registro no diário...");
    try {
        const { sis, dia, pul, peso, o2, idUsuario } = req.body;

        // Verifica se o idUsuario existe na tabela Usuarios
        const usuario = await Usuarios.findByPk(idUsuario);
        if (!usuario) {
            return res.status(400).json({ error: 'Usuário não encontrado.' });
        }

        // Cria um novo registro no Diário
        const novoRegistro = await Diario.create({
            sis,
            dia,
            pul,
            peso,
            o2,
            idUsuario
        });

        return res.status(201).json({ status: "success", message: 'Registro criado com sucesso!', diario: novoRegistro });
    } catch (error) {
        console.error('Erro ao criar registro no diário:', error);
        return res.status(500).json({ error: 'Erro ao criar o registro.' });
    }
});

// Rota para obter o último registro do Diário
app.get('/api/diario/ultimo', async (req, res) => {
    console.log("Recebendo requisição para obter o último registro no diário...");
    
    // Obtém o idUsuario do query string
    const { idUsuario } = req.query;

    try {
        // Verifica se o idUsuario foi fornecido
        if (!idUsuario) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        // Obtém o último registro inserido para o usuário específico, ordenado pelo ID em ordem decrescente
        const ultimoRegistro = await Diario.findOne({
            where: { idUsuario }, // Filtra pelo idUsuario
            order: [['id', 'DESC']]
        });

        if (!ultimoRegistro) {
            return res.status(404).json({ error: 'Nenhum registro encontrado no diário para este usuário.' });
        }

        return res.status(200).json({ status: "success", diario: ultimoRegistro });
    } catch (error) {
        console.error('Erro ao obter o último registro do diário:', error);
        return res.status(500).json({ error: 'Erro ao obter o registro.' });
    }
});


// Rota para criar um novo registro no Eventos
app.post('/api/eventos', async (req, res) => {
    console.log("Recebendo requisição para adicionar um evento...");
    
    try {
        const { nome, data, hora, idUsuario } = req.body;

        // Verifica se o idUsuario existe na tabela Usuarios
        const usuario = await Usuarios.findByPk(idUsuario);
        if (!usuario) {
            return res.status(400).json({ error: 'Usuário não encontrado.' });
        }

        // Cria um novo registro no Eventos
        const novoEvento = await Eventos.create({
            nome,
            data,
            hora,
            idUsuario
        });

        return res.status(201).json({ status: "success", message: 'Evento criado com sucesso!', evento: novoEvento });
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        return res.status(500).json({ error: 'Erro ao criar o evento.' });
    }
});

// Rota para obter todos os eventos de um usuário específico
app.get('/api/eventoadicionados', async (req, res) => {
    const { idUsuario } = req.query; // Obtendo o idUsuario dos parâmetros de consulta

    if (!idUsuario) {
        return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    try {
        const eventos = await Eventos.findAll({
            where: {
                idUsuario: idUsuario // Filtra os eventos pelo idUsuario
            }
        });

        // Verifica se foram encontrados eventos
        if (eventos.length === 0) {
            return res.status(404).json({ message: 'Nenhum evento encontrado para este usuário.' });
        }

        res.status(200).json(eventos);
    } catch (error) {
        console.error('Erro ao obter eventos:', error);
        res.status(500).json({ message: 'Erro ao obter eventos' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para adicionar um novo remédio
app.post('/api/remedios/add', async (req, res) => {
    console.log("Recebendo requisição para adicionar um remédio...");
    try {
        const { nome, quantidade, tipo, datainicio, datatermino, intervalo, descricao, idUsuario } = req.body;

        // Verifica se o idUsuario existe na tabela Usuarios
        const usuario = await Usuarios.findByPk(idUsuario);
        if (!usuario) {
            return res.status(400).json({ error: 'Usuário não encontrado.' });
        }

        // Cria um novo remédio associado ao usuário
        const novoRemedio = await Remedios.create({
            nome,
            quantidade,
            tipo,
            datainicio,
            datatermino,
            intervalo,
            descricao,
            idUsuario
        });

        return res.status(201).json({ status: "success", message: 'Remédio adicionado com sucesso!', remedio: novoRemedio });
    } catch (error) {
        console.error('Erro ao adicionar remédio:', error);
        return res.status(500).json({ error: 'Erro ao adicionar remédio.' });
    }
});


// Rota para obter todos os remédios de um usuário específico
app.get('/api/remedios/user/:idUsuario', async (req, res) => {
    console.log("Recebendo requisição para obter remédios do usuário...");
    try {
        const { idUsuario } = req.params; // Obtendo o idUsuario dos parâmetros da URL

        // Verifica se o idUsuario existe na tabela Usuarios
        const usuario = await Usuarios.findByPk(idUsuario);
        if (!usuario) {
            return res.status(400).json({ error: 'Usuário não encontrado.' });
        }

        // Busca todos os remédios associados ao usuário
        const remedios = await Remedios.findAll({
            where: { idUsuario }
        });

        // Verifica se foram encontrados remédios
        if (remedios.length === 0) {
            return res.status(404).json({ message: 'Nenhum remédio encontrado para este usuário.' });
        }

        return res.status(200).json({ status: "success", remedios });
    } catch (error) {
        console.error('Erro ao buscar remédios:', error);
        return res.status(500).json({ error: 'Erro ao buscar remédios.' });
    }
});


// Rota para atualizar um remédio existente
app.put('/api/remedios/update/:id', async (req, res) => {
    console.log("Recebendo requisição para atualizar um remédio...");
    try {
        const { id } = req.params;
        const { nome, quantidade, tipo, datainicio, datatermino, intervalo, descricao } = req.body;

        // Busca o remédio pelo ID
        const remedio = await Remedios.findByPk(id);
        if (!remedio) {
            return res.status(404).json({ message: 'Remédio não encontrado.' });
        }

        // Atualiza os dados do remédio
        remedio.nome = nome;
        remedio.quantidade = quantidade;
        remedio.tipo = tipo;
        remedio.datainicio = datainicio;
        remedio.datatermino = datatermino;
        remedio.intervalo = intervalo;
        remedio.descricao = descricao;

        await remedio.save();
        return res.status(200).json({ status: "success", message: 'Remédio atualizado com sucesso!', remedio });
    } catch (error) {
        console.error('Erro ao atualizar remédio:', error);
        return res.status(500).json({ error: 'Erro ao atualizar remédio.' });
    }
});

// Rota para deletar um remédio
app.delete('/api/remedios/delete/:id', async (req, res) => {
    console.log("Recebendo requisição para deletar um remédio...");
    try {
        const { id } = req.params;

        // Busca o remédio pelo ID
        const remedio = await Remedios.findByPk(id);
        if (!remedio) {
            return res.status(404).json({ message: 'Remédio não encontrado.' });
        }

        // Deleta o remédio
        await remedio.destroy();
        return res.status(200).json({ status: "success", message: 'Remédio deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar remédio:', error);
        return res.status(500).json({ error: 'Erro ao deletar remédio.' });
    }
});

