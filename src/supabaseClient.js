import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://suluqisjbpfbouggyogm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bHVxaXNqYnBmYm91Z2d5b2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDEyOTEsImV4cCI6MjA1OTAxNzI5MX0.9mXm-iyLWVTKFjCdCf1Jlu13SPIoM22PbdeLImg_D_c'
const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase } 