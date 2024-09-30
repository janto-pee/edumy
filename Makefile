postgres:
	docker run --name postgres12 -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:12-alpine

createdb:
	docker exec -it postgres12 createdb --username=root --owner=root HLS

dropdb:
	docker exec -it postgres12 dropdb HLS

migrateup:
	migrate -path server/db/migration -database "postgresql://root:secret@localhost:5432/HLS?sslmode=disable" -verbose up

migratedown:
	migrate -path server/db/migration -database "postgresql://root:secret@localhost:5432/HLS?sslmode=disable" -verbose down

sqlc:
	sqlc generate

.PHONY: postgres createdb dropdb migrateup migratedown generate