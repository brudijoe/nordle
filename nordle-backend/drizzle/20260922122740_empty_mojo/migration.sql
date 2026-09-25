ALTER TABLE "animals" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
DROP SEQUENCE "animals_id_seq";--> statement-breakpoint
ALTER TABLE "animals" ALTER COLUMN "id" SET DATA TYPE integer USING "id"::integer;--> statement-breakpoint
ALTER TABLE "animals" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "animals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
SELECT setval('animals_id_seq'::regclass, (SELECT COALESCE(MAX(id), 1) FROM "animals"), false);