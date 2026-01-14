create table public.order_items_aud
(
    id         bigint  not null,
    rev        integer not null
        constraint fkp1dp41jyq8k6shc0icihxxvw7
            references public.revinfo,
    revtype    smallint,
    created_at timestamp(6),
    notes      text,
    quantity   integer,
    ready_at   timestamp(6),
    served_at  timestamp(6),
    status     varchar(20),
    subtotal   numeric(10, 2),
    unit_price numeric(10, 2),
    order_id   bigint,
    product_id bigint,
    primary key (rev, id)
);

alter table public.order_items_aud
    owner to postgres;

