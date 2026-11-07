# Aether NFT Marketplace — versão fácil de executar

Projeto demonstrativo de marketplace de NFTs feito com React, TypeScript e Vite.

## Requisitos
- Windows, macOS ou Linux
- Node.js LTS instalado: https://nodejs.org/
- VS Code (opcional, mas recomendado)

## Jeito mais fácil (Windows)
1. Extraia o arquivo ZIP.
2. Abra a pasta `aether-marketplace-facil`.
3. Dê dois cliques em `start.bat`.
4. Aguarde a instalação automática das dependências.
5. Abra no navegador o endereço mostrado no terminal (normalmente http://localhost:5173).

## Pelo terminal / VS Code
Na pasta do projeto, execute:

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## O que já funciona
- Catálogo com pesquisa e filtro por categoria.
- Ordenação por preço.
- Favoritos salvos no navegador.
- Carrinho com inclusão, remoção e alteração de quantidade.
- Cupom demonstrativo `AETHER10`.
- Checkout simulado e confirmação de pedido.
- Login demonstrativo.
- Persistência local do carrinho e favoritos após atualizar a página.
- Layout adaptável para celular e computador.

## Acesso demonstrativo
Use qualquer e-mail válido e qualquer senha com pelo menos 4 caracteres. A autenticação é apenas demonstrativa e fica salva no navegador.

## Importante
Esta versão prioriza instalação e execução simples. Catálogo, login e pagamento usam dados locais; não há backend real, blockchain, integração real com carteiras, Socket.IO, MSW, TanStack Query/Router, Axios ou testes Playwright nesta edição simplificada. Portanto, ela é adequada para demonstração e evolução local, mas ainda não atende integralmente ao desafio técnico original. Para a avaliação final, essas integrações precisam ser implementadas.
