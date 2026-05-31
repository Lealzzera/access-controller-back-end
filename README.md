# Access Controller API

Backend NestJS com Prisma, PostgreSQL, Socket.IO e S3.

## Rodando localmente

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

2. Preencha as variaveis do `.env`.

3. Suba o banco e a API com Docker Compose:

```bash
docker compose up --build
```

4. Teste a rota de saude:

```bash
curl http://localhost:3000/api/health
```

Ela deve responder algo como:

```json
{
  "status": "ok",
  "uptime": 12.34,
  "timestamp": "2026-05-30T00:00:00.000Z"
}
```

## Deploy recomendado na AWS

A opcao mais simples para este backend em AWS e:

- Amazon ECS Express Mode/Fargate para rodar o container NestJS.
- Amazon RDS PostgreSQL para o banco.
- Amazon ECR para guardar a imagem Docker.
- Amazon S3 para as imagens, como o codigo ja usa hoje.
- Amplify continua hospedando o frontend.

## Variaveis de ambiente de producao

Cadastre estas variaveis no servico ECS:

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@RDS_HOST:5432/DATABASE_NAME
JWT_SECRET=change-me-to-a-long-random-secret
ACCESS_CONTROLLER_FRONT_END=https://your-amplify-domain.amplifyapp.com
AWS_REGION=sa-east-1
AWS_BUCKET_NAME=your-s3-bucket-name
```

Em producao, prefira dar permissao de S3 pela IAM Role da task ECS em vez de cadastrar `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`.

## Passo a passo de deploy

### 1. Criar o RDS PostgreSQL

Crie uma instancia PostgreSQL no RDS. Use acesso publico desativado e salve host, porta, usuario, senha e nome do banco.

Depois monte a `DATABASE_URL`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@RDS_HOST:5432/DATABASE_NAME
```

### 2. Criar o repositorio no ECR

```bash
aws ecr create-repository --repository-name access-controller-api
```

### 3. Buildar e enviar a imagem

Entre na pasta do backend e rode:

```bash
docker build -t access-controller-api .
docker tag access-controller-api:latest ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/access-controller-api:latest
docker push ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/access-controller-api:latest
```

Antes do `docker push`, faca login no ECR pelo comando indicado pelo proprio console da AWS.

### 4. Criar o servico no ECS

No ECS Express Mode/Fargate:

- Imagem: `ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/access-controller-api:latest`
- Porta do container: `3000`
- Health check path: `/api/health`
- VPC: a mesma VPC do RDS
- Variaveis de ambiente: as listadas acima

O Dockerfile ja executa:

```bash
npx prisma migrate deploy && node dist/main
```

Ou seja, as migrations do Prisma sobem automaticamente quando o container inicia.

### 5. Liberar o banco para a API

No Security Group do RDS, libere entrada na porta `5432` somente a partir do Security Group do servico ECS.

### 6. Permitir acesso ao S3

Na IAM Role da task ECS, permita acesso ao bucket:

```json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
  "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
}
```

### 7. Atualizar o frontend no Amplify

No Amplify, cadastre:

```env
BACKEND_URL=https://api.your-domain.com/api/v1
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com
```

`BACKEND_URL` e usado pelas server actions REST. `NEXT_PUBLIC_BACKEND_URL` e usado pelo Socket.IO em `/solicitations`.

### 8. Testar producao

Depois do deploy, teste:

```bash
curl https://api.your-domain.com/api/health
```

Se responder `status: ok`, o container esta saudavel e pronto para receber trafego.
