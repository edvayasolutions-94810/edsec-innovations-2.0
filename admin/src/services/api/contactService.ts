import { supabase } from '@/integrations/supabase/client';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData) => {
  const { data, error } = await supabase.functions.invoke('send-contact-email', {
    body: formData
  });

  if (error) throw error;
  return data;
};
