

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_emoji_counts"("p_post_id" "text") RETURNS TABLE("emoji" "text", "count" bigint)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
    select er.emoji, count(*)::bigint
    from emoji_reactions er
    where er.post_id = p_post_id
    group by er.emoji
    order by count(*) desc, er.emoji;
end;
$$;


ALTER FUNCTION "public"."get_emoji_counts"("p_post_id" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."memes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "media_url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."memes" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_random_meme"() RETURNS SETOF "public"."memes"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY 
  SELECT m.* FROM memes m
  ORDER BY random() 
  LIMIT 1;
END;
$$;


ALTER FUNCTION "public"."get_random_meme"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, role, github_id)
  VALUES (
    NEW.id, 
    'user',  -- 모든 신규 사용자는 'user' 역할로 시작
    NEW.raw_user_meta_data->>'user_name'
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  RETURN user_role = 'admin';
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."toggle_emoji_reaction"("p_post_id" "text", "p_emoji" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_auth_id uuid;
  v_profile_id uuid;
  v_existing_id uuid;
begin
  -- 현재 인증된 사용자 ID 가져오기
  v_auth_id := auth.uid();
  
  -- 인증되지 않은 경우 오류
  if v_auth_id is null then
    raise exception '인증되지 않은 사용자입니다';
  end if;
  
  -- profiles 테이블에서 해당 사용자의 id 찾기
  select id into v_profile_id from profiles where id = v_auth_id;
  
  if v_profile_id is null then
    raise exception '프로필을 찾을 수 없습니다';
  end if;

  -- 기존 반응 확인
  select id into v_existing_id from emoji_reactions
  where post_id = p_post_id and user_id = v_profile_id and emoji = p_emoji;
  
  -- 토글 처리: 있으면 삭제, 없으면 추가
  if v_existing_id is not null then
    delete from emoji_reactions where id = v_existing_id;
  else
    insert into emoji_reactions(post_id, user_id, emoji)
    values (p_post_id, v_profile_id, p_emoji);
  end if;
  
  return true;
exception
  when others then
    raise;
end;
$$;


ALTER FUNCTION "public"."toggle_emoji_reaction"("p_post_id" "text", "p_emoji" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."toggle_emoji_reaction"("p_post_id" "text", "p_user_id" "uuid", "p_emoji" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_existing_id uuid;
begin
  select id into v_existing_id from emoji_reactions
  where post_id = p_post_id and user_id = p_user_id and emoji = p_emoji;
  
  if v_existing_id is not null then
    delete from emoji_reactions where id = v_existing_id;
  else
    insert into emoji_reactions(post_id, user_id, emoji)
    values (p_post_id, p_user_id, p_emoji);
  end if;
  
  return true;
end;
$$;


ALTER FUNCTION "public"."toggle_emoji_reaction"("p_post_id" "text", "p_user_id" "uuid", "p_emoji" "text") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "post_id" "text" NOT NULL,
    "content" "text" NOT NULL,
    "author_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."emoji_reactions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "post_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "emoji" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."emoji_reactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."meme_tags" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "meme_id" "uuid",
    "tag_id" "uuid"
);


ALTER TABLE "public"."meme_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'user'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "registration_number" integer NOT NULL,
    "github_id" "text" NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."profiles_registration_number_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."profiles_registration_number_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."profiles_registration_number_seq" OWNED BY "public"."profiles"."registration_number";



CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


ALTER TABLE ONLY "public"."profiles" ALTER COLUMN "registration_number" SET DEFAULT "nextval"('"public"."profiles_registration_number_seq"'::"regclass");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."emoji_reactions"
    ADD CONSTRAINT "emoji_reactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."emoji_reactions"
    ADD CONSTRAINT "emoji_reactions_post_id_user_id_emoji_key" UNIQUE ("post_id", "user_id", "emoji");



ALTER TABLE ONLY "public"."meme_tags"
    ADD CONSTRAINT "meme_tags_meme_id_tag_id_key" UNIQUE ("meme_id", "tag_id");



ALTER TABLE ONLY "public"."meme_tags"
    ADD CONSTRAINT "meme_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."memes"
    ADD CONSTRAINT "memes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



CREATE INDEX "emoji_reactions_post_id_idx" ON "public"."emoji_reactions" USING "btree" ("post_id");



CREATE INDEX "idx_comments_post_id" ON "public"."comments" USING "btree" ("post_id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."emoji_reactions"
    ADD CONSTRAINT "emoji_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."meme_tags"
    ADD CONSTRAINT "meme_tags_meme_id_fkey" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."meme_tags"
    ADD CONSTRAINT "meme_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."emoji_reactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."meme_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."memes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "관리자는 모든 프로필 확인 가능" ON "public"."profiles" FOR SELECT USING (("public"."is_admin"() OR ("auth"."uid"() = "id")));



CREATE POLICY "관리자만 밈 삭제 가능" ON "public"."memes" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "관리자만 밈 수정 가능" ON "public"."memes" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "관리자만 밈 추가 가능" ON "public"."memes" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "관리자만 밈_태그 삭제 가능" ON "public"."meme_tags" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "관리자만 밈_태그 수정 가능" ON "public"."meme_tags" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "관리자만 밈_태그 추가 가능" ON "public"."meme_tags" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "관리자만 태그 삭제 가능" ON "public"."tags" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "관리자만 태그 수정 가능" ON "public"."tags" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "관리자만 태그 추가 가능" ON "public"."tags" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "모든 사용자 댓글 조회 가능" ON "public"."comments" FOR SELECT USING (true);



CREATE POLICY "모든 사용자 밈 조회 가능" ON "public"."memes" FOR SELECT USING (true);



CREATE POLICY "모든 사용자 밈_태그 조회 가능" ON "public"."meme_tags" FOR SELECT USING (true);



CREATE POLICY "모든 사용자 태그 조회 가능" ON "public"."tags" FOR SELECT USING (true);



CREATE POLICY "모든 사용자가 이모지 반응 조회 가능" ON "public"."emoji_reactions" FOR SELECT USING (true);



CREATE POLICY "본인 댓글만 삭제 가능" ON "public"."comments" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "author_id"));



CREATE POLICY "본인 댓글만 수정 가능" ON "public"."comments" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "author_id"));



