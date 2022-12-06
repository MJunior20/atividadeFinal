const client = require('../config/dbConnection');
const { ObjectId } = require('mongodb');

module.exports = class PeticaoModel {

    static async getPeticaoByTitulo(titulo) {
        
        const peticao = await client.db("atividadeFinal").collection("peticoes").findOne({titulo});
        return peticao;
    }

    static async getAllPeticoes() {
        
        const cursor = await client.db("atividadeFinal").collection("peticoes").find();
        const peticoes = await cursor.toArray();
        return peticoes;
    }

    static async autenticarUsuario(email, senha) {
        const user = await client.db("atividadeFinal").collection("usuarios").findOne({email: email, password: senha });
        return user;
    }

    static async addPeticao(data) {
        try{
            const novaPeticao = { titulo: data.titulo, descricao: data.descricao, linkImagem: data.linkImagem,
            dataCriacao: data.dataCriacao, criadoPor: data.criadoPor};
            const peticao = await client.db("atividadeFinal").collection("peticoes").insertOne(novaPeticao);
            console.log(`Id da petição inserida ${peticao.insertedId}`);
            return peticao;
        }
        catch(error){
            console.log(`Erro ao inserir petição: ${error}`);
        }
    }

    static async alterarPeticao(peticaoId,data) {
        console.log(`[peticao Model - update peticao]`);
        peticaoId = new ObjectId(peticaoId);
        try {
            const peticaoAlterada = { titulo: data.titulo, descricao: data.descricao, linkImagem: data.linkImagem,
                dataCriacao: data.dataCriacao, criadoPor: data.criadoPor}
            
            const peticao = await client.db("atividadeFinal").collection("peticoes").findOneAndUpdate({_id: peticaoId, criadoPor: data.criadoPor},{ $set: peticaoAlterada});
            
            
            return peticao;
        } catch (error) {
            console.log(`[Alterar Petição] Update Error: ${error}`);
        }
    }

    static async apagarPeticao(peticaoId, criadoPor) {
        console.log(`[Peticao Model - delete peticao]`);
        peticaoId = new ObjectId(peticaoId);
        try {
            const peticaoApagada = await client.db("atividadeFinal").collection("peticoes").findOneAndDelete({_id: peticaoId,criadoPor: criadoPor});
                        
            return peticaoApagada;
        } catch (error) {
            console.log(`[Apagar petição] delete Error: ${error}`);
        }
    }

    static async assinarPeticao(data) {
        try{
            const novaAssinatura = { peticaoId: data.peticaoId, tituloPeticao: data.tituloPeticao, nome: data.nome, dataAssinatura: new Date()};
            const assinatura = await client.db("atividadeFinal").collection("assinaturas").insertOne(novaAssinatura);
            console.log(`assinatura inserida ${assinatura}`);
            return assinatura;
        }
        catch(error){
            console.log(`Erro ao assinar petição: ${error}`);
        }
    }

    static async autenticarUsuario(email, senha) {
    const user = await client.db("atividadeFinal").collection("usuarios").findOne({email: email, password: senha });
    return user;
    }

    static async getAssinaturasPeticao(titulo) {
        const cursor = await client.db("atividadeFinal").collection("assinaturas").find({tituloPeticao:titulo});
        const assinaturas = await cursor.toArray();
        return assinaturas;
    }

    static async deleteAssinaturas(peticaoId){
        try {
            const assinaturas = await client.db("atividadeFinal").collection("assinaturas").deleteMany({peticaoId: peticaoId});
            console.log("Assinaturas Apagadas");
            
            return peticaoId;
        } catch (error) {
            console.log(`[Apagar petição] delete Error: ${error}`);
        }
    }
}