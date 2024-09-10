CREATE POLICY categories_delete_policy
  ON categories
  FOR DELETE
  USING (auth.role() = 'authenticated');

  CREATE POLICY categories_insert_policy
  ON categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');