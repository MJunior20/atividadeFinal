const app = require('../index');
const supertest = require('supertest');
const { string } = require('joi');

const usuario = { email: "maurilio.junior",
  senha: "1234"
}

describe('peticao', () => {
    describe('Rotas Get petição', () => {
      describe('Get todas petições', () => {
        it('Deverá retornar 200', async () => {
          await supertest(app).get('/api/peticoes').expect(200);
        });
      });
      describe('Get petição por titulo inexistente', () => {
        it('Deverá retornar 404', async () => {
          await supertest(app).get('/api/peticao/teste incorreto').expect(404);
        });
      });
      describe('Get petição por titulo', () => {
        it('Deverá retornar 200', async () => {
          await supertest(app).get('/api/peticao/alteração teste 5 Feedback').expect(200);
        });
      });
    });
});


describe('apagaPeticao', () => {
  beforeEach(() =>{
  jest.setTimeout(60000);
  })
  describe('apagaPeticaoAPI', () => {
    it('Deverá retornar 200', async () => {
        await supertest(app).delete(`/api/peticoes/638e2082078975f6399739ed`).expect(200);
    });
  });

  describe('Se a petição não existir', () => {
    it('deverá retornar 500', async () => {
        await supertest(app).delete('/api/peticoes/15').expect(500);
    });
  });

});

const peticao = { titulo: "superteste",
direcionamento: "superteste",
conteudo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
dataCriacao: "Campinas, 26 de novembro 2022."
};

describe('Post Petição', () => {
  describe('Adicionar Petição', () => {
    it('Deverá retornar 200', async () => {
      const {statusCode, body} = await (await supertest(app).post(`/api/peticoes/`)).send(peticao);
      expect(statusCode).toBe(200);
      expect(body).tobe(
          {
            "acknowledged": true,
            "insertedId": expect.any(string)
          }
      );
    });
  });
  
});

const assinatura = { peticaoId: "6382b986455b52aa8a9d85fb",
    tituloPeticao: "superteste", 
    nome: "alteração teste 5 Feedback"
};

const assinaturaIncorreta = {};

describe('Assinar Peticao', () => {
  
  describe('Assinar Petição', () => {
    it('Deverá retornar 200', async () => {
      const {statusCode, body} = await (await supertest(app).post(`/api/assinarPeticao`)).send(assinatura);
      expect(statusCode).toBe(200);
      expect(body).tobe(
          {
            "acknowledged": true,
            "insertedId": expect.any(string)
          }
      );
    });
  });

  describe('Assinatura com campos invalidos', () => {
    it('deverá retornar 500', async () => {
      const {statusCode, body} = await (await supertest(app).post(`/api/assinarPeticao`)).send(assinaturaIncorreta);
      expect(statusCode).toBe(500);
    });
  });

});

const alterarPeticao = { titulo: "superteste",
direcionamento: "superteste",
conteudo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
dataCriacao: "Campinas, 26 de novembro 2022."
};

describe('Alteração de Peticao', () => {
  
  describe('Alterar Petição', () => {
    it('Deverá retornar 200', async () => {
      const {statusCode, body} = await (await supertest(app).put(`/api/assinarPeticao/638cfb8a2dfd79a33d041dcf`)).send(alterarPeticao);
      expect(statusCode).toBe(200);
      expect(body).tobe(
          {
            "titulo": expect.any(string),
            "direcionamento": expect.any(string),
            "conteudo": expect.any(string),
            "dataCriacao": expect.any(string)
          }
      );
    });
  });

  describe('Alterar petição com campos invalidos', () => {
    it('deverá retornar 500', async () => {
      const {statusCode, body} = await (await supertest(app).post(`/api/assinarPeticao/`)).send(assinaturaIncorreta);
      expect(statusCode).toBe(500);
    });
  });

});
