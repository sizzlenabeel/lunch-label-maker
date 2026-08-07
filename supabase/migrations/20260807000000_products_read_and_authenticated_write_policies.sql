-- The application requires a login for all data access. Existing permissive
-- authenticated CRUD policies remain in place; these restrictive policies add
-- the requirement that writes come from an admin. A missing role is treated as
-- a read-only customer.
DO $migration$
DECLARE
  table_name text;
  admin_check text := '(select auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin''';
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'products',
    'allocations',
    'locations',
    'production',
    'requirements'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon', table_name);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO authenticated', table_name);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_admin_insert_guard', table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_admin_update_guard', table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_admin_delete_guard', table_name);

    EXECUTE format(
      'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (%s)',
      table_name || '_admin_insert_guard', table_name, admin_check
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR UPDATE TO authenticated USING (%s) WITH CHECK (%s)',
      table_name || '_admin_update_guard', table_name, admin_check, admin_check
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR DELETE TO authenticated USING (%s)',
      table_name || '_admin_delete_guard', table_name, admin_check
    );
  END LOOP;
END
$migration$;
