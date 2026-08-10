create table cliente (
id SERIAL PRIMARY KEY,
nome varchar(100),
preco varchar(100)
);

create table produtos(
id serial primary key,
nome varchar(100),
preco varchar(100)
);

create table pedidos(
id serial primary key,
nome varchar(100),
preco decimal(10, 2)
);

Tabela Intermediária
CREATE TABLE pedido_produtos (
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade INT DEFAULT 1,
    PRIMARY KEY (pedido_id, produto_id)
);
