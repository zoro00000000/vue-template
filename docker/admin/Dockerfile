# 基础镜像来自 https://coding.jd.com/hezaichang/centos6-nginx-nodejs10
FROM base_image

ADD . /opt/app/

WORKDIR  /opt/app

RUN npm set registry http://mirrors.jd.com/npm  \
    && npm install \
    && npm run b:test merchant-bd

COPY ./deploy/bd/bd.nginx.config /opt/nginx/conf/domains

# entrypoint 中开启sshd
ENTRYPOINT /usr/sbin/sshd && mkdir -p /dev/shm/nginx_temp/client_body && mkdir -p /export/logs && nginx -c /opt/nginx/conf/nginx.conf && sleep 9999999d