const PeticaoModel = require('../model/peticaoModel');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const SECRET = 'chaveauth';

const schemaPeticao = Joi.object().keys({
    titulo: Joi.string().required().min(10).max(100),
    descricao: Joi.string().required().min(1).max(100),
    linkImagem: Joi.string().required().min(1).max(2000),
    dataCriacao: Joi.date().required()
    
});
const schemaAssinatura = Joi.object().keys({
    peticaoId: Joi.string().required().min(1),
    tituloPeticao: Joi.string().required().min(10).max(100), 
    nome: Joi.string().required().min(1)
});


module.exports = class PeticaoController {
    static async getPeticaoByTitulo (req,res,next){
        console.log("Get Petição Controller.");
        try{
            
            const peticao = await PeticaoModel.getPeticaoByTitulo(req.params.titulo);
            if(!peticao){
                res.status(400).json('Não existe petição com este Id');
                return;
            };
            const assinaturas = await PeticaoModel.getAssinaturasPeticao(req.params.titulo);
            const pA =  { titulo: peticao.titulo, descricao: peticao.descricao, linkImagem: peticao.linkImagem,
                dataCriacao: peticao.dataCriacao, criadoPor: peticao.criadoPor, assinaturas: [assinaturas] }
            res.status(200).json(pA);
        }catch(error){
            res.status(500).json({error: error});
            return;
        };

    };
/*---------------------------------------------------------------------------------*/
    static async getAllPeticoes(req,res,next){
        console.log("Get Petição Controller.");
        try{
            
            const peticoes = await PeticaoModel.getAllPeticoes();
            if(!peticoes){
                res.status(400).json('Não foi encontrada nenhuma petição.');
                return;
            };
            res.status(200).json(peticoes);
        }catch(error){
            res.status(500).json({error: error});
            return;
        };
    }
/*---------------------------------------------------------------------------------*/
    static async incluirPeticao(req,res,next){
        console.log('Incluir petição Controller: ', req.body);
        const {error, value } = schemaPeticao.validate(req.body);
        
        try{
            const token = req.headers['x-access-token']
            
            jwt.verify(token,SECRET, (err, decoded) =>{
                if(err){
                    throw new Error("Usuario não autorizado, autenticação necessária.");
                } 
                req.userId = decoded.userId;
               
                
            });
        }catch(error){
            res.status(401).json(error.message);
            return;
        };
        if (error){
            const result = {
                msg:'Petição não inlcuída. Os campos não foram preenchidos corretamente.',
                error: error.details
            }
            res.status(404).json(result);
            return;
        };
        try{
            req.body.criadoPor = req.userId;
            const peticaoIncluida = await PeticaoModel.addPeticao(req.body);
            res.status(200).json(peticaoIncluida);

        }catch(error){
            res.status(500).json({error: error});
        }
    };
/*---------------------------------------------------------------------------------*/
    static async alterarPeticao(req,res,next){
        console.log("Alterar petição controller");
        try{
            const token = req.headers['x-access-token']
            
            jwt.verify(token,SECRET, (err, decoded) =>{
                if(err){
                    throw new Error("Usuario não autorizado, autenticação necessária.");
                } 
                req.userId = decoded.userId;
            });
        }catch(error){
            res.status(401).json(error.message);
            return;
        };
        try{
            req.body.criadoPor = req.userId;
            const peticaoAtualizada = await PeticaoModel.alterarPeticao(req.params.id, req.body);
            res.status(200).json(peticaoAtualizada);
        }catch(error){
            console.log("Erro ao Atualizar >>> ", error);
            res.status(500).json({error:error});
        }
    };
/*---------------------------------------------------------------------------------*/
    static async apagarPeticao(req,res,next){
        console.log("Apagar petição controller");
        try{
            const token = req.headers['x-access-token']
            
            jwt.verify(token,SECRET, (err, decoded) =>{
                if(err){
                    throw new Error("Usuario não autorizado, autenticação necessária.");
                } 
                req.userId = decoded.userId;
            });
        }catch(error){
            res.status(401).json(error.message);
            return;
        };
        try{
            const peticaoApagada = await PeticaoModel.apagarPeticao(req.params.id, req.userId);
            console.log("Petição apagada>>::",peticaoApagada);
            if(peticaoApagada.value == null){
                throw new Error('Erro ao apagar petição');
            }else{
                
                const ass = await PeticaoModel.deleteAssinaturas(req.params.id);
            }
            
            res.status(200).json(peticaoApagada);
        }catch(error){
            console.log("Erro ao apagar petição >>>", error);
            res.status(500).json({error:error});
        };
    }
/*---------------------------------------------------------------------------------*/
    static async assinarPeticao(req,res,next){
        console.log('Assinar petição Controller: ', req.body);
        try{
            const token = req.headers['x-access-token']
            
            jwt.verify(token,SECRET, (err, decoded) =>{
                if(err){
                    throw new Error("Usuario não autorizado, autenticação necessária.");
                } 
                req.userId = decoded.userId;
            });
        }catch(error){
            res.status(401).json(error.message);
            return;
        };
        const {error, value } = schemaAssinatura.validate(req.body);
        if (error){
            const result = {
                msg:'A petição não foi assinada. Os campos não foram preenchidos corretamente.',
                error: error.details
            }
            res.status(500).json(result);
            return;
        }
        try{
            const assinatura = await PeticaoModel.assinarPeticao(req.body);
            res.status(200).json(assinatura);

        }catch(error){
            res.status(500).json({error: error});
        }
    };
/*---------------------------------------------------------------------------------*/
    static async autenticarUsuario(req, res, next){
        console.log('Autenticar usuario Controller: ', req.body);
        try{
            let user = req.body
            const usuario = await PeticaoModel.autenticarUsuario(user.email,user.password);
            if(!usuario){
                res.status(400).json('Usuário não autenticado');
                return;
            }
            const token = jwt.sign({userId: usuario.email},SECRET, {expiresIn: 300});

            res.status(200).json({auth: true, token});
            
        }catch(error){
            console.log(error);
            res.status(500).json({error: error})
            console.log(error);
        }
    };

        
}



