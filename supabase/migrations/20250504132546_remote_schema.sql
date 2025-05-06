drop policy "관리자는 모든 프로필 확인 가능" on "public"."profiles";

drop function if exists "public"."toggle_emoji_reaction"(p_post_id text, p_user_id uuid, p_emoji text);

drop function if exists "public"."get_emoji_counts"(p_post_id text);

create table "public"."subscribers" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."subscribers" enable row level security;

CREATE INDEX idx_subscribers_email ON public.subscribers USING btree (email);

CREATE UNIQUE INDEX subscribers_email_key ON public.subscribers USING btree (email);

CREATE UNIQUE INDEX subscribers_pkey ON public.subscribers USING btree (id);

alter table "public"."subscribers" add constraint "subscribers_pkey" PRIMARY KEY using index "subscribers_pkey";

alter table "public"."subscribers" add constraint "subscribers_email_key" UNIQUE using index "subscribers_email_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_subscriber(_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into subscribers (email, created_at)
  values (_email, now())
  on conflict (email) do nothing;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_emoji_counts(p_post_id text)
 RETURNS TABLE(emoji text, count bigint, user_reacted boolean)
 LANGUAGE plpgsql
AS $function$
declare
  v_user_id uuid := auth.uid();
begin
  return query
    select 
      er.emoji, 
      count(*)::bigint,
      bool_or(er.user_id = v_user_id) as user_reacted
    from emoji_reactions er
    where er.post_id = p_post_id
    group by er.emoji
    order by count(*) desc, er.emoji;
end;
$function$
;

grant delete on table "public"."subscribers" to "anon";

grant insert on table "public"."subscribers" to "anon";

grant references on table "public"."subscribers" to "anon";

grant select on table "public"."subscribers" to "anon";

grant trigger on table "public"."subscribers" to "anon";

grant truncate on table "public"."subscribers" to "anon";

grant update on table "public"."subscribers" to "anon";

grant delete on table "public"."subscribers" to "authenticated";

grant insert on table "public"."subscribers" to "authenticated";

grant references on table "public"."subscribers" to "authenticated";

grant select on table "public"."subscribers" to "authenticated";

grant trigger on table "public"."subscribers" to "authenticated";

grant truncate on table "public"."subscribers" to "authenticated";

grant update on table "public"."subscribers" to "authenticated";

grant delete on table "public"."subscribers" to "service_role";

grant insert on table "public"."subscribers" to "service_role";

grant references on table "public"."subscribers" to "service_role";

grant select on table "public"."subscribers" to "service_role";

grant trigger on table "public"."subscribers" to "service_role";

grant truncate on table "public"."subscribers" to "service_role";

grant update on table "public"."subscribers" to "service_role";

create policy "프로필 조회 가능"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "관리자 전체 권한"
on "public"."subscribers"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text));


create policy "이메일 추가 허용"
on "public"."subscribers"
as permissive
for insert
to public
with check (true);


CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.subscribers FOR EACH ROW EXECUTE FUNCTION update_modified_column();


