# @iobridge/ckb2eth

## Quick Start for Development

### Setup Database

```shell
pwd # /path/to/iobridge/packages/iobridge-ckb2eth
docker run --name IOBridgePostgre -p 5432:5432 -e POSTGRESD_DB=iobridge -e POSTGRES_USER=iobridge -e POSTGRES_PASSWORD=123456 -d postgres
export DATABASE_URL=postgresql://iobridge:123456@localhost:5432/iobridge
yarn run knex:migrate:list
# migrate to latest schema
# yarn run knex:migrate:latest
# yarn run knex:migrate:down
```
