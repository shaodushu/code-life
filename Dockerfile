# 构建服务运行环境
FROM nginx:1.21.0-alpine as producer
#通过 --form 参数可以引用 builder 阶段生成的产物，将其复制到 /usr/share/nginx/html
COPY . /usr/share/nginx/html

### docker build --rm -f "Dockerfile" -t code-life:latest .
### docker run --rm --name code-life-nginx -p 8080:80 code-life:latest

# sudo service docker start
# docker-compose up