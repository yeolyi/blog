create table "public"."meme_tags" (
    "id" uuid not null default uuid_generate_v4(),
    "meme_id" uuid,
    "tag_id" uuid
);


alter table "public"."meme_tags" enable row level security;

create table "public"."memes" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "description" text,
    "media_url" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."memes" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "role" text default 'user'::text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."profiles" enable row level security;

create table "public"."tags" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."tags" enable row level security;

CREATE UNIQUE INDEX meme_tags_meme_id_tag_id_key ON public.meme_tags USING btree (meme_id, tag_id);

CREATE UNIQUE INDEX meme_tags_pkey ON public.meme_tags USING btree (id);

CREATE UNIQUE INDEX memes_pkey ON public.memes USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX tags_name_key ON public.tags USING btree (name);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

alter table "public"."meme_tags" add constraint "meme_tags_pkey" PRIMARY KEY using index "meme_tags_pkey";

alter table "public"."memes" add constraint "memes_pkey" PRIMARY KEY using index "memes_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."meme_tags" add constraint "meme_tags_meme_id_fkey" FOREIGN KEY (meme_id) REFERENCES memes(id) ON DELETE CASCADE not valid;

alter table "public"."meme_tags" validate constraint "meme_tags_meme_id_fkey";

alter table "public"."meme_tags" add constraint "meme_tags_meme_id_tag_id_key" UNIQUE using index "meme_tags_meme_id_tag_id_key";

alter table "public"."meme_tags" add constraint "meme_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE not valid;

alter table "public"."meme_tags" validate constraint "meme_tags_tag_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."tags" add constraint "tags_name_key" UNIQUE using index "tags_name_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  RETURN user_role = 'admin';
END;
$function$
;

grant delete on table "public"."meme_tags" to "anon";

grant insert on table "public"."meme_tags" to "anon";

grant references on table "public"."meme_tags" to "anon";

grant select on table "public"."meme_tags" to "anon";

grant trigger on table "public"."meme_tags" to "anon";

grant truncate on table "public"."meme_tags" to "anon";

grant update on table "public"."meme_tags" to "anon";

grant delete on table "public"."meme_tags" to "authenticated";

grant insert on table "public"."meme_tags" to "authenticated";

grant references on table "public"."meme_tags" to "authenticated";

grant select on table "public"."meme_tags" to "authenticated";

grant trigger on table "public"."meme_tags" to "authenticated";

grant truncate on table "public"."meme_tags" to "authenticated";

grant update on table "public"."meme_tags" to "authenticated";

grant delete on table "public"."meme_tags" to "service_role";

grant insert on table "public"."meme_tags" to "service_role";

grant references on table "public"."meme_tags" to "service_role";

grant select on table "public"."meme_tags" to "service_role";

grant trigger on table "public"."meme_tags" to "service_role";

grant truncate on table "public"."meme_tags" to "service_role";

grant update on table "public"."meme_tags" to "service_role";

grant delete on table "public"."memes" to "anon";

grant insert on table "public"."memes" to "anon";

grant references on table "public"."memes" to "anon";

grant select on table "public"."memes" to "anon";

grant trigger on table "public"."memes" to "anon";

grant truncate on table "public"."memes" to "anon";

grant update on table "public"."memes" to "anon";

grant delete on table "public"."memes" to "authenticated";

grant insert on table "public"."memes" to "authenticated";

grant references on table "public"."memes" to "authenticated";

grant select on table "public"."memes" to "authenticated";

grant trigger on table "public"."memes" to "authenticated";

grant truncate on table "public"."memes" to "authenticated";

grant update on table "public"."memes" to "authenticated";

grant delete on table "public"."memes" to "service_role";

grant insert on table "public"."memes" to "service_role";

grant references on table "public"."memes" to "service_role";

grant select on table "public"."memes" to "service_role";

grant trigger on table "public"."memes" to "service_role";

grant truncate on table "public"."memes" to "service_role";

grant update on table "public"."memes" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

create policy "관리자만 밈_태그 삭제 가능"
on "public"."meme_tags"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "관리자만 밈_태그 수정 가능"
on "public"."meme_tags"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "관리자만 밈_태그 추가 가능"
on "public"."meme_tags"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "모든 사용자 밈_태그 조회 가능"
on "public"."meme_tags"
as permissive
for select
to public
using (true);


create policy "관리자만 밈 삭제 가능"
on "public"."memes"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "관리자만 밈 수정 가능"
on "public"."memes"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "관리자만 밈 추가 가능"
on "public"."memes"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "모든 사용자 밈 조회 가능"
on "public"."memes"
as permissive
for select
to public
using (true);


create policy "관리자는 모든 프로필 확인 가능"
on "public"."profiles"
as permissive
for select
to public
using ((is_admin() OR (auth.uid() = id)));


create policy "관리자만 태그 삭제 가능"
on "public"."tags"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "관리자만 태그 수정 가능"
on "public"."tags"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "관리자만 태그 추가 가능"
on "public"."tags"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "모든 사용자 태그 조회 가능"
on "public"."tags"
as permissive
for select
to public
using (true);




