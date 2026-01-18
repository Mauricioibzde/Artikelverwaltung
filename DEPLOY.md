# 🚀 Guia de Deploy (Colocar na Nuvem)

Para deixar seu site online para todo mundo acessar (não apenas no seu computador), você pode usar o **Render** (é gratuito e fácil).

## 1. Preparar o Código (Já fiz isso para você!)
Atualizei seu código para:
- O backend agora "serve" o site (frontend).
- A porta do servidor se ajusta automaticamente.
- Os endereços de API agora são relativos (`/api/products` em vez de `http://localhost...`).

## 2. Salvar no GitHub
Seu código precisa estar no GitHub para o Render "puxar" ele de lá.
1. Crie uma conta no [GitHub](https://github.com/).
2. Crie um novo repositório (ex: `artikelverwaltung`).
3. No terminal do VS Code, rode os comandos:
```bash
git init
git add .
git commit -m "Meu projeto pronto para deploy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/artikelverwaltung.git
git push -u origin main
```
*(Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub)*.

## 3. Publicar no Render
1. Crie uma conta no [Render.com](https://render.com/).
2. Clique em **"New +"** e escolha **"Web Service"**.
3. Conecte sua conta do GitHub e selecione o repositório `artikelverwaltung` que você acabou de criar.
4. Preencha as configurações:
   - **Name**: `artikelverwaltung` (ou outro nome único)
   - **Region**: Escolha a mais próxima (ex: Frankfurt é boa para Europa).
   - **Branch**: `main`
   - **Root Directory**: Deixe em branco (ou `.` ).
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Free Tier**: Selecione a opção "Free".
5. Clique em **Create Web Service**.

O Render vai começar a instalar e "deployar". Em alguns minutos, ele te dará uma URL (ex: `https://artikelverwaltung.onrender.com`).
Esse é o link que você pode enviar para seus amigos! 🎉

## 4. Configurar Permissão do Banco de Dados (Importante!)
Se aparecer um erro de `SSL alert` ou `MongoNetworkError` no Render, é porque o MongoDB Atlas bloqueou o acesso do servidor. Para corrigir:

1. Acesse seu painel no [MongoDB Atlas](https://cloud.mongodb.com/).
2. No menu lateral, clique em **Network Access** (em "Security").
3. Clique no botão **+ Add IP Address**.
4. Clique em **Allow Access from Anywhere** (Isso preenche `0.0.0.0/0`).
5. Clique em **Confirm**.

O Render usa IPs dinâmicos, então essa configuração é necessária para ele conseguir conectar no seu banco.

## Observação sobre o Banco de Dados
Como você está usando o **MongoDB Atlas** (na nuvem), ele vai funcionar perfeitamente tanto no seu computador local quanto no Render. Não precisa mudar nada!
