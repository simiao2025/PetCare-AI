# 🚀 PetCare AI

PetCare AI é uma plataforma mobile integrada que transforma a experiência de atendimento em clínicas veterinárias através de um assistente de IA humanizado via WhatsApp e um dashboard profissional.

## 📁 Estrutura do Projeto

```
/
├── backend/            # API Node.js/Fastify + PostgreSQL
│   ├── src/
│   │   ├── core/       # Entidades de domínio (Client, Pet, Appointment)
│   │   ├── infra/      # WhatsApp Handler, AI integrations
│   │   └── ...
│   ├── schema.sql      # Schema do Banco de Dados
│   └── ...
└── mobile/             # App React Native + WatermelonDB
    ├── src/
    │   ├── screens/    # Dashboard "One-thumb"
    │   ├── services/   # Auth Passkey/Biometria
    │   └── ...
    └── ...
```

## 🛠️ Configuração e Execução

### Pré-requisitos

- Node.js 20+
- PostgreSQL 16+
- Redis (para backend)
- Ambiente React Native configurado (Android Studio / Xcode)

### Backend

1. Instale as dependências:

   ```bash
   cd backend
   npm install
   ```

2. Configure o banco de dados:
   - Crie um banco PostgreSQL.
   - Execute o script `schema.sql` para criar as tabelas.

3. Inicie o servidor:
   ```bash
   npm run dev
   ```

### Mobile

1. Instale as dependências:

   ```bash
   cd mobile
   npm install
   ```

2. Execute o app:
   ```bash
   npm run android
   # ou
   npm run ios
   ```

## 🏗️ Arquitetura

- **Backend**: Fastify, Zod, PostgreSQL. Focado em performance e validação estrita.
- **Mobile**: Persistência offline-first com WatermelonDB, estado global com Zustand.
- **IA**: Classificador de intenções preparado para integração com Llama 3 vLLM.
- **Segurança**: Autenticação via Passkey/Biometria e compliance LGPD nativo.

---

**Status**: Semana 1 Completa ✅
