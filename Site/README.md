# Experiência Criativa — Explorando Computação e IA

Site interativo feito em **HTML, CSS e JavaScript puro** para a disciplina
*Experiência Criativa: Explorando Computação e IA*.

## Sobre as imagens

As fotografias do site vêm do **Lorem Picsum** (`picsum.photos`), um serviço gratuito que distribui
fotos reais do Unsplash sob licença livre de uso — por isso elas já estão prontas no `index.html`,
sem precisar baixar nada. Se quiser troclas por fotos próprias, basta substituir o `src` de qualquer
`<img>` por `assets/sua-imagem.jpg` e colocar o arquivo na pasta `assets/`.

## O que tem no site

| Seção | O que faz |
|---|---|
| **Hero** | Rede de pontos generativa em `<canvas>` que reage ao mouse |
| **Sobre** | Texto de apresentação do projeto |
| **Galeria generativa** | 4 sketches algorítmicos (campo de fluxo, árvore recursiva, autômato celular, órbitas) — clique para gerar de novo |
| **Som** | Sequenciador de 16 passos sintetizado com a Web Audio API (sem arquivos de áudio) |
| **Vídeo** | `<video>` pronto para receber seu arquivo, com animação de espera caso o arquivo não exista |
| **Laboratório** | Tela de desenho livre onde cada traço também toca uma nota |

## Estrutura de arquivos

```
site/
├── index.html
├── style.css
├── script.js
├── assets/              ← coloque aqui suas imagens, vídeo e áudio
└── README.md
```

## Como personalizar

- **Imagens próprias**: na seção Galeria, troque `<canvas></canvas>` por
  `<img src="assets/sua-imagem.jpg" alt="...">` dentro do `<figure>`.
- **Vídeo próprio**: coloque o arquivo em `assets/video-processo.mp4`
  (mesmo nome já referenciado no `<source>` do `index.html`).
- **Áudio gravado**: se quiser usar um arquivo de áudio em vez do som sintetizado,
  adicione um `<audio src="assets/sua-musica.mp3" controls></audio>` na seção `#som`.
- **Cores e fontes**: edite as variáveis no topo do `style.css` (`:root { ... }`).

## Como rodar no VS Code

1. Abra a pasta `site` no VS Code (`File → Open Folder...`).
2. Instale a extensão **Live Server** (Ritwick Dey).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.
4. O site abre no navegador e atualiza automaticamente a cada salvamento.

## Como publicar no GitHub Pages

```bash
# dentro da pasta do projeto
git init
git add .
git commit -m "primeira versão do site da disciplina"

# crie um repositório vazio no GitHub antes deste passo
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

Depois, no GitHub:

1. Vá em **Settings → Pages**.
2. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
3. Salve. Em alguns minutos o site estará em:
   `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`

## Tecnologias

- HTML5 semântico
- CSS3 (variáveis, grid, animações)
- JavaScript (Canvas API, Web Audio API) — sem frameworks ou bibliotecas externas
- Fontes: Space Grotesk, IBM Plex Sans, JetBrains Mono (Google Fonts)
