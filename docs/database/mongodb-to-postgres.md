# MongoDB to PostgreSQL Migration

This document describes the legacy MongoDB snapshot importer for historical exports. The API now defaults to PostgreSQL through Prisma; MongoDB is not required at runtime. The importer does not migrate production data or make a production release safe by itself.

For any recovered legacy MongoDB export, reconcile all records and relations before importing it. The current PostgreSQL database was empty when initialized, so no legacy records were copied.

The API now uses Prisma/PostgreSQL for every runtime route. The historical
MongoDB importer remains available for a recovered export; legacy Mongoose
controllers are no longer connected to the HTTP runtime and will be removed
after the remaining test scaffolding is migrated.

## Export a consistent snapshot

1. Schedule a maintenance window and stop/disable application writes.
2. Create a protected backup of the MongoDB database and verify it can be restored.
3. Use MongoDB Database Tools' `mongoexport --jsonArray` to export each collection into the private `migration-export/` directory. Required filenames are `roles.json`, `accounts.json`, `customers.json`, `refreshtokens.json`, `categories.json`, `menus.json`, `tables.json`, `orders.json`, `itemorders.json`, and `transactions.json`.
4. The directory is ignored by Git. Keep it access-restricted and remove it according to the data-retention policy after the migration is accepted.

Set `MONGO_EXPORT_URI` from an approved secret store in the local shell; do not commit it or put it in a script. Specify the database separately because the URI may not contain a database name.

PowerShell example:

```powershell
$database = "bukit-delight"
$collections = @(
  "roles", "accounts", "customers", "refreshtokens", "categories",
  "menus", "tables", "orders", "itemorders", "transactions"
)

New-Item -ItemType Directory -Force migration-export | Out-Null

foreach ($collection in $collections) {
  $outputPath = "migration-export/$collection.json"
  mongoexport --uri="$env:MONGO_EXPORT_URI" --db="$database" --collection="$collection" --jsonArray --out="$outputPath"
  if ($LASTEXITCODE -ne 0) {
    throw "mongoexport failed for $collection"
  }
}
```

Confirm every required file exists and is non-empty before continuing. Do not export while writes continue; separate collection exports are not a cross-collection point-in-time snapshot.

## Dry run and import

The importer recognizes Mongo Extended JSON ObjectIds and dates, preserves ObjectId hex strings as relational IDs, imports parent collections before their dependents, and reconciles target IDs after each collection. It inserts in batches and tolerates rerunning the same snapshot after an interrupted import. It never deletes source or target rows.

Legacy role names `user` and `kasir` are normalized to `customer` and
`cashier` during import. The PostgreSQL migration performs the same rename on
existing role rows and preserves account references.
Legacy order ETA fields (`estimasi`) and transaction status values
(`proses`) are normalized to `estimatedReadyAt` and `processing` during
import. PostgreSQL migrations rename the stored column and enum value while
preserving existing data.

Dry run only parses the full snapshot and reports collection counts:

```bash
pnpm db:import -- --input ../../migration-export
```

Apply to a local/shadow database after running Prisma migrations:

```bash
pnpm db:deploy
pnpm db:import -- --input ../../migration-export --apply
```

The importer refuses remote database hosts unless `--allow-remote` is supplied. It reports no row values. Inspect record counts, foreign-key failures, unique-value conflicts, and critical business totals before cutover. On an interrupted import, rerun the exact same immutable snapshot; do not combine snapshots.

## Cutover and rollback

This repository does not contain production credentials or perform a production release. For production, validate PostgreSQL orders and transactions, rehearse PostgreSQL backup/restore, and schedule a release window. Roll back by restoring the verified PostgreSQL backup and the previous application release; do not dual-write.
