create table public.orders_aud
(
    id             bigint  not null,
    rev            integer not null
        constraint fkinujab7ljkelflu16c9jjch19
            references public.revinfo,
    revtype        smallint,
    completed_at   timestamp(6),
    created_at     timestamp(6),
    customer_name  varchar(100),
    discount       numeric(10, 2),
    notes          text,
    order_number   varchar(20),
    paid_at        timestamp(6),
    payment_method varchar(20),
    status         varchar(20),
    subtotal       numeric(10, 2),
    tax            numeric(10, 2),
    total          numeric(10, 2),
    updated_at     timestamp(6),
    table_id       bigint,
    waiter_id      bigint,
    primary key (rev, id)
);

alter table public.orders_aud
    owner to postgres;

