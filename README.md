# AgendaFlow — FrontEnd da Atividade 3

FrontEnd em React Native + Expo SDK 57 para um ecossistema de microsserviços de **agendamento de serviços**.

## Tema
O AgendaFlow permite autenticação, consulta de serviços, escolha de data/horário, criação de agendamento e acompanhamento de status.

O tema foi escolhido para evitar o cenário proibido de controle de estoque.

## Requisitos refletidos no FrontEnd
- React Native / Expo
- Login e cadastro
- Roles `ADMIN` e `COMUM`
- Consumo de APIs HTTP por um API Gateway
- API de autenticação
- API de serviços
- API de agendamentos
- Status assíncrono `PROCESSANDO -> CONFIRMADO`
- `Idempotency-Key` na criação do agendamento
- Tela de acompanhamento com polling
- Cenário de concorrência: dois usuários podem tentar o mesmo horário
- Modo mock para demonstrar o fluxo antes do backend ficar pronto

## Responsabilidades do Backend
RabbitMQ, transação no banco (H2 ou MongoDB), regras de disponibilidade, bloqueio do horário, concorrência, Gateway e implementação real dos microsserviços ficam no Backend Spring Boot.

O FrontEnd **não conecta diretamente ao RabbitMQ**. Ele envia/consulta os agendamentos via API do Gateway.

## Contrato sugerido para o Backend
- `POST /auth/login`
- `POST /auth/register`
- `GET /servicos?ativo=true`
- `GET /servicos/{id}`
- `GET /servicos/{id}/horarios?data=YYYY-MM-DD`
- `POST /servicos` (ADMIN)
- `POST /agendamentos` (clienteId, serviceId, slotId, data, hora)
- `GET /agendamentos/{id}`
- `GET /agendamentos?clienteId={id}`

### Exemplo de criação
```json
{
  "clienteId": "u-10",
  "serviceId": "s1",
  "slotId": "s1-2026-09-27-0",
  "data": "2026-09-27",
  "hora": "09:00"
}
```

O Backend deve receber também o `Idempotency-Key` HTTP enviado pelo Front.

## Mensageria esperada
1. Front envia `POST /agendamentos` para o Gateway.
2. API de agendamentos registra a solicitação como `PROCESSANDO`.
3. Backend publica uma mensagem RabbitMQ, por exemplo `AGENDAMENTO_SOLICITADO`.
4. Serviço consumidor verifica disponibilidade e executa a transação.
5. O agendamento passa para `CONFIRMADO` ou `CANCELADO`.
6. Front consulta `GET /agendamentos/{id}` até visualizar o novo status.

## Concorrência
O mesmo horário pode ser disputado por requisições simultâneas. A garantia de que somente uma reserva será confirmada deve ser feita no Backend com transação e mecanismo de concorrência apropriado.

## Rodar em modo mock
Crie `.env` a partir de `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api
EXPO_PUBLIC_MOCK_MODE=true
```

Depois:

```bash
npm install
npx expo start -c
```

No mock, qualquer e-mail/senha entra. Para testar perfil admin, use um e-mail contendo `admin`.

## Quando o Backend estiver pronto
Troque:

```env
EXPO_PUBLIC_MOCK_MODE=false
```

E aponte `EXPO_PUBLIC_API_URL` para o Gateway real.

### Observação de rede
- Android Emulator: `10.0.2.2` aponta para o computador host.
- Celular físico: use o IP LAN do computador, como `http://192.168.0.15:8080/api`.

## Atualização visual
- Identidade visual renovada para o AgendaFlow com fundo claro, roxo principal, verde de confirmação e cartões elevados.
- Home com hero, categorias em chips e cards de serviço mais visuais.
- Login/cadastro redesenhados com marca, hierarquia visual e cards.
- Agenda com blocos de data, status e acesso ao acompanhamento.
- Fluxo de reserva com seletor de datas, horários em grade e aviso de concorrência.
- Acompanhamento com timeline visual do processamento assíncrono.
- Perfil e painel administrativo reorganizados em cartões e seções.
