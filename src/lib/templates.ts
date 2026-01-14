import { createClient } from "@/lib/supabase/client";
import { TemplateCollection } from "@/types/templates";

export async function getTemplates(): Promise<TemplateCollection> {
    const supabase = createClient();

    const [partiesRes, costumesRes, attributesRes] = await Promise.all([
        supabase.from('party_templates').select('*'),
        supabase.from('costume_templates').select('*'),
        supabase.from('attribute_templates').select('*')
    ]);

    if (partiesRes.error) console.error("Error fetching parties:", partiesRes.error);
    if (costumesRes.error) console.error("Error fetching costumes:", costumesRes.error);
    if (attributesRes.error) console.error("Error fetching attributes:", attributesRes.error);

    return {
        parties: partiesRes.data || [],
        costumes: costumesRes.data || [],
        attributes: attributesRes.data || []
    };
}
