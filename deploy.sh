echo "Iniciando Deploy..."

docker-compose -f docker-compose.prod.yml pull

docker-compose -f docker-compose.prod.yml up -d

docker image prune -f

echo "Deploy concluído com sucesso!"