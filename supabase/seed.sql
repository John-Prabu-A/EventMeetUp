SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '0848e174-f096-4205-a07c-aee912c70d77', '{"action":"user_confirmation_requested","actor_id":"56a8116f-9a0f-468e-b5ee-2a6eb112c3cc","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-09-20 15:48:20.758303+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd4607c8d-0ae9-41a2-a63e-95519d3fba24', '{"action":"user_confirmation_requested","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-09-20 15:48:49.564949+00', ''),
	('00000000-0000-0000-0000-000000000000', '31fe63c6-fb02-43ca-9f60-4806b68b5fbc', '{"action":"user_confirmation_requested","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-02 09:57:17.866989+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e6f21f7-599c-4317-8a73-6ace0e88b5d4', '{"action":"user_signedup","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"team"}', '2024-10-02 10:30:28.266754+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6b5944d-6e90-493d-8b4f-e6617c202b08', '{"action":"login","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-02 10:31:26.99136+00', ''),
	('00000000-0000-0000-0000-000000000000', '6466afab-2087-4d67-a64c-342c39feade8', '{"action":"login","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-02 12:23:46.333149+00', ''),
	('00000000-0000-0000-0000-000000000000', '60210b72-cfb0-4d2e-aab1-9666945fe2c1', '{"action":"token_refreshed","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-02 13:21:49.531327+00', ''),
	('00000000-0000-0000-0000-000000000000', 'faeae923-aeb6-454f-a447-6f14b4b5046b', '{"action":"token_revoked","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-02 13:21:49.534724+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f1319701-d3f3-4621-9f7c-1d391a0f6302', '{"action":"token_refreshed","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-02 14:20:10.097173+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a40abae-e8e2-4ae5-8eea-3e136ae13c0c', '{"action":"token_revoked","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-02 14:20:10.098203+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8db14ec-fc34-4d7a-ba08-978bfb736ab1', '{"action":"token_refreshed","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-02 15:43:21.56859+00', ''),
	('00000000-0000-0000-0000-000000000000', '9cc4a7a9-c555-47b0-a36e-c7f9136a1ab6', '{"action":"token_revoked","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-02 15:43:21.571483+00', ''),
	('00000000-0000-0000-0000-000000000000', '45362ae1-143d-49f2-ad17-b61c3f4c8667', '{"action":"token_refreshed","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-02 16:41:39.643776+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ddd42b9-3c99-4af1-84d3-f8b46559e3f5', '{"action":"token_revoked","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-02 16:41:39.648604+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1e0ae68-20be-49fb-9f12-982bc97b888c', '{"action":"token_refreshed","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-02 17:39:49.565095+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfaf8596-4877-4a79-94b4-0554ff0a3901', '{"action":"token_revoked","actor_id":"69ed032d-aa91-4f3a-839e-f8941e2a7437","actor_username":"johnprabu0702@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-02 17:39:49.566124+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '56a8116f-9a0f-468e-b5ee-2a6eb112c3cc', 'authenticated', 'authenticated', 'test@gmail.com', '$2a$10$s5dyM6bh5iVuB34l8tiiOO6vPpcYG2Ki9w4eDiLxXQFX22Bj8.Hli', NULL, NULL, 'f716687b5f58b28987641003d219199175eacf7fccad6827e374c84e', '2024-09-20 15:48:20.76344+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"sub": "56a8116f-9a0f-468e-b5ee-2a6eb112c3cc", "email": "test@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-09-20 15:48:20.72408+00', '2024-09-20 15:48:24.270628+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '69ed032d-aa91-4f3a-839e-f8941e2a7437', 'authenticated', 'authenticated', 'johnprabu0702@gmail.com', '$2a$10$FAqoptF4Ju0U8YdBnsVIqO32s47fDIoOm9BB.RPU2u5U5jxjWkg4a', '2024-10-02 10:30:28.267696+00', NULL, '', '2024-10-02 09:57:17.875759+00', '', NULL, '', '', NULL, '2024-10-02 12:23:46.335077+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "69ed032d-aa91-4f3a-839e-f8941e2a7437", "email": "johnprabu0702@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-09-20 15:48:49.559621+00', '2024-10-02 17:39:49.569563+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('56a8116f-9a0f-468e-b5ee-2a6eb112c3cc', '56a8116f-9a0f-468e-b5ee-2a6eb112c3cc', '{"sub": "56a8116f-9a0f-468e-b5ee-2a6eb112c3cc", "email": "test@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-09-20 15:48:20.750387+00', '2024-09-20 15:48:20.750441+00', '2024-09-20 15:48:20.750441+00', 'a95034ef-76a1-41ee-aa59-cd06a51e6a9e'),
	('69ed032d-aa91-4f3a-839e-f8941e2a7437', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '{"sub": "69ed032d-aa91-4f3a-839e-f8941e2a7437", "email": "johnprabu0702@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-09-20 15:48:49.562775+00', '2024-09-20 15:48:49.562824+00', '2024-09-20 15:48:49.562824+00', 'cd205110-129a-42e1-b61a-70bd617fad5e');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('2744a418-1d8e-42d0-8631-04a5b61f16f6', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '2024-10-02 10:30:28.27347+00', '2024-10-02 10:30:28.27347+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36', '14.139.190.98', NULL),
	('12447966-6b06-430c-bb06-b5775033c438', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '2024-10-02 10:31:26.993174+00', '2024-10-02 10:31:26.993174+00', NULL, 'aal1', NULL, NULL, 'okhttp/4.9.2', '14.139.190.98', NULL),
	('af2cb4ec-0b2f-4776-84fd-2d95e5711ea0', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '2024-10-02 12:23:46.335154+00', '2024-10-02 17:39:49.570845+00', NULL, 'aal1', NULL, '2024-10-02 17:39:49.570769', 'okhttp/4.9.2', '223.185.200.136', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('2744a418-1d8e-42d0-8631-04a5b61f16f6', '2024-10-02 10:30:28.290192+00', '2024-10-02 10:30:28.290192+00', 'otp', '0487bc90-6e75-4dfe-bbc0-767d1032299d'),
	('12447966-6b06-430c-bb06-b5775033c438', '2024-10-02 10:31:26.997217+00', '2024-10-02 10:31:26.997217+00', 'password', '83c532f8-e90e-42a4-abf4-4831acd4cd1c'),
	('af2cb4ec-0b2f-4776-84fd-2d95e5711ea0', '2024-10-02 12:23:46.343118+00', '2024-10-02 12:23:46.343118+00', 'password', '4d577c5b-bf36-4cb1-80da-f936c04d5747');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('51ebc6ed-2343-455f-a4f8-9cbe0ba5ad73', '56a8116f-9a0f-468e-b5ee-2a6eb112c3cc', 'confirmation_token', 'f716687b5f58b28987641003d219199175eacf7fccad6827e374c84e', 'test@gmail.com', '2024-09-20 15:48:24.276663', '2024-09-20 15:48:24.276663');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'qJmovKKTkySTrEEWoRYvRw', '69ed032d-aa91-4f3a-839e-f8941e2a7437', false, '2024-10-02 10:30:28.280218+00', '2024-10-02 10:30:28.280218+00', NULL, '2744a418-1d8e-42d0-8631-04a5b61f16f6'),
	('00000000-0000-0000-0000-000000000000', 2, 'ptkICOaFNigCechg2bp3QQ', '69ed032d-aa91-4f3a-839e-f8941e2a7437', false, '2024-10-02 10:31:26.99457+00', '2024-10-02 10:31:26.99457+00', NULL, '12447966-6b06-430c-bb06-b5775033c438'),
	('00000000-0000-0000-0000-000000000000', 3, 'lUE--m-39AZl9XPPO8Xa9A', '69ed032d-aa91-4f3a-839e-f8941e2a7437', true, '2024-10-02 12:23:46.337801+00', '2024-10-02 13:21:49.53523+00', NULL, 'af2cb4ec-0b2f-4776-84fd-2d95e5711ea0'),
	('00000000-0000-0000-0000-000000000000', 4, 'nsCkI1doVFmgZ90QsA5ZBQ', '69ed032d-aa91-4f3a-839e-f8941e2a7437', true, '2024-10-02 13:21:49.537109+00', '2024-10-02 14:20:10.098889+00', 'lUE--m-39AZl9XPPO8Xa9A', 'af2cb4ec-0b2f-4776-84fd-2d95e5711ea0'),
	('00000000-0000-0000-0000-000000000000', 5, 'tTCOMNQwVjvc75gBHC6zsA', '69ed032d-aa91-4f3a-839e-f8941e2a7437', true, '2024-10-02 14:20:10.100326+00', '2024-10-02 15:43:21.572021+00', 'nsCkI1doVFmgZ90QsA5ZBQ', 'af2cb4ec-0b2f-4776-84fd-2d95e5711ea0'),
	('00000000-0000-0000-0000-000000000000', 6, 'ityKSw50sDBvbc0E2_4zyw', '69ed032d-aa91-4f3a-839e-f8941e2a7437', true, '2024-10-02 15:43:21.577456+00', '2024-10-02 16:41:39.64915+00', 'tTCOMNQwVjvc75gBHC6zsA', 'af2cb4ec-0b2f-4776-84fd-2d95e5711ea0'),
	('00000000-0000-0000-0000-000000000000', 7, 'dW2LhzJ11fUNrffFODo1eg', '69ed032d-aa91-4f3a-839e-f8941e2a7437', true, '2024-10-02 16:41:39.652861+00', '2024-10-02 17:39:49.56673+00', 'ityKSw50sDBvbc0E2_4zyw', 'af2cb4ec-0b2f-4776-84fd-2d95e5711ea0'),
	('00000000-0000-0000-0000-000000000000', 8, 'wkvpKmyXR0dxj2rM7AEvng', '69ed032d-aa91-4f3a-839e-f8941e2a7437', false, '2024-10-02 17:39:49.567554+00', '2024-10-02 17:39:49.567554+00', 'dW2LhzJ11fUNrffFODo1eg', 'af2cb4ec-0b2f-4776-84fd-2d95e5711ea0');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "updated_at", "username", "full_name", "avatar_url", "website") VALUES
	('69ed032d-aa91-4f3a-839e-f8941e2a7437', '2024-10-01 13:37:46+00', 'johnprabu', 'John Prabu A', NULL, NULL);


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."events" ("id", "created_at", "title", "description", "date", "location", "image_uri", "user_id", "location_point") VALUES
	(6, '2024-10-02 13:47:05.345303+00', 'Mega Shawarma Fest', 'Shawarma at India', '2024-10-02 13:45:55.168+00', NULL, '1727876778090.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '0101000020E61000008C6BD7DF6D593440A91DB40D12AE5340'),
	(5, '2024-10-02 13:38:40.431542+00', 'Sample event', 'jskjdkfksk', '2024-10-02 13:35:10.463+00', 'Indian Ocean', '1727876778090.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '0101000020E61000003D7C992842945440910C39B69EED40C0'),
	(7, '2024-10-02 15:44:51.788425+00', 'Coding chrompet', 'Learn coding', '2024-10-02 15:43:43.25+00', 'Greenland Sea', '1727883853392.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '0101000020E6100000C784984BAA3620C0F9F884ECBCDA5240'),
	(8, '2024-10-02 16:04:14.524669+00', 'Chennai', 'Good to go', '2024-10-02 16:02:36.492+00', 'Greenland Sea', '1727885003046.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '0101000020E6100000C784984BAA3620C0F9F884ECBCDA5240'),
	(9, '2024-10-02 16:46:45.170469+00', 'Chennai Idly', 'Grand Opening', '2024-10-02 16:45:40.629+00', 'Chennai Silk', '1727887564329.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '0101000020E6100000624AD8853C0954404606B98B30EB2940'),
	(10, '2024-10-02 17:38:06.312827+00', 'Kochi Daba', 'New Launch ', '2024-10-02 16:57:11.493+00', 'Abad Pepper Route', '1727890672931.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '0101000020E610000093D55531B20F53408645FB0E34EF2340');


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."attendance" ("id", "created_at", "user_id", "event_id") VALUES
	(1, '2024-10-02 16:04:27.576769+00', '69ed032d-aa91-4f3a-839e-f8941e2a7437', 8),
	(2, '2024-10-02 16:46:51.25444+00', '69ed032d-aa91-4f3a-839e-f8941e2a7437', 9),
	(3, '2024-10-02 17:53:17.361194+00', '69ed032d-aa91-4f3a-839e-f8941e2a7437', 10);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('avatars', 'avatars', NULL, '2024-10-02 12:30:25.446076+00', '2024-10-02 12:30:25.446076+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('f5891b88-294e-4be3-9e7b-dc837d4ac512', 'avatars', '1727876778090.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '2024-10-02 13:46:18.292635+00', '2024-10-02 13:46:18.292635+00', '2024-10-02 13:46:18.292635+00', '{"eTag": "\"0d4e2fddddb35608981404a672914d5a\"", "size": 149657, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-02T13:46:19.000Z", "contentLength": 149657, "httpStatusCode": 200}', '7cb3984b-a7c4-400c-9640-e9caeff6fb71', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '{}'),
	('96c2c5e4-9f7a-47fe-a22b-c13d927e6547', 'avatars', '1727883853392.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '2024-10-02 15:44:12.684216+00', '2024-10-02 15:44:12.684216+00', '2024-10-02 15:44:12.684216+00', '{"eTag": "\"fa4b7a255aae4318226496168f35f77a\"", "size": 168234, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-02T15:44:13.000Z", "contentLength": 168234, "httpStatusCode": 200}', 'f733fa4b-6b4c-4162-9c52-4d555487efdf', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '{}'),
	('12d7137f-16b6-4f16-8942-b8f95325d424', 'avatars', '1727885003046.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '2024-10-02 16:03:22.67947+00', '2024-10-02 16:03:22.67947+00', '2024-10-02 16:03:22.67947+00', '{"eTag": "\"7a87efebca047dc052df712bed6b3a17\"", "size": 180071, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-02T16:03:23.000Z", "contentLength": 180071, "httpStatusCode": 200}', 'eadef2e8-d08f-4b4a-976d-9e029c7c66dd', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '{}'),
	('053dc516-f5bc-4dda-aa9b-62c2ff359714', 'avatars', '1727887348982.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '2024-10-02 16:42:28.862467+00', '2024-10-02 16:42:28.862467+00', '2024-10-02 16:42:28.862467+00', '{"eTag": "\"11765ccbff18a8d94e9a722c40e4a036\"", "size": 230477, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-02T16:42:29.000Z", "contentLength": 230477, "httpStatusCode": 200}', 'c003ca15-8150-4c6d-a508-166170ddd7d5', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '{}'),
	('3d8b85b3-e83a-4af8-a705-bc4fcb20b1d7', 'avatars', '1727887564329.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '2024-10-02 16:46:03.937348+00', '2024-10-02 16:46:03.937348+00', '2024-10-02 16:46:03.937348+00', '{"eTag": "\"418dfdd2f962b07f1276ccc65e0d86f3\"", "size": 351150, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-02T16:46:04.000Z", "contentLength": 351150, "httpStatusCode": 200}', '88fd05d0-97f2-4ad2-890b-f5b7569739ac', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '{}'),
	('39c9aafd-8f93-481d-8e09-3ef8cdbc03b9', 'avatars', '1727890672931.png', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '2024-10-02 17:37:53.477714+00', '2024-10-02 17:37:53.477714+00', '2024-10-02 17:37:53.477714+00', '{"eTag": "\"d27aa84415787be488872fbd723b0eb4\"", "size": 287661, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-02T17:37:54.000Z", "contentLength": 287661, "httpStatusCode": 200}', '7ef2a414-e7eb-4434-9351-739629bd0f6e', '69ed032d-aa91-4f3a-839e-f8941e2a7437', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 8, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."attendance_id_seq"', 3, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."events_id_seq"', 10, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
