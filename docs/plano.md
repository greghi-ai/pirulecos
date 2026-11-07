# Plano e decisões

## Peça única

- Toda peça tem estoque 1. Estados: `disponivel` → `reservada` → `vendida`.
- Ao entrar na sacola, a peça fica `reservada` por 15 minutos para aquela cliente. Se o prazo vence sem pagamento, volta a `disponivel` sozinha.
- A InfinitePay (Checkout Integrado) avisa o site por webhook; o site confirma com `payment_check` antes de marcar a peça como `vendida`.
- A peça vendida **continua visível** na vitrine, em cinza, com a faixa "VENDIDO".

## Pop-up de cadastro (primeira visita)

| Situação | O que acontece |
|---|---|
| Primeira visita | Aparece o convite: 10% na primeira compra + presente no aniversário |
| Cliente fechou | A escolha fica salva no navegador e o convite não aparece mais |
| Cliente se cadastrou | Fica logada ("lembrar de mim") e nunca mais vê o convite |

O login continua sempre acessível pelo ícone de conta no topo.

## Conta da família

- Cliente cadastra uma ou mais crianças com **nome, tamanho e data de aniversário**.
- Uma rotina diária gera um cupom único 7 dias antes do aniversário e envia por e-mail.
- Quando a loja publica uma peça, quem tem criança naquele tamanho recebe aviso (se aceitou).
- LGPD: caixa de consentimento e só os dados necessários. Nada de foto da criança.

## Cupons

| Cupom | Para quem | Valor |
|---|---|---|
| Primeira compra (`BEMVINDO10`) | Quem cria a conta | 10% (sugestão) |
| Frete grátis | Todo mundo | Acima de R$ [a definir] |
| Leve 3 | Todo mundo | [a definir]% |
| Aniversário da criança | Cadastrados, automático | [a definir]% |
| Cliente de casa | A cada [N] compras | [a definir]% |

Um cupom por compra.

## Pagamento e envio

- InfinitePay Checkout Integrado: Pix (taxa zero, aprovação imediata) e cartão em até 12x. A cliente paga na página segura da InfinitePay e volta para o site.
- Melhor Envio: cotação de PAC e SEDEX no carrinho e etiqueta mais barata que no balcão. A dona imprime e posta.
- Cada peça tem um "pacote" (pequeno, médio, grande) com peso e medidas para o frete.

## Painel da loja

Feito para o celular, em 4 passos: fotos → tamanho e estado → preço e pacote → publicar.

## A definir com a cliente

- Valores dos cupons e o mínimo para frete grátis
- Política de troca (o Código de Defesa do Consumidor garante 7 dias de arrependimento em compra online)
- Fotos reais das peças, Instagram e WhatsApp
- Investimento e prazo
