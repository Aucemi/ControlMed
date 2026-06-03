# ControlMed 💊

Aplicativo mobile desenvolvido em React Native para auxiliar pacientes e cuidadores no controle de medicamentos, horários de administração e acompanhamento de tratamentos contínuos.

---

## Objetivo

O ControlMed tem como objetivo ajudar pacientes e cuidadores a organizarem o uso correto dos medicamentos, permitindo:

* Cadastro de pacientes
* Cadastro de medicamentos
* Controle de horários
* Controle de estoque
* Controle de validade
* Controle do período de tratamento
* Alertas automáticos
* Notificações para lembrar a hora da medicação

---

## Tecnologias Utilizadas

* React Native
* Expo
* TypeScript
* Axios
* React Navigation
* MockAPI
* Expo Notifications

---

## Funcionalidades

### Pacientes

* Adicionar paciente
* Editar paciente
* Remover paciente

### Medicamentos

* Adicionar medicamento
* Editar medicamento
* Remover medicamento
* Marcar como tomado
* Desfazer medicamento tomado

### Alertas

* Medicamento vencido
* Estoque baixo
* Medicamento pendente
* Fim de tratamento próximo

### Notificações

* Lembrete automático no horário configurado para o medicamento

---

## Estrutura do Projeto

```txt
src/
├── components/
├── navigation/
├── screens/
├── services/
├── types/
```

---

# Como Executar o Projeto

## 1. Pré-requisitos

Antes de rodar o projeto, é necessário ter instalado:

### Node.js

Instale a versão LTS do Node.js.

### Expo Go

Para testar no celular, instale o aplicativo **Expo Go**:

* Android: Google Play Store
* iOS: App Store

---

## Versão do Expo

Este projeto foi desenvolvido utilizando:

* Expo SDK 54
* React Native (compatível com SDK 54)
* Expo Go SDK 54

Caso esteja utilizando Expo Go em um dispositivo móvel, verifique se a versão instalada é compatível com o SDK do projeto.

Para conferir a versão do SDK utilizada:

```bash
npx expo config --type public
```

ou consulte o arquivo:

```txt
package.json
```

---

## 2. Instalar as Dependências

Dentro da pasta do projeto, execute:

```bash
npm install
```

Esse comando instala todas as bibliotecas necessárias com base no arquivo `package.json`.

---

## 3. Configurar o MockAPI

O projeto utiliza o **MockAPI** como API externa para armazenar os dados de pacientes e medicamentos.

O projeto já está configurado para utilizar uma instância do MockAPI para fins de demonstração.

Caso deseje utilizar sua própria base de dados, altere a URL no arquivo:

```txt
src/services/api.ts
```

Acesse:

```txt
https://mockapi.io
```

Crie uma conta ou faça login.

Depois crie um projeto no MockAPI, por exemplo:

```txt
ControlMed API
```

O plano gratuito do MockAPI permite apenas duas collections. Para este projeto, crie:

```txt
patients
medications
```

---

## 4. Collection patients

Crie a collection:

```txt
patients
```

Campos esperados:

```json
{
  "name": "Maria Silva",
  "age": 72,
  "relationship": "Mãe"
}
```

O campo `id` será gerado automaticamente pelo MockAPI.

Exemplo de registro completo:

```json
{
  "id": "1",
  "name": "Maria Silva",
  "age": 72,
  "relationship": "Mãe"
}
```

---

## 5. Collection medications

Crie a collection:

```txt
medications
```

Campos esperados:

```json
{
  "patientId": "1",
  "name": "Losartana",
  "dosage": "50mg",
  "time": "08:00",
  "stock": 30,
  "expirationDate": "2026-12-01",
  "treatmentEndDate": "2026-12-31",
  "taken": false,
  "notificationId": ""
}
```

O campo `id` será gerado automaticamente pelo MockAPI.

Exemplo de registro completo:

```json
{
  "id": "1",
  "patientId": "1",
  "name": "Losartana",
  "dosage": "50mg",
  "time": "08:00",
  "stock": 30,
  "expirationDate": "2026-12-01",
  "treatmentEndDate": "2026-12-31",
  "taken": false,
  "notificationId": ""
}
```

---

## 6. Configurar a URL da API no Projeto

Após criar o projeto no MockAPI, copie a URL base da API.

Exemplo:

```txt
https://SEU_PROJETO.mockapi.io
```

ou:

```txt
https://SEU_PROJETO.mockapi.io/api/v1
```

Abra o arquivo:

```txt
src/services/api.ts
```

Configure a URL no `baseURL`:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "COLE_A_URL_DO_SEU_MOCKAPI_AQUI",
});
```

Exemplo:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://SEU_PROJETO.mockapi.io/api/v1",
});
```

As rotas utilizadas pelo app são:

```txt
/patients
/medications
```

---

## 7. Rodar o Projeto

Depois de instalar as dependências e configurar o MockAPI, execute:

```bash
npx expo start
```

Se quiser limpar o cache do Expo, use:

```bash
npx expo start -c
```

---

## 8. Abrir no Celular

Com o Expo rodando:

1. Abra o aplicativo Expo Go no celular;
2. Escaneie o QR Code mostrado no terminal ou navegador;
3. Aguarde o projeto carregar.

---

## 9. Executar no Navegador

Caso queira testar pelo navegador, pressione:

```txt
w
```

no terminal onde o Expo está rodando.

---

## 10. Possíveis Problemas

### Erro de dependências

Execute novamente:

```bash
npm install
```

### Erro no Expo Go

Pare o projeto com:

```txt
Ctrl + C
```

Depois rode:

```bash
npx expo start -c
```