create sequence public.revinfo_seq
    start with 1
    increment by 50
    no minvalue
    no maxvalue
    cache 1;

create table public.revinfo
(
    rev      integer not null
        primary key,
    revtstmp bigint
);

alter table public.revinfo
    alter column rev set default nextval('public.revinfo_seq');

alter table public.revinfo
    owner to postgres;

alter sequence public.revinfo_seq
    owner to postgres;
