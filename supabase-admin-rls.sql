-- ─── Admin write permissions — run this in Supabase SQL Editor ──────────────
-- This allows authenticated users (you, after login) to add/edit/delete content.

-- Books
create policy "auth insert books"  on books for insert with check (auth.role() = 'authenticated');
create policy "auth update books"  on books for update using (auth.role() = 'authenticated');
create policy "auth delete books"  on books for delete using (auth.role() = 'authenticated');

-- Lectures
create policy "auth insert lectures" on lectures for insert with check (auth.role() = 'authenticated');
create policy "auth update lectures" on lectures for update using (auth.role() = 'authenticated');
create policy "auth delete lectures" on lectures for delete using (auth.role() = 'authenticated');
