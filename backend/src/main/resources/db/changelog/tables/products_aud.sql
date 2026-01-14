create table public.products_aud
(
    id               bigint  not null,
    rev              integer not null
        constraint fkis5p0x6t8gvib9m5ra1fiybi3
            references public.revinfo,
    revtype          smallint,
    created_at       timestamp(6),
    updated_at       timestamp(6),
    description      text,
    image_url        varchar(255),
    is_active        boolean,
    is_available     boolean,
    name             varchar(100),
    preparation_time integer,
    price            numeric(10, 2),
    category_id      bigint,
    created_by       bigint,
    updated_by       bigint,
    primary key (rev, id)
);

alter table public.products_aud
    owner to postgres;

