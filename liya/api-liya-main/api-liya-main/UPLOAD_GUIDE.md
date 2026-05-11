# Upload de Arquivos - Sistema de Disparos

## Configuração do MinIO

### Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
BUCKET_NAME=seu-bucket-name
S3_ACCESS_KEY=sua-access-key
S3_SECRET_KEY=sua-secret-key
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
```

### Instalação do MinIO (Desenvolvimento)

Para ambiente de desenvolvimento, você pode usar Docker:

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

Acesse o console em: http://localhost:9001
- Usuário: minioadmin
- Senha: minioadmin

## Como Usar a API

### Criar Disparo com Arquivos

```bash
curl -X POST http://localhost:3000/api/disparos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "message=Mensagem do disparo" \
  -F "scheduledAt=2024-12-31T12:00:00Z" \
  -F "instance=instancia-whatsapp" \
  -F "filter={\"statusId\":[\"uuid1\",\"uuid2\"],\"source\":[\"FACEBOOK\",\"GOOGLE\"]}" \
  -F "status=agendado" \
  -F "image=@caminho/para/imagem.jpg" \
  -F "video=@caminho/para/video.mp4"
```

### Atualizar Disparo com Novos Arquivos

```bash
curl -X PUT http://localhost:3000/api/disparos/DISPARO_ID \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "message=Nova mensagem" \
  -F "image=@nova/imagem.jpg"
```

### Resposta da API

```json
{
  "id": "uuid-do-disparo",
  "message": "Mensagem do disparo",
  "imageKey": "disparos/images/uuid-da-imagem.jpg",
  "videoKey": "disparos/videos/uuid-do-video.mp4",
  "imageUrl": "https://minio-url/bucket/file?presigned-params",
  "videoUrl": "https://minio-url/bucket/file?presigned-params",
  "scheduledAt": "2024-12-31T12:00:00Z",
  "instance": "instancia-whatsapp",
  "filter": {
    "statusId": ["uuid1", "uuid2"],
    "source": ["FACEBOOK", "GOOGLE"]
  },
  "status": "agendado",
  "createdAt": "2024-09-13T10:00:00Z",
  "updatedAt": "2024-09-13T10:00:00Z"
}
```

## Funcionalidades Implementadas

### Upload de Arquivos
- **Tipos suportados**: Imagens (JPEG, PNG, GIF, WebP) e Vídeos (MP4, MPEG, MOV, AVI, WebM)
- **Tamanho máximo**: 50MB por arquivo
- **Armazenamento**: MinIO com estrutura organizada em pastas

### URLs Pré-assinadas
- **Validade**: 7 dias
- **Segurança**: URLs temporárias que expiram automaticamente
- **Performance**: Acesso direto aos arquivos sem passar pela API

### Gerenciamento de Arquivos
- **Upload**: Automático ao criar/atualizar disparos
- **Substituição**: Arquivos antigos são deletados ao fazer upload de novos
- **Limpeza**: Arquivos são removidos quando o disparo é deletado

## Estrutura de Pastas no MinIO

```
bucket-name/
├── disparos/
│   ├── images/
│   │   ├── uuid1.jpg
│   │   ├── uuid2.png
│   │   └── ...
│   └── videos/
│       ├── uuid1.mp4
│       ├── uuid2.mov
│       └── ...
```

## Campos do Modelo Atualizado

- `imageKey`: Chave do arquivo de imagem no MinIO (substitui `imageUrl`)
- `videoKey`: Chave do arquivo de vídeo no MinIO (substitui `videoUrl`)
- `imageUrl`: URL pré-assinada gerada dinamicamente para o frontend
- `videoUrl`: URL pré-assinada gerada dinamicamente para o frontend

## Migração de Dados

Se você já possui dados com `imageUrl` e `videoUrl`, será necessário:

1. Fazer download dos arquivos das URLs existentes
2. Fazer upload para o MinIO
3. Atualizar os registros com as novas chaves
4. Remover as colunas antigas do banco de dados

## Tratamento de Erros

- **Arquivo muito grande**: Retorna erro 400 com mensagem específica
- **Tipo não suportado**: Retorna erro 400 com tipos aceitos
- **Erro no MinIO**: Retorna erro 500, arquivo não é salvo no banco
- **Arquivo não encontrado**: URL pré-assinada retorna string vazia