CREATE POLICY "인증된 사용자만 댓글 작성 가능" ON "public"."comments" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "author_id"));



CREATE POLICY "인증된 사용자만 이모지 추가 가능" ON "public"."emoji_reactions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "자신이 추가한 이모지만 삭제 가능" ON "public"."emoji_reactions" FOR DELETE USING (("auth"."uid"() = "user_id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."get_emoji_counts"("p_post_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_emoji_counts"("p_post_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_emoji_counts"("p_post_id" "text") TO "service_role";



GRANT ALL ON TABLE "public"."memes" TO "anon";
GRANT ALL ON TABLE "public"."memes" TO "authenticated";
GRANT ALL ON TABLE "public"."memes" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_random_meme"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_random_meme"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_random_meme"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."toggle_emoji_reaction"("p_post_id" "text", "p_emoji" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."toggle_emoji_reaction"("p_post_id" "text", "p_emoji" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."toggle_emoji_reaction"("p_post_id" "text", "p_emoji" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."toggle_emoji_reaction"("p_post_id" "text", "p_user_id" "uuid", "p_emoji" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."toggle_emoji_reaction"("p_post_id" "text", "p_user_id" "uuid", "p_emoji" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."toggle_emoji_reaction"("p_post_id" "text", "p_user_id" "uuid", "p_emoji" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."emoji_reactions" TO "anon";
GRANT ALL ON TABLE "public"."emoji_reactions" TO "authenticated";
GRANT ALL ON TABLE "public"."emoji_reactions" TO "service_role";



GRANT ALL ON TABLE "public"."meme_tags" TO "anon";
GRANT ALL ON TABLE "public"."meme_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."meme_tags" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."profiles_registration_number_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profiles_registration_number_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profiles_registration_number_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
