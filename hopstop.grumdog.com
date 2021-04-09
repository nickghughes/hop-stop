server {
    listen 80;
    listen [::]:80;

    server_name hopstop.grumdog.com;

    location /api/v1/ {
        proxy_pass http://localhost:4795;
    }
    
    location /socket {
        proxy_pass http://localhost:4795;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";	 	 
    }

    location / {
        root /home/hopstop/hop-stop/web-ui/build;
        index index.html;
        try_files $uri /index.html;	 
    }
}
