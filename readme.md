# news_site
News site project on javascript, react, vite

## Deployed site on github pages
[Gihub-Pages](https://grisha765.github.io/news_site/)

## Self-deployment
- **Install npm libs**:
    ```bash
    cd web/ &&\
    npm install
    ```

- **Run frontend**:
    ```bash
    npm run dev
    ```

- **Install python libs**:
    ```bash
    python3 -m venv .venv &&\
    .venv/bin/python -m pip install -r requirements.txt
    ```

- **Run backend**:
    ```bash
    .venv/bin/python back
    ```

    - **Other working env's**:
        ```env
        LOG_LEVEL='DEBUG'
        API_IP='0.0.0.0'
        API_PORT='8000'
        DB_PATH='sqlite://:memory:'
        TESTS='True'
        ```
