import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aquhgtvoczbwirvxpmzv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdWhndHZvY3pid2lydnhwbXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5ODc2ODMsImV4cCI6MjEwMDU2MzY4M30.6guoGm92lvKYW1jMZCot4KIB7xHiAnO8b6kK4mp0fcQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsertWithoutEmail() {
  console.log("Testing Supabase profile insert without email column...");
  const testId = '11111111-2222-3333-4444-555555555555';
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert([{
      id: testId,
      name: 'Test Runner',
      username: 'test_runner_' + Date.now(),
      avatar: 'https://via.placeholder.com/150',
      bio: 'Testing Supabase insertion'
    }])
    .select();

  if (error) {
    console.error("SUPABASE ERROR:", error);
  } else {
    console.log("SUCCESS INSERTED DATA:", data);
  }
}

testInsertWithoutEmail();
