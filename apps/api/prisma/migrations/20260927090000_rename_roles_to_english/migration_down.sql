DO $$
DECLARE
  current_role_id TEXT;
  previous_role_id TEXT;
BEGIN
  SELECT "id" INTO current_role_id FROM "roles" WHERE "name" = 'customer';
  SELECT "id" INTO previous_role_id FROM "roles" WHERE "name" = 'user';

  IF current_role_id IS NOT NULL THEN
    IF previous_role_id IS NULL THEN
      UPDATE "roles" SET "name" = 'user' WHERE "id" = current_role_id;
    ELSE
      UPDATE "accounts" SET "id_role" = previous_role_id WHERE "id_role" = current_role_id;
      DELETE FROM "roles" WHERE "id" = current_role_id;
    END IF;
  END IF;

  current_role_id := NULL;
  previous_role_id := NULL;
  SELECT "id" INTO current_role_id FROM "roles" WHERE "name" = 'cashier';
  SELECT "id" INTO previous_role_id FROM "roles" WHERE "name" = 'kasir';

  IF current_role_id IS NOT NULL THEN
    IF previous_role_id IS NULL THEN
      UPDATE "roles" SET "name" = 'kasir' WHERE "id" = current_role_id;
    ELSE
      UPDATE "accounts" SET "id_role" = previous_role_id WHERE "id_role" = current_role_id;
      DELETE FROM "roles" WHERE "id" = current_role_id;
    END IF;
  END IF;
END $$;
