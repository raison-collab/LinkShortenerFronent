# Link Shortener Vue

Веб-клиент для сервиса сокращения ссылок, созданный с использованием Vue 3, Vite и Pinia.

## Архитектура и Технологии

Проект представляет собой одностраничное приложение (SPA), разработанное на **Vue 3** с использованием синтаксиса `<script setup>`.

- **Сборка**: **Vite** используется как основной инструмент для сборки и разработки, обеспечивая быструю горячую перезагрузку (HMR).
- **Управление состоянием**: **Pinia** выбрана в качестве официальной библиотеки управления состоянием для Vue 3.
- **Стилизация**: **TailwindCSS** применяется для утилитарного подхода к стилизации, что позволяет быстро создавать адаптивные интерфейсы.
- **HTTP-клиент**: **Axios** используется для выполнения запросов к бэкенду.
- **Роутинг**: **Vue Router** управляет навигацией на стороне клиента.

## Запуск проекта

### Локальная разработка

1.  **Установите зависимости**:
    ```sh
    npm install
    ```

2.  **Запустите сервер для разработки**:
    ```sh
    npm run dev
    ```
    Приложение будет доступно по адресу `http://localhost:5173`.

### Запуск с помощью Docker

Для запуска проекта в контейнере используется Docker и Docker Compose.

1.  **Создайте файл `.env`**:
    Скопируйте `.env.example` в `.env` и при необходимости измените значения.
    ```sh
    cp .env.example .env
    ```
    > **Важно:** Переменная `VITE_API_URL` должна содержать URL вашего бэкенд-сервера. Vite требует, чтобы переменные окружения, доступные на клиенте, начинались с префикса `VITE_`.

2.  **Запустите контейнер**:
    Вы можете использовать скрипт `restart_cluster.sh` для автоматизации процесса.
    ```sh
    chmod +x restart_cluster.sh
    ./restart_cluster.sh
    ```
    Или выполнить команды вручную:
    ```sh
    docker compose down
    docker compose up -d --build
    ```

3.  **Подключение к прокси-сети (опционально)**:
    Если вы используете обратный прокси (например, Traefik), скрипт `restart_cluster.sh` автоматически подключит контейнер к сети, указанной в переменной `DOCKER_NETWORK_PROXY` в вашем `.env` файле.

Приложение будет доступно по адресу `http://localhost:8080`.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
