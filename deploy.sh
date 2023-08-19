ssh -i "~/Developer/blog.pem" ubuntu@ec2-43-200-204-95.ap-northeast-2.compute.amazonaws.com -t "mkdir blog mkdir blog/caddy"
scp -i "~/Developer/blog.pem" docker-compose.yml ubuntu@ec2-43-200-204-95.ap-northeast-2.compute.amazonaws.com:~/blog/docker-compose.yml
scp -i "~/Developer/blog.pem" caddy/Caddyfile ubuntu@ec2-43-200-204-95.ap-northeast-2.compute.amazonaws.com:~/blog/caddy/Caddyfile

docker build --platform linux/amd64 -t yeolyi1310/blog .
docker push yeolyi1310/blog

ssh -i "~/Developer/blog.pem" ubuntu@ec2-43-200-204-95.ap-northeast-2.compute.amazonaws.com -t "
    cd ~/blog
    docker-compose down
    docker-compose pull
    docker-compose up -d
"