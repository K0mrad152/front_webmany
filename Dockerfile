FROM nginx:alpine

# Копируем собранный проект из предыдущей стадии
COPY /dist /usr/share/nginx/html

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
