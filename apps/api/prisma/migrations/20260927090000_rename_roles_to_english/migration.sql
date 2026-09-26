DO $$
DECLARE
  legacy_role_id TEXT;
  canonical_role_id TEXT;
BEGIN
  SELECT "id" INTO legacy_role_id FROM "roles" WHERE "name" = 'user';
  SELECT "id" INTO canonical_role_id FROM "roles" WHERE "name" = 'customer';

  IF legacy_role_id IS NOT NULL THEN
    IF canonical_role_id IS NULL THEN
      UPDATE "roles" SET "name" = 'customer' WHERE "id" = legacy_role_id;
    ELSE
      UPDATE "accounts" SET "id_role" = canonical_role_id WHERE "id_role" = legacy_role_id;
      DELETE FROM "roles" WHERE "id" = legacy_role_id;
    END IF;
  END IF;

  legacy_role_id := NULL;
  canonical_role_id := NULL;
  SELECT "id" INTO legacy_role_id FROM "roles" WHERE "name" = 'kasir';
  SELECT "id" INTO canonical_role_id FROM "roles" WHERE "name" = 'cashier';

  IF legacy_role_id IS NOT NULL THEN
    IF canonical_role_id IS NULL THEN
      UPDATE "roles" SET "name" = 'cashier' WHERE "id" = legacy_role_id;
    ELSE
      UPDATE "accounts" SET "id_role" = canonical_role_id WHERE "id_role" = legacy_role_id;
      DELETE FROM "roles" WHERE "id" = legacy_role_id;
    END IF;
  END IF;
END $$;